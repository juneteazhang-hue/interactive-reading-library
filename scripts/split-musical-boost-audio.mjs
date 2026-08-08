import fs from 'node:fs';
import path from 'node:path';

const source = path.resolve('books/a-musical-boost/audio/source.mp3');
const outputDir = path.dirname(source);
const bytes = fs.readFileSync(source);
const firstFrame = bytes.findIndex((value, index) => index + 3 < bytes.length && value === 0xff && (bytes[index + 1] & 0xe0) === 0xe0);
if (firstFrame < 0) throw new Error('No MPEG audio frame found');

const frameOffsets = [];
let offset = firstFrame;
while (offset + 4 <= bytes.length) {
  const header = bytes.readUInt32BE(offset);
  if ((header >>> 21) !== 0x7ff) break;
  const versionBits = (header >>> 19) & 3;
  const layerBits = (header >>> 17) & 3;
  const bitrateIndex = (header >>> 12) & 15;
  const sampleRateIndex = (header >>> 10) & 3;
  const padding = (header >>> 9) & 1;
  if (versionBits !== 3 || layerBits !== 1 || sampleRateIndex === 3) throw new Error(`Unsupported frame at ${offset}`);
  const bitrate = [0,32,40,48,56,64,80,96,112,128,160,192,224,256,320,0][bitrateIndex];
  const sampleRate = [44100,48000,32000][sampleRateIndex];
  const frameLength = Math.floor(144000 * bitrate / sampleRate) + padding;
  frameOffsets.push(offset);
  offset += frameLength;
}

if (frameOffsets.length < 1000) throw new Error(`Too few frames: ${frameOffsets.length}`);
const wordCounts = [28,36,29,39,35,32,46,58];
const totalWords = wordCounts.reduce((sum, count) => sum + count, 0);
const boundaries = [0];
let cumulative = 0;
for (const count of wordCounts.slice(0, -1)) {
  cumulative += count;
  boundaries.push(Math.round(frameOffsets.length * cumulative / totalWords));
}
boundaries.push(frameOffsets.length);

wordCounts.forEach((_, index) => {
  const start = frameOffsets[boundaries[index]];
  const endIndex = boundaries[index + 1];
  const end = endIndex < frameOffsets.length ? frameOffsets[endIndex] : offset;
  const target = path.join(outputDir, `page-${index + 1}.mp3`);
  fs.writeFileSync(target, bytes.subarray(start, end));
  const duration = (endIndex - boundaries[index]) * 1152 / 44100;
  console.log(`${path.basename(target)}\t${duration.toFixed(2)}s\t${end - start} bytes`);
});
