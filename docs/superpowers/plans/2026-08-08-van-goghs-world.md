# Van Gogh's World Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a complete eight-scene, movie-style RE3 close-reading experience for *Van Gogh's World* to the existing GitHub Pages library.

**Architecture:** Follow the existing book package contract: `pages.js` owns source-backed paragraph data and base questions, while `content.js` enriches those pages with sentence lessons, Bloom metadata, bubble positions, retelling data, and book metadata. Static image and MP3 assets live beside the book; the shared reader consumes the package without book-specific UI branches.

**Tech Stack:** Static HTML/CSS/JavaScript, Node.js built-in test runner, ffmpeg/ffprobe for source-audio inspection and lossless scene splitting, image generation for 1440×960 PNG scenes, GitHub Pages relative assets.

## Global Constraints

- Book ID is exactly `van-goghs-world`.
- English source text is transcribed from `RE3-U11a.pdf`; teaching notes inform analysis but do not override the textbook.
- Produce exactly eight reading scenes, sixteen four-choice questions, and eight retelling cards.
- Each reading scene has one to two sentence lessons and two imitation exercises per lesson.
- Use original `Level 3 Reading 11A_0.mp3`, split only at natural pauses; never cut a word or sentence.
- Use exactly eight 1440×960 landscape scene PNGs and one portrait library cover PNG.
- Keep the same recognizable Van Gogh character design, period clothing, hair, beard, and facial proportions across all eight images.
- Handle mental illness, self-injury, and death factually, respectfully, and without graphic imagery.
- All browser paths are relative, case-matched, and valid on GitHub Pages.
- Do not modify unrelated dirty files or commit user-owned changes.

---

## File Map

- Create `books/van-goghs-world/pages.js`: eight source-backed page objects with paragraphs, translations, vocabulary, questions, image paths, and audio paths.
- Create `books/van-goghs-world/content.js`: lesson enrichment, question metadata, bubble positions, retelling, and `READING_BOOK` registration.
- Create `books/van-goghs-world/segmentation-report.md`: A-I paragraph-to-scene traceability and word-count audit.
- Create `books/van-goghs-world/audit-report.md`: English, Chinese, vocabulary, grammar, question, sensitive-content, asset, and path review record.
- Create `books/van-goghs-world/character-bible.md`: invariant Van Gogh appearance and per-scene visual direction.
- Create `books/van-goghs-world/assets/cover.png`: portrait library cover, distinct from the textbook cover.
- Create `books/van-goghs-world/assets/textbook-cover.webp`: supplied RE3 textbook identity image.
- Create `books/van-goghs-world/assets/reading-page-{1..8}.png`: eight consistent 1440×960 movie/oil-painting scenes.
- Create `books/van-goghs-world/audio/source.mp3`: supplied original narration.
- Create `books/van-goghs-world/audio/page-{1..8}.mp3`: natural-pause scene clips.
- Create `scripts/split-van-gogh-audio.py`: reproducible ffmpeg silence detection and scene splitting.
- Modify `scripts/catalog.js`: register the fourth library item.
- Modify `tests/library.test.mjs`: encode the RE3 teaching, asset, audio, catalog, and sensitive-content contracts.

### Task 1: Lock Segmentation and Base Teaching Contract

**Files:**
- Create: `books/van-goghs-world/segmentation-report.md`
- Create: `books/van-goghs-world/pages.js`
- Modify: `tests/library.test.mjs`

**Interfaces:**
- Produces: `globalThis.READING_PAGES: ReadingPage[]` where every page has `id`, `title`, `kicker`, `paragraph`, `translation`, `image`, `audio`, `vocabulary`, and `questions`.
- Produces: `vocabulary` records shaped as `[word, phonetic, partOfSpeech, chinese, englishDefinition]`.
- Produces: base question objects shaped as `{ level, question, choices, answer, evidence }`.

- [ ] **Step 1: Add a failing eight-scene source contract test**

```js
test("Van Gogh's World locks eight source-backed scenes", () => {
  const { READING_PAGES: pages } = runScript('books/van-goghs-world/pages.js');
  assert.equal(pages.length, 8);
  assert.deepEqual(pages.map(page => page.id), [
    'world-recognizes-van-gogh', 'artist-is-born', 'discovering-color',
    'descent-into-madness', 'illness-and-creativity', 'seventy-productive-days',
    'end-of-his-life', 'van-goghs-legacy'
  ]);
  assert.equal(pages.flatMap(page => page.questions).length, 16);
  pages.forEach((page, index) => {
    assert.ok(page.paragraph.split(/\s+/).length >= 45, `page ${index + 1} source text`);
    assert.match(page.translation, /[\u3400-\u9fff]/);
    assert.ok(page.vocabulary.length >= 4 && page.vocabulary.length <= 6);
    assert.equal(page.image, `assets/reading-page-${index + 1}.png`);
    assert.equal(page.audio, `audio/page-${index + 1}.mp3`);
    assert.deepEqual(page.questions.map(item => item.level), ['understand', 'analyze']);
  });
});
```

- [ ] **Step 2: Run the new test and verify the missing book fails**

Run: `node --test --test-name-pattern="Van Gogh's World locks" tests/library.test.mjs`

Expected: FAIL because `books/van-goghs-world/pages.js` does not exist.

- [ ] **Step 3: Write the segmentation report with exact paragraph coverage**

Record these mappings and exact source boundaries:

```text
1 A | opening “Starry nights and sunflowers” | closing “ability to move us?”
2 B | opening “Vincent van Gogh was born” | closing “his brother Theo.”
3 C | opening “In 1886, van Gogh moved” | closing “a person’s face.”
4 D | opening “Few who lived in van Gogh’s time” | closing “his own earlobe.”
5 E-F | opening “He never explained why” | closing “necessity for my recovery.”
6 G | opening “Following his release” | closing “a billion U.S. dollars.”
7 H | opening “It was at this time” | closing “mental illness, loneliness?”
8 I | opening “Over a century after his death” | closing “live on forever.”
```

- [ ] **Step 4: Create `pages.js` with verbatim paragraph text and reviewed teaching records**

Use this exact record constructor so malformed page data fails immediately:

```js
(() => {
  const page = (id, title, kicker, paragraph, translation, index, vocabulary, questions) => {
    if (!paragraph || !translation || vocabulary.length < 4 || questions.length !== 2) {
      throw new Error(`Incomplete reading page: ${id}`);
    }
    return { id, title, kicker, paragraph, translation, image: `assets/reading-page-${index}.png`, audio: `audio/page-${index}.mp3`, vocabulary, questions };
  };
  // After the eight reviewed page(...) records are authored, expose them once:
  globalThis.READING_PAGES = pages;
})();
```

Immediately before the assignment, declare `const pages` as eight `page(...)` calls in the Step 3 order. The arguments for each call are the exact source range, reviewed Chinese translation, four to six vocabulary records, and two fully authored questions for the corresponding mapping. The implemented file must contain no omitted source text.

- [ ] **Step 5: Run the focused contract test**

Run: `node --test --test-name-pattern="Van Gogh's World locks" tests/library.test.mjs`

Expected: PASS.

- [ ] **Step 6: Commit the independent base-data deliverable**

```powershell
git add books/van-goghs-world/pages.js books/van-goghs-world/segmentation-report.md tests/library.test.mjs
git commit -m "Add Van Gogh source-backed reading pages"
```

### Task 2: Add Sentence Lessons, Bloom Metadata, and Retelling

**Files:**
- Create: `books/van-goghs-world/content.js`
- Create: `books/van-goghs-world/audit-report.md`
- Modify: `tests/library.test.mjs`

**Interfaces:**
- Consumes: `globalThis.READING_PAGES` from Task 1.
- Produces: `globalThis.READING_BOOK` with `id: 'van-goghs-world'`, eight enriched pages, and eight retelling cards.
- Adds each page's `sentences`, `bubblePositions`; adds each question's `skill`, `bubble`, and `rationale`.

- [ ] **Step 1: Add a failing complete teaching-contract test**

```js
test("Van Gogh's World satisfies the RE3 teaching contract", () => {
  const book = loadBook('van-goghs-world');
  assert.deepEqual(
    [book.id, book.title, book.titleZh, book.textbook, book.level],
    ['van-goghs-world', "Van Gogh's World", '梵高的世界', 'READING EXPLORER 3 · THIRD EDITION', 'RE Level 3']
  );
  assert.equal(book.pages.length, 8);
  assert.equal(book.retelling.length, 8);
  book.pages.forEach((page, pageIndex) => {
    assert.ok(page.sentences.length >= 1 && page.sentences.length <= 2);
    assert.equal(page.bubblePositions.length, 2);
    page.sentences.forEach((lesson, lessonIndex) => {
      assert.ok(page.paragraph.includes(lesson.sentence), `page ${pageIndex + 1} lesson ${lessonIndex + 1}`);
      assert.equal(lesson.exercises.length, 2);
      assert.ok(lesson.pattern && lesson.grammar && lesson.example && lesson.exampleTranslation);
    });
    page.questions.forEach(question => {
      assert.equal(question.choices.length, 4);
      assert.ok(question.skill && question.bubble && question.rationale);
    });
  });
});
```

- [ ] **Step 2: Run the test and verify the missing enrichment fails**

Run: `node --test --test-name-pattern="RE3 teaching contract" tests/library.test.mjs`

Expected: FAIL because `content.js` is missing.

- [ ] **Step 3: Implement enrichment using the established book adapter**

```js
(() => {
  const pages = globalThis.READING_PAGES;
  const lessons = globalThis.VAN_GOGH_LESSONS;
  const metadata = globalThis.VAN_GOGH_QUESTION_METADATA;
  if (lessons.length !== 8 || metadata.length !== 8) throw new Error('Van Gogh enrichment must cover eight scenes.');
  const bubblePositions = [
    [{ left: 28, top: 42 }, { left: 74, top: 72 }],
    [{ left: 72, top: 40 }, { left: 28, top: 72 }],
    [{ left: 28, top: 40 }, { left: 74, top: 70 }],
    [{ left: 72, top: 42 }, { left: 28, top: 72 }],
    [{ left: 28, top: 42 }, { left: 74, top: 72 }],
    [{ left: 72, top: 40 }, { left: 28, top: 70 }],
    [{ left: 28, top: 42 }, { left: 74, top: 72 }],
    [{ left: 72, top: 42 }, { left: 28, top: 70 }]
  ];
  pages.forEach((page, index) => {
    page.sentences = lessons[index];
    page.bubblePositions = bubblePositions[index];
    page.questions.forEach((question, qIndex) => Object.assign(question, metadata[index][qIndex]));
  });
  globalThis.READING_BOOK = {
    id: 'van-goghs-world', title: "Van Gogh's World", titleZh: '梵高的世界',
    textbook: 'READING EXPLORER 3 · THIRD EDITION', grade: '初中', level: 'RE Level 3',
    difficulty: '进阶', cover: 'assets/cover.png', textbookCover: 'assets/textbook-cover.webp',
    description: 'Explore how Vincent van Gogh’s struggles, colors, creativity, and life story shaped his lasting legacy.',
    pages, retelling: globalThis.VAN_GOGH_RETELLING
  };
})();
```

Define the three constants in the same closure before use. The sentence set must use the exact source sentences containing these structures: `Probably no other artist, at any time in any culture, has achieved such popularity.`, `he began to study art in Brussels, receiving financial help from his brother Theo.`, `Following an argument with fellow artist Paul Gauguin, van Gogh took a razor and cut off his own earlobe.`, `He began to have attacks during which he would hear strange sounds and think people were trying to hurt him.`, `some now think it may have been a form of manic depression.`, `Whatever his condition, van Gogh’s illness both inhibited and inspired his creativity.`, `It was at this time that van Gogh either borrowed or stole a gun.`, and `they are also buying a piece of his story, which, like his work, will live on forever.`

- [ ] **Step 4: Write the audit report**

Record a pass/fail row for all eight scenes covering source accuracy, translation, IPA, POS, English definition, grammar, two exercises per lesson, unique MCQ answer, Bloom fit, sensitive-content treatment, and retelling alignment. Every row must be `PASS` before release.

- [ ] **Step 5: Run the focused teaching test**

Run: `node --test --test-name-pattern="RE3 teaching contract" tests/library.test.mjs`

Expected: PASS.

- [ ] **Step 6: Commit the teaching package**

```powershell
git add books/van-goghs-world/content.js books/van-goghs-world/audit-report.md tests/library.test.mjs
git commit -m "Add Van Gogh close-reading lessons"
```

### Task 3: Import and Split the Original Narration

**Files:**
- Create: `books/van-goghs-world/audio/source.mp3`
- Create: `books/van-goghs-world/audio/page-{1..8}.mp3`
- Create: `scripts/split-van-gogh-audio.py`
- Modify: `tests/library.test.mjs`

**Interfaces:**
- Consumes: supplied `D:\RE教学\Level 3 Reading 11A_0.mp3`.
- Produces: eight MP3 clips referenced by Task 1 page objects.

- [ ] **Step 1: Add a failing narration asset test**

```js
test("Van Gogh's World provides eight playable original clips", () => {
  const book = loadBook('van-goghs-world');
  book.pages.forEach((page, index) => {
    const file = `books/van-goghs-world/${page.audio}`;
    assert.ok(exists(file), `page ${index + 1} narration`);
    const info = mp3Info(file);
    assert.ok(info.duration >= 10 && info.duration <= 120);
    assert.ok(info.sampleRate >= 16000 && info.sampleRate <= 48000);
    assert.ok(info.size >= 80_000);
  });
});
```

- [ ] **Step 2: Run the test and verify all clips are missing**

Run: `node --test --test-name-pattern="original clips" tests/library.test.mjs`

Expected: FAIL at `page 1 narration`.

- [ ] **Step 3: Copy the source and detect natural pauses**

Run:

```powershell
Copy-Item -LiteralPath 'D:\RE教学\Level 3 Reading 11A_0.mp3' -Destination 'books\van-goghs-world\audio\source.mp3'
ffmpeg -hide_banner -i 'books\van-goghs-world\audio\source.mp3' -af silencedetect=noise=-35dB:d=0.35 -f null NUL 2> 'tmp\van-gogh-silence.txt'
```

The splitter will select seven silence midpoints closest to cumulative transcript word ratios and print the chosen boundaries. Listen around each printed boundary and reject the run if it does not follow the final punctuation of the matching scene.

- [ ] **Step 4: Implement reproducible splitting**

```python
from pathlib import Path
import json, re, subprocess

root = Path(__file__).resolve().parents[1]
source = root / 'books/van-goghs-world/audio/source.mp3'
audio_dir = source.parent
scene_words = [68, 146, 101, 120, 139, 70, 67, 123]

probe = subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'json', str(source)], text=True)
duration = float(json.loads(probe)['format']['duration'])
scan = subprocess.run(['ffmpeg', '-hide_banner', '-i', str(source), '-af', 'silencedetect=noise=-35dB:d=0.35', '-f', 'null', 'NUL'], text=True, capture_output=True, check=False)
starts = [float(value) for value in re.findall(r'silence_start: ([0-9.]+)', scan.stderr)]
ends = [float(value) for value in re.findall(r'silence_end: ([0-9.]+)', scan.stderr)]
candidates = [(start + end) / 2 for start, end in zip(starts, ends)]
targets, running, total = [], 0, sum(scene_words)
for count in scene_words[:-1]:
    running += count
    targets.append(duration * running / total)
chosen = []
for target in targets:
    allowed = [point for point in candidates if (not chosen or point > chosen[-1] + 3)]
    if not allowed:
        raise RuntimeError(f'No natural pause available after {target:.2f}s')
    chosen.append(min(allowed, key=lambda point: abs(point - target)))
boundaries = [0.0, *chosen, duration]
print('Reviewed boundary candidates:', ', '.join(f'{value:.3f}' for value in boundaries))
for index, (start, end) in enumerate(zip(boundaries, boundaries[1:]), 1):
    subprocess.run(['ffmpeg', '-y', '-hide_banner', '-loglevel', 'error', '-ss', f'{start:.3f}', '-t', f'{end-start:.3f}', '-i', str(source), '-map_metadata', '-1', '-codec:a', 'libmp3lame', '-b:a', '128k', str(audio_dir / f'page-{index}.mp3')], check=True)
```

If manual review finds an incorrect candidate, tighten `silencedetect` between `-32dB` and `-40dB` or duration between `0.25` and `0.6`, rerun, and commit only a version whose eight outputs begin and end on complete sentences.

- [ ] **Step 5: Listen to every clip start and end, then run the asset test**

Run: `node --test --test-name-pattern="original clips" tests/library.test.mjs`

Expected: PASS, with no clipped opening or ending words in manual playback.

- [ ] **Step 6: Commit the audio deliverable**

```powershell
git add books/van-goghs-world/audio scripts/split-van-gogh-audio.py tests/library.test.mjs
git commit -m "Add original Van Gogh narration clips"
```

### Task 4: Generate the Consistent Eight-Scene Visual Set

**Files:**
- Create: `books/van-goghs-world/character-bible.md`
- Create: `books/van-goghs-world/assets/reading-page-{1..8}.png`
- Create: `books/van-goghs-world/assets/cover.png`
- Create: `books/van-goghs-world/assets/textbook-cover.webp`
- Modify: `tests/library.test.mjs`

**Interfaces:**
- Consumes: the eight narrative scene IDs from Task 1.
- Produces: paths already referenced by `pages.js` and `content.js`.

- [ ] **Step 1: Add a failing visual asset contract**

```js
test("Van Gogh's World provides a consistent high-resolution visual set", () => {
  const book = loadBook('van-goghs-world');
  book.pages.forEach((page, index) => {
    const file = `books/van-goghs-world/${page.image}`;
    assert.ok(exists(file), `scene ${index + 1}`);
    assert.deepEqual(pngDimensions(file), [1440, 960]);
    assert.ok(fs.statSync(path.join(root, file)).size > 100_000);
  });
  assert.ok(exists(`books/van-goghs-world/${book.cover}`));
  assert.ok(exists(`books/van-goghs-world/${book.textbookCover}`));
});
```

- [ ] **Step 2: Run the test and verify the image files are missing**

Run: `node --test --test-name-pattern="high-resolution visual set" tests/library.test.mjs`

Expected: FAIL at `scene 1`.

- [ ] **Step 3: Write and lock the character bible**

Define the invariant hero as: Dutch male artist, lean angular face, pale skin, short swept-back red hair, neat red beard, blue-green eyes, late-19th-century dark teal work jacket over an ochre waistcoat and cream shirt; expressive but never caricatured. Define a younger clean-shaven variation only for scene 2 and gradual age progression afterward.

- [ ] **Step 4: Generate eight 3:2 images with one shared style prefix**

Shared prefix:

```text
Cinematic animated biographical film fused with expressive post-impressionist oil texture, vivid cobalt blue, deep indigo, sunflower yellow and burning orange, swirling short brushstrokes, volumetric light, painterly depth, historically grounded late-19th-century Europe, emotionally respectful, consistent character bible, no text, no watermark, landscape 3:2.
```

Scene directives:

1. Van Gogh surrounded by luminous motifs of stars, sunflowers, self-portraits and a café, visualizing worldwide recognition.
2. Young Van Gogh drawing in rural Zundert, with a strict father and abandoned job objects in the distance.
3. Van Gogh in a Paris studio discovering blue, red, yellow and orange beside Impressionist canvases.
4. Isolated Van Gogh painting late at night in Arles after disagreement; show emotional strain, no injury or blade.
5. Calm hospital-room studio in Saint-Rémy, Van Gogh painting a swirling starry sky through the window.
6. Van Gogh painting outdoors in Auvers amid many fresh canvases, urgent productive energy and summer fields.
7. A quiet empty chair, folded coat, unfinished canvas and fading afternoon light; symbolic, non-graphic end-of-life scene.
8. Modern museum visitors moved by Van Gogh paintings, his translucent artistic presence carried forward through color.

- [ ] **Step 5: Create the library cover and copy the supplied textbook cover**

The portrait cover uses scene-1 visual language, includes no baked-in text, and leaves clean lower space for HTML title overlays. Convert or copy supplied `OIP.webp` without changing its aspect ratio to `assets/textbook-cover.webp`.

- [ ] **Step 6: Inspect all nine generated images as contact sheets and full resolution**

Reject and regenerate any image with inconsistent beard/hair/clothing, modern objects, illegible artifacts, graphic harm, baked-in words, distorted hands, or a subject unrelated to the assigned scene.

- [ ] **Step 7: Normalize scene images to exact dimensions and run the test**

Run: `node --test --test-name-pattern="high-resolution visual set" tests/library.test.mjs`

Expected: PASS with each scene exactly 1440×960.

- [ ] **Step 8: Commit the visual deliverable**

```powershell
git add books/van-goghs-world/assets books/van-goghs-world/character-bible.md tests/library.test.mjs
git commit -m "Add Van Gogh cinematic visual set"
```

### Task 5: Register the Book in the Library

**Files:**
- Modify: `scripts/catalog.js`
- Modify: `tests/library.test.mjs`

**Interfaces:**
- Consumes: book ID and metadata from Task 2.
- Produces: homepage card linking to `reader.html?book=van-goghs-world` through the existing library renderer.

- [ ] **Step 1: Change the catalog test to require four books**

```js
test('catalog registers all four books', () => {
  const { READING_CATALOG } = runScript('scripts/catalog.js');
  assert.deepEqual(READING_CATALOG.map(item => item.id), [
    'rise-of-the-earth-dragon', 'saving-the-sun-dragon',
    'a-musical-boost', 'van-goghs-world'
  ]);
  assert.equal(READING_CATALOG[3].pages, 8);
  assert.equal(READING_CATALOG[3].textbookCover, 'books/van-goghs-world/assets/textbook-cover.webp');
});
```

- [ ] **Step 2: Run the catalog test and verify it reports only three books**

Run: `node --test --test-name-pattern="catalog registers all four" tests/library.test.mjs`

Expected: FAIL because `van-goghs-world` is absent.

- [ ] **Step 3: Append the exact catalog record**

```js
{
  id: 'van-goghs-world',
  title: "Van Gogh's World",
  titleZh: '梵高的世界',
  textbook: 'READING EXPLORER 3 · THIRD EDITION',
  grade: '初中',
  level: 'RE Level 3',
  difficulty: '进阶',
  pages: 8,
  cover: 'books/van-goghs-world/assets/cover.png',
  textbookCover: 'books/van-goghs-world/assets/textbook-cover.webp',
  description: '走进梵高的色彩、挣扎、创造力与永恒艺术遗产。'
}
```

- [ ] **Step 4: Run the full Node test suite**

Run: `node --test tests/library.test.mjs`

Expected: all tests PASS.

- [ ] **Step 5: Commit the catalog registration**

```powershell
git add scripts/catalog.js tests/library.test.mjs
git commit -m "Register Van Goghs World in library"
```

### Task 6: Browser QA, Accessibility, and Release Audit

**Files:**
- Modify only if a verified shared-reader defect is found: `scripts/reader.js`, `styles/reader.css`, or `tests/library.test.mjs`
- Update: `books/van-goghs-world/audit-report.md`

**Interfaces:**
- Consumes: the completed book package and shared reader.
- Produces: release-ready local static experience with no book-specific shared-reader regressions.

- [ ] **Step 1: Start a local static server**

Run from the repository root:

```powershell
python -m http.server 4173
```

Expected: `http://localhost:4173/` serves the resource library.

- [ ] **Step 2: Verify the homepage card and direct reader URL**

Open:

```text
http://localhost:4173/
http://localhost:4173/reader.html?book=van-goghs-world
```

Confirm the card count is four, the RE3 textbook cover is visible, the title is correct, and the reader loads page 1 without an error state.

- [ ] **Step 3: Verify all eight reading pages**

For each page, confirm English text, highlighted vocabulary, Chinese translation, playable audio, one or two sentence buttons, two in-image bubbles, four options per question, answer rationale, and free navigation. Confirm the progress bar jumps directly to any page.

- [ ] **Step 4: Verify feedback and overlays**

Choose one wrong and one correct answer on every page. Confirm the wrong choice plays the game beep and remains retryable; the correct choice triggers confetti and explanation. Open every sentence lesson and both imitation answers; confirm the glass panel does not clip text.

- [ ] **Step 5: Verify the retelling board**

Confirm a 4×2 desktop grid, chronological image order, individual two-way card flips, English keywords, a one- or two-sentence retell scaffold, and Chinese cue text.

- [ ] **Step 6: Verify responsive bubble safety**

Test at 1440×900, 1024×768, 768×1024, and 390×844. For every scene, both bubbles must remain inside the image, below the scene heading, non-overlapping, and tappable. If a shared-reader fix is necessary, first add a regex or data-bound test that fails, then make the smallest shared CSS/JS change and rerun the entire suite.

- [ ] **Step 7: Verify assets and paths in a GitHub Pages-like subpath**

Check the Network panel for 404 responses while opening the library and reader. Confirm all requests remain under the repository subpath and that no local drive path or `file://` URI appears in published files.

- [ ] **Step 8: Complete the audit report and run final verification**

Run:

```powershell
node --test tests/library.test.mjs
git diff --check
git status --short
```

Expected: tests PASS, no whitespace errors, and only intentional task files are staged or modified.

- [ ] **Step 9: Commit any verified QA-only fixes and the final audit**

```powershell
git add books/van-goghs-world/audit-report.md tests/library.test.mjs scripts/reader.js styles/reader.css
git commit -m "Verify Van Gogh interactive reader"
```
