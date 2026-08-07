# Saving the Sun Dragon Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add *Saving the Sun Dragon* as a 14-chapter interactive close-reading book with 14 original chapter images, 28 Bloom-aligned questions, dynamic navigation, audio, and an 8-card retelling finale.

**Architecture:** Keep the existing static library and shared reader. Store book-specific teaching data and assets under `books/saving-the-sun-dragon/`; refactor the shared reader so the reading-page count comes from `book.pages.length`, while the retelling contract remains exactly eight cards. Register the second book in the catalog and deploy the same static bundle to GitHub Pages.

**Tech Stack:** Static HTML5, CSS3, browser JavaScript, Node.js built-in test runner, Web Speech API fallback, generated PNG/JPG assets, MP3 audio, GitHub Pages.

## Global Constraints

- Use 14 close-reading pages, one per source chapter.
- Use one independent original main image per chapter; do not copy the PDF illustrations or imitate a named film or living artist.
- Use exactly two four-choice questions per chapter: question 1 at remember/understand and question 2 at apply/analyze.
- Use 4-6 vocabulary entries per chapter with IPA, part of speech, Chinese meaning, and child-friendly English definition.
- Use one core sentence lesson per chapter; use two only when the excerpt contains two genuinely valuable structures.
- Use exactly eight flip cards on the final retelling page, reusing selected chapter images.
- Preserve free page navigation, paragraph audio, sentence analysis, answer glass cards, celebration effects, and error beeps.
- Keep the site static, dependency-free at runtime, and compatible with GitHub Pages project paths.
- Verify that the first book continues to work after the dynamic-page refactor.
- The local delivery directory is not a Git repository; use timestamped ZIP backups as local checkpoints and GitHub web commits when publishing.

---

## File Map

- `scripts/reader.js`: shared runtime; validate variable chapter counts and calculate the retelling index dynamically.
- `scripts/catalog.js`: register both books and expose the second direct-reading URL.
- `tests/library.test.mjs`: validate both book contracts, dynamic page behavior, assets, and regression requirements.
- `books/saving-the-sun-dragon/pages.js`: 14 excerpts, translations, vocabulary, and 28 questions.
- `books/saving-the-sun-dragon/content.js`: metadata, question skills/rationales, sentence lessons, and eight retelling cards.
- `books/saving-the-sun-dragon/assets/`: cover and `reading-page-1.png` through `reading-page-14.png`.
- `books/saving-the-sun-dragon/audio/`: `page-1.mp3` through `page-14.mp3`.
- `books/saving-the-sun-dragon/character-bible.md`: stable visual definitions and the 14 image briefs.
- `books/saving-the-sun-dragon/segmentation-report.md`: source-page-to-chapter selection record.
- `books/saving-the-sun-dragon/audit-report.md`: final linguistic, pedagogical, visual, and functional audit.

---

### Task 1: Lock the Variable-Chapter Contract with Failing Tests

**Files:**
- Modify: `tests/library.test.mjs`
- Test: `tests/library.test.mjs`

**Interfaces:**
- Consumes: existing `runScript(file)`, `read(file)`, and `exists(file)` helpers.
- Produces: reusable `loadBook(bookId)` and `assertTeachingContract(book, expectedPages)` test helpers.

- [ ] **Step 1: Add a reusable book loader and teaching-contract assertion**

```js
const loadBook = bookId => {
  const pagesContext = runScript(`books/${bookId}/pages.js`);
  const context = { globalThis: { READING_PAGES: pagesContext.READING_PAGES } };
  vm.runInNewContext(read(`books/${bookId}/content.js`), context);
  return context.globalThis.BOOK_DATA;
};

const assertTeachingContract = (book, expectedPages) => {
  assert.equal(book.pages.length, expectedPages);
  assert.equal(book.retelling.length, 8);
  book.pages.forEach((page, index) => {
    assert.ok(page.paragraph.length >= 250);
    assert.ok(page.translation.length >= 80);
    assert.ok(page.vocabulary.length >= 4 && page.vocabulary.length <= 6);
    assert.equal(page.questions.length, 2);
    assert.ok(['remember', 'understand'].includes(page.questions[0].level));
    assert.ok(['apply', 'analyze'].includes(page.questions[1].level));
    page.questions.forEach(question => {
      assert.equal(question.choices.length, 4);
      assert.ok(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < 4);
      assert.ok(question.skill && question.evidence && question.rationale && question.bubble);
    });
    assert.ok(page.sentences.length >= 1 && page.sentences.length <= 2);
    assert.ok(exists(`books/${book.id}/${page.image}`), `page ${index + 1} image`);
    assert.ok(exists(`books/${book.id}/${page.audio}`), `page ${index + 1} audio`);
  });
};
```

- [ ] **Step 2: Add tests for two catalog entries, 14 pages, 28 questions, and eight retelling cards**

```js
test('catalog registers two books', () => {
  const { READING_CATALOG } = runScript('scripts/catalog.js');
  assert.deepEqual(
    [...READING_CATALOG].map(item => item.id),
    ['rise-of-the-earth-dragon', 'saving-the-sun-dragon']
  );
  assert.equal(READING_CATALOG[1].pages, 14);
});

test('Saving the Sun Dragon satisfies the teaching contract', () => {
  const book = loadBook('saving-the-sun-dragon');
  assert.equal(book.id, 'saving-the-sun-dragon');
  assertTeachingContract(book, 14);
  assert.equal(book.pages.flatMap(page => page.questions).length, 28);
});
```

- [ ] **Step 3: Add a static regression test forbidding fixed retelling index assumptions**

```js
test('reader derives the retelling index from book data', () => {
  const reader = read('scripts/reader.js');
  assert.match(reader, /const readingCount\s*=\s*book\.pages\.length/);
  assert.match(reader, /state\.page\s*===\s*readingCount/);
  assert.doesNotMatch(reader, /book\.pages\.length\s*!==\s*8/);
});
```

- [ ] **Step 4: Run the tests and record the expected failure**

Run:

```powershell
& 'C:\Users\LENOVO\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests/library.test.mjs
```

Expected: FAIL because the second catalog entry and second book files do not exist, and `reader.js` still assumes eight reading pages.

- [ ] **Step 5: Create a local checkpoint archive**

Create `interactive-reading-library-before-book-02.zip` from the unchanged project directory and verify that the archive can be listed.

---

### Task 2: Refactor the Shared Reader for Dynamic Chapter Counts

**Files:**
- Modify: `scripts/reader.js`
- Test: `tests/library.test.mjs`

**Interfaces:**
- Consumes: `BOOK_DATA.pages: Page[]` and `BOOK_DATA.retelling: RetellingCard[]`.
- Produces: `readingCount: number`, `retellingIndex: number`, and valid progress values from `0` through `readingCount`.

- [ ] **Step 1: Replace fixed validation and progress bounds**

Implement these exact invariants inside `boot()` and `loadProgress()`:

```js
let readingCount = 0;

// after BOOK_DATA loads
if (!book || book.id !== bookId || !Array.isArray(book.pages) || book.pages.length < 1 || book.retelling.length !== 8) {
  throw new Error('Invalid book data');
}
readingCount = book.pages.length;

// progress is valid from first reading page through retelling page
const validPage = Number.isInteger(data?.page) && data.page >= 0 && data.page <= readingCount;
```

- [ ] **Step 2: Replace fixed retelling checks and labels**

Use:

```js
const isRetelling = state.page === readingCount;
const totalViews = readingCount + 1;
```

Generate progress dots for `totalViews`; label reading pages as `1..readingCount` and the final view as “复述”. Clamp previous/next navigation to `0..readingCount`.

- [ ] **Step 3: Preserve first-book behavior**

Load the first book in the browser and verify that its eight reading pages are followed by the ninth retelling page, and that saved progress values from `0` through `8` remain accepted.

- [ ] **Step 4: Run the reader contract test**

Run the Node test command from Task 1.

Expected: the dynamic-reader test passes; second-book tests still fail because its files are not yet present.

- [ ] **Step 5: Create a checkpoint ZIP**

Archive the project as `interactive-reading-library-dynamic-reader.zip` and list `scripts/reader.js` from the archive.

---

### Task 3: Transcribe and Build the 14-Chapter Teaching Data

**Files:**
- Create: `books/saving-the-sun-dragon/pages.js`
- Create: `books/saving-the-sun-dragon/segmentation-report.md`
- Modify: `tests/library.test.mjs`

**Interfaces:**
- Produces: `globalThis.READING_PAGES: Page[14]`.
- Each `Page` contains `title`, `image`, `audio`, `paragraph`, `translation`, `vocabulary`, `questions`, and later receives `sentences` from `content.js`.

- [ ] **Step 1: Render source pages at readable resolution**

Render PDF pages 4-93 to chapter-specific PNGs in `work/saving-sun-dragon-source/`. Record the source PDF page range for each chapter in `segmentation-report.md` using the confirmed chapter list from the design.

- [ ] **Step 2: Select one continuous 70-130-word excerpt per chapter**

For each chapter, select a single coherent excerpt that contains a clear event, character goal, or cause-effect link. Transcribe punctuation and capitalization exactly from the visible page, then compare the transcription against a second rendering at higher resolution.

- [ ] **Step 3: Write all 14 page objects**

Use this exact shape for every entry:

```js
{
  title: 'Dragons in the Sky',
  image: 'assets/reading-page-1.png',
  audio: 'audio/page-1.mp3',
  paragraph: 'Verified continuous English excerpt.',
  translation: '完整、忠实、自然的中文翻译。',
  vocabulary: [
    ['practice', '/ˈpræktɪs/', 'v.', '练习', 'to do something again so that you become better at it']
  ],
  questions: [
    {
      level: 'understand',
      question: 'What are the dragons doing above the valley?',
      choices: ['Practicing flight', 'Looking for food', 'Building a nest', 'Hiding from Drake'],
      answer: 0,
      evidence: 'The excerpt says the dragons are practicing flying.'
    },
    {
      level: 'analyze',
      question: 'Why does Drake pay special attention to Kepri?',
      choices: ['Kepri is flying differently', 'Kepri is the largest dragon', 'Kepri belongs to Drake', 'Kepri carries the king'],
      answer: 0,
      evidence: 'Kepri is not acting like the other dragons.'
    }
  ]
}
```

- [ ] **Step 4: Audit vocabulary and translations**

For all 56-84 vocabulary records, confirm IPA slashes, one valid part-of-speech label, contextual Chinese meaning, and a child-friendly English definition. Compare every translated sentence with its English source and record pass/fail by chapter in `segmentation-report.md`.

- [ ] **Step 5: Run a data-only test before assets exist**

Temporarily run a test that checks the 14 page objects, 28 questions, vocabulary bounds, and translation presence without requiring asset existence.

Expected: PASS for content structure; asset checks remain pending.

---

### Task 4: Add Sentence Lessons, Question Metadata, and Retelling Data

**Files:**
- Create: `books/saving-the-sun-dragon/content.js`
- Test: `tests/library.test.mjs`

**Interfaces:**
- Consumes: `globalThis.READING_PAGES` from `pages.js`.
- Produces: `globalThis.BOOK_DATA` with 14 enriched pages and exactly eight retelling cards.

- [ ] **Step 1: Define metadata and explicit question taxonomies**

Set:

```js
globalThis.BOOK_DATA = {
  id: 'saving-the-sun-dragon',
  title: 'Saving the Sun Dragon',
  titleZh: '拯救太阳龙',
  description: 'The Dragon Masters search for the cause of Kepri’s strange illness and uncover a far-away secret.',
  grade: '小学高年级',
  level: '初级',
  cover: 'assets/cover.png',
  pages,
  retelling
};
```

Assign each question a concrete `skill`, `rationale`, and `bubble`; do not use one repeated generic rationale for all 28 questions.

- [ ] **Step 2: Add one or two sentence lessons to every page**

Each lesson must use this contract:

```js
{
  sentence: 'Exact sentence found in page.paragraph.',
  translation: '对应中文翻译。',
  pattern: 'Readable sentence structure.',
  grammar: '准确、适合小学高年级的结构说明。',
  phrases: [['target phrase', '中文含义']],
  example: 'A new example using the same structure.',
  exampleTranslation: '例句中文翻译。',
  exercises: [
    { prompt: '中文仿写句一。', answer: 'English model answer one.', hint: '关键结构提示' },
    { prompt: '中文仿写句二。', answer: 'English model answer two.', hint: '关键结构提示' }
  ]
}
```

Assert that every `sentence` is an exact substring of its `page.paragraph`.

- [ ] **Step 3: Define the eight approved retelling nodes**

Use page images from chapters 2, 4, 5, 9, 10, 11, 13, and 14. Each card must contain 3-5 English keywords, one or two short English retell sentences, and one concise Chinese cue.

- [ ] **Step 4: Run content-contract tests**

Expected: all content and lesson tests pass; only missing image/audio asset checks may fail.

---

### Task 5: Generate the 14-Image Visual System

**Files:**
- Create: `books/saving-the-sun-dragon/character-bible.md`
- Create: `books/saving-the-sun-dragon/assets/cover.png`
- Create: `books/saving-the-sun-dragon/assets/reading-page-1.png` through `reading-page-14.png`
- Test: `tests/library.test.mjs`

**Interfaces:**
- Consumes: the 14 scene briefs and stable character definitions in `character-bible.md`.
- Produces: 15 web-ready images referenced by catalog and page data.

- [ ] **Step 1: Write the character bible and scene matrix**

Define stable hair, clothing, relative height, dragon scale colors, horn shapes, wing shapes, and recurring props for Drake, Ana, Bo, Rori, Worm, Kepri, Wati, Heru, Griffith, and King Roland. Add one composition brief per chapter, including reserved negative space for two question bubbles.

- [ ] **Step 2: Generate a style-setting key image**

Generate chapter 1 first in an original colorful cinematic children’s fantasy animation style. Check that the composition is landscape, readable behind overlays, and free of copied logos, text, or source-book illustration traces.

- [ ] **Step 3: Generate chapters 2-14 with the same character bible**

Use the approved key image plus the character bible as continuity references. Each image must show its chapter’s actual action, not a generic dragon portrait.

- [ ] **Step 4: Generate the cover from the established visual system**

Create a portrait cover featuring Kepri, Wati, Drake, and Ana. Keep the image free of embedded title text; the HTML card provides accessible title text.

- [ ] **Step 5: Perform a 14-image contact-sheet review**

Inspect a numbered contact sheet for character drift, duplicated composition, inconsistent dragon markings, accidental text, deformed hands/faces, and insufficient bubble space. Regenerate any failing image before continuing.

- [ ] **Step 6: Optimize and test assets**

Ensure all main images share one aspect ratio, remain sharp at the reader’s maximum display size, and use sensible web file sizes. Run the asset existence tests.

---

### Task 6: Produce 14 Paragraph Audio Files

**Files:**
- Create: `books/saving-the-sun-dragon/audio/page-1.mp3` through `page-14.mp3`
- Test: `tests/library.test.mjs`

**Interfaces:**
- Consumes: the exact 14 `paragraph` strings.
- Produces: one playable MP3 per reading page with filenames matching each `page.audio` field.

- [ ] **Step 1: Generate one sample with a clear child-friendly English voice**

Use a neutral English voice at approximately 0.88 normal speed. Do not read titles, question text, Chinese translations, or punctuation names.

- [ ] **Step 2: Verify the sample against the paragraph**

Listen for skipped words, incorrect names (`Drake`, `Kepri`, `Wati`, `Heru`, `Worm`), clipped beginnings/endings, and unnatural pauses. Adjust the pronunciation method before batch generation.

- [ ] **Step 3: Generate pages 2-14**

Create all files with consistent voice, speed, volume, and encoding.

- [ ] **Step 4: Validate each audio file**

Check that every file exists, is non-empty, has a valid MP3 header, and can be loaded by the browser audio element. Confirm that the reader’s speech-synthesis fallback still works when an MP3 is unavailable.

---

### Task 7: Register the Book and Complete Automated Regression Tests

**Files:**
- Modify: `scripts/catalog.js`
- Modify: `tests/library.test.mjs`
- Create: `books/saving-the-sun-dragon/audit-report.md`

**Interfaces:**
- Produces: homepage card and `reader.html?book=saving-the-sun-dragon` route.

- [ ] **Step 1: Add the second catalog entry**

```js
{
  id: 'saving-the-sun-dragon',
  title: 'Saving the Sun Dragon',
  titleZh: '拯救太阳龙',
  description: '太阳龙 Kepri 突然病倒，Dragon Masters 踏上寻找真相与救援伙伴的冒险。',
  grade: '小学高年级',
  level: '初级',
  pages: 14,
  cover: 'books/saving-the-sun-dragon/assets/cover.png',
  href: 'reader.html?book=saving-the-sun-dragon'
}
```

- [ ] **Step 2: Make retelling tests map by declared image, not page index**

For both books, assert that each retelling image matches at least one chapter image:

```js
const pageImages = new Set(book.pages.map(page => page.image));
book.retelling.forEach(item => assert.ok(pageImages.has(item.image)));
```

- [ ] **Step 3: Run syntax checks**

Run:

```powershell
& 'C:\Users\LENOVO\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --check scripts/reader.js
& 'C:\Users\LENOVO\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --check scripts/catalog.js
& 'C:\Users\LENOVO\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --check books/saving-the-sun-dragon/pages.js
& 'C:\Users\LENOVO\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --check books/saving-the-sun-dragon/content.js
```

Expected: four exit codes of 0.

- [ ] **Step 4: Run the complete Node test suite**

Run the Node test command from Task 1.

Expected: all tests pass with zero failures, covering both books and all 14 new page assets.

- [ ] **Step 5: Write the content audit report**

Record 14 rows with transcription, translation, vocabulary, question uniqueness, sentence lesson, image match, audio, and interaction status. The report must contain zero unresolved failures before publication.

---

### Task 8: Browser QA, Package, and Publish

**Files:**
- Modify only if QA identifies a reproducible defect.
- Create: `interactive-reading-library.zip`
- Publish: GitHub repository `juneteazhang-hue/interactive-reading-library`

**Interfaces:**
- Consumes: complete static project.
- Produces: verified local ZIP and working GitHub Pages links for the library and both books.

- [ ] **Step 1: Serve the project locally over HTTP**

Use a local static server from the project root; do not test only with `file://` because dynamic script loading behavior differs.

- [ ] **Step 2: Test the homepage**

Verify two cards, search by both Chinese and English titles, grade and level filters, responsive layout, cover loading, and correct links.

- [ ] **Step 3: Test all 14 pages of the second book**

On every page verify paragraph, translation toggle, vocabulary cards, audio, one or two sentence lessons, two question bubbles, correct/incorrect feedback, and free progress navigation.

- [ ] **Step 4: Test the retelling page and responsive behavior**

Verify eight cards, 4x2 desktop layout, two-column/single-column mobile layouts, flip/back behavior, keyboard focus, readable glass effects, and reduced-motion support.

- [ ] **Step 5: Run first-book regression QA**

Open all eight reading pages and its retelling page. Confirm that dynamic page-count changes did not alter its content, links, progress, questions, sentence lessons, images, or audio.

- [ ] **Step 6: Re-run all automated verification**

Run all four syntax checks and the complete Node test suite again. Record the exact pass count in `audit-report.md`.

- [ ] **Step 7: Replace the deliverable ZIP**

Create `outputs/interactive-reading-library.zip`, list its entries, and verify that it contains both book directories, 22 chapter images total, 22 paragraph audio files total, the shared reader, tests, and documentation.

- [ ] **Step 8: Upload changed/new files to GitHub**

Upload `scripts/reader.js`, `scripts/catalog.js`, `tests/library.test.mjs`, the complete `books/saving-the-sun-dragon/` directory, and updated documentation through the repository web interface. Preserve paths exactly.

- [ ] **Step 9: Verify GitHub Pages deployment**

Wait for `Deploy static content to Pages` to show a green check. Then verify:

```text
https://juneteazhang-hue.github.io/interactive-reading-library/
https://juneteazhang-hue.github.io/interactive-reading-library/reader.html?book=rise-of-the-earth-dragon
https://juneteazhang-hue.github.io/interactive-reading-library/reader.html?book=saving-the-sun-dragon
```

Expected: HTTP 200 for all three, two cards on the homepage, and the correct book title on each reader route.
