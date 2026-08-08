#!/usr/bin/env python3
"""Split the imported Van Gogh narration at MPEG frame boundaries.

This fallback is deliberately dependency-free: the task environment has no
ffmpeg/ffprobe, so each output copies complete Layer III frames from the
authoritative source.  That preserves playback and the source encoding while
keeping every cut on a decodable frame boundary.  If a listening review finds
a sentence cut, record its reviewed time in FRAME_BOUNDARY_OVERRIDES.
"""

from __future__ import annotations

from bisect import bisect_left
from dataclasses import dataclass
from pathlib import Path
import shutil


REPOSITORY_ROOT = Path(__file__).resolve().parent.parent
AUDIO_DIRECTORY = REPOSITORY_ROOT / "books" / "van-goghs-world" / "audio"
SOURCE_FILE = AUDIO_DIRECTORY / "source.mp3"
SCENE_WORD_WEIGHTS = [68, 146, 101, 120, 139, 70, 67, 123]
MIN_BOUNDARY_GAP_SECONDS = 3.0
MAX_PREROLL_SECONDS = 0.08

# Optional review map: scene boundary number (1-7) -> approved time in seconds.
# Populate only after listening; an empty map keeps the reproducible word-weight
# targets below. Each override must follow the sentence ending scene N.
FRAME_BOUNDARY_OVERRIDES: dict[int, float] = {}


@dataclass(frozen=True)
class Frame:
    start: int
    end: int
    duration: float
    main_data_begin: int
    main_data_length: int


def _synchsafe_int(value: bytes) -> int:
    return sum((byte & 0x7F) << (7 * (3 - index)) for index, byte in enumerate(value))


def _audio_start(data: bytes) -> int:
    if data.startswith(b"ID3") and len(data) >= 10:
        flags = data[5]
        return 10 + _synchsafe_int(data[6:10]) + (10 if flags & 0x10 else 0)
    return 0


def _frame_properties(header: int) -> tuple[int, float] | None:
    if (header >> 21) & 0x7FF != 0x7FF:
        return None
    version_bits = (header >> 19) & 0x3
    layer_bits = (header >> 17) & 0x3
    bitrate_index = (header >> 12) & 0xF
    sample_rate_index = (header >> 10) & 0x3
    padding = (header >> 9) & 0x1
    if version_bits == 1 or layer_bits != 1 or bitrate_index in (0, 15) or sample_rate_index == 3:
        return None

    is_mpeg1 = version_bits == 3
    bitrates = (
        [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 0]
        if is_mpeg1
        else [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, 0]
    )
    sample_rates = (
        [44100, 48000, 32000]
        if is_mpeg1
        else [22050, 24000, 16000]
        if version_bits == 2
        else [11025, 12000, 8000]
    )
    bitrate = bitrates[bitrate_index] * 1000
    sample_rate = sample_rates[sample_rate_index]
    samples_per_frame = 1152 if is_mpeg1 else 576
    frame_length = (144 * bitrate // sample_rate + padding) if is_mpeg1 else (72 * bitrate // sample_rate + padding)
    return frame_length, samples_per_frame / sample_rate


def parse_mpeg_frames(data: bytes) -> list[Frame]:
    """Return contiguous, decodable Layer III frames from a source MP3."""
    offset = _audio_start(data)
    frames: list[Frame] = []
    while offset + 4 <= len(data):
        properties = _frame_properties(int.from_bytes(data[offset:offset + 4], "big"))
        if properties is None:
            if frames:
                break
            offset += 1
            continue
        frame_length, duration = properties
        end = offset + frame_length
        if end > len(data):
            break
        header = int.from_bytes(data[offset:offset + 4], "big")
        protection_bit = (header >> 16) & 0x1
        channel_mode = (header >> 6) & 0x3
        side_info_offset = offset + 4 + (0 if protection_bit else 2)
        side_info_length = 17 if channel_mode == 3 else 32
        main_data_offset = side_info_offset + side_info_length
        if main_data_offset > end:
            raise ValueError(f"Incomplete Layer III side information at {offset}")
        main_data_begin = (data[side_info_offset] << 1) | (data[side_info_offset + 1] >> 7)
        frames.append(Frame(offset, end, duration, main_data_begin, end - main_data_offset))
        offset = end
    if not frames:
        raise ValueError("No valid MPEG Layer III frames found in source.mp3")
    return frames


def _nearest_frame_index(frame_times: list[float], target: float) -> int:
    index = bisect_left(frame_times, target)
    if index == 0:
        return 0
    if index == len(frame_times):
        return len(frame_times) - 1
    return index if frame_times[index] - target < target - frame_times[index - 1] else index - 1


def choose_boundaries(frames: list[Frame]) -> tuple[list[int], list[float], list[float]]:
    """Choose nine frame indices, weighted by the eight source-scene lengths."""
    frame_times = [0.0]
    for frame in frames:
        frame_times.append(frame_times[-1] + frame.duration)
    source_duration = frame_times[-1]
    total_weight = sum(SCENE_WORD_WEIGHTS)
    targets = [source_duration * sum(SCENE_WORD_WEIGHTS[:scene]) / total_weight for scene in range(1, 8)]
    boundary_indices = [0]
    for scene, target in enumerate(targets, start=1):
        reviewed_target = FRAME_BOUNDARY_OVERRIDES.get(scene, target)
        candidate = _nearest_frame_index(frame_times, reviewed_target)
        minimum_index = _nearest_frame_index(frame_times, frame_times[boundary_indices[-1]] + MIN_BOUNDARY_GAP_SECONDS)
        candidate = max(candidate, minimum_index)
        if candidate >= len(frames):
            raise ValueError(f"Boundary {scene} leaves no audio for its following scene")
        boundary_indices.append(candidate)
    boundary_indices.append(len(frames))
    boundaries = [frame_times[index] for index in boundary_indices]
    if len(boundaries) != 9:
        raise ValueError(f"Expected nine boundaries, got {len(boundaries)}")
    if any(later - earlier < MIN_BOUNDARY_GAP_SECONDS for earlier, later in zip(boundaries, boundaries[1:])):
        raise ValueError("A clip is shorter than the minimum three-second boundary gap")
    return boundary_indices, boundaries, targets


def minimum_preroll_start(frames: list[Frame], intended_start: int) -> int:
    """Return the shortest complete-frame preroll that supplies the bit reservoir."""
    if intended_start == 0:
        return 0
    required_bytes = frames[intended_start].main_data_begin
    supplied_bytes = 0
    preroll_start = intended_start
    while supplied_bytes < required_bytes:
        preroll_start -= 1
        if preroll_start < 0:
            raise ValueError("Source does not contain enough preceding main-data bytes")
        supplied_bytes += frames[preroll_start].main_data_length
    preroll_duration = sum(frame.duration for frame in frames[preroll_start:intended_start])
    if preroll_duration > MAX_PREROLL_SECONDS:
        raise ValueError(
            f"Required preroll ({preroll_duration:.3f}s) exceeds the approved {MAX_PREROLL_SECONDS:.3f}s cap"
        )
    return preroll_start


def main() -> None:
    if not SOURCE_FILE.is_file():
        raise FileNotFoundError(f"Authoritative source is missing: {SOURCE_FILE}")
    data = SOURCE_FILE.read_bytes()
    frames = parse_mpeg_frames(data)
    boundary_indices, boundaries, targets = choose_boundaries(frames)
    print("Candidate boundaries (seconds):")
    for number, boundary in enumerate(boundaries):
        label = "start" if number == 0 else "end" if number == 8 else f"scene {number} / {number + 1}"
        target = "" if number in (0, 8) else f" (weighted target {targets[number - 1]:.3f})"
        print(f"  {number}: {label}: {boundary:.3f}{target}")

    for page_number in range(1, 9):
        intended_start_frame = boundary_indices[page_number - 1]
        start_frame = minimum_preroll_start(frames, intended_start_frame)
        end_frame = boundary_indices[page_number]
        if end_frame <= start_frame:
            raise ValueError(f"page-{page_number}.mp3 would be empty")
        output = AUDIO_DIRECTORY / f"page-{page_number}.mp3"
        output.write_bytes(data[frames[start_frame].start:frames[end_frame - 1].end])
        if not output.is_file() or output.stat().st_size == 0:
            raise ValueError(f"Failed to produce nonempty output: {output}")
        preroll_frames = frames[start_frame:intended_start_frame]
        preroll_duration = sum(frame.duration for frame in preroll_frames)
        preroll_bytes = sum(frame.main_data_length for frame in preroll_frames)
        required_bytes = frames[intended_start_frame].main_data_begin
        print(
            f"  page-{page_number}.mp3: intended {boundaries[page_number] - boundaries[page_number - 1]:.3f}s, "
            f"preroll {preroll_duration:.3f}s ({len(preroll_frames)} frames, {preroll_bytes}/{required_bytes} reservoir bytes), "
            f"{output.stat().st_size} bytes"
        )

    output_files = list(AUDIO_DIRECTORY.glob("page-*.mp3"))
    if len(output_files) != 8 or any(file.stat().st_size == 0 for file in output_files):
        raise ValueError("Splitter did not produce exactly eight nonempty page clips")


if __name__ == "__main__":
    main()
