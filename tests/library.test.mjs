import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const exists = file => fs.existsSync(path.join(root, file));
const pngDimensions = file => {
  const bytes = fs.readFileSync(path.join(root, file));
  assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', `${file} PNG signature`);
  assert.equal(bytes.subarray(12, 16).toString('ascii'), 'IHDR', `${file} IHDR chunk`);
  return [bytes.readUInt32BE(16), bytes.readUInt32BE(20)];
};
const mp3Info = file => {
  const bytes = fs.readFileSync(path.join(root, file));
  const frameOffset = bytes.findIndex((value, index) => index + 3 < bytes.length && value === 0xff && (bytes[index + 1] & 0xe0) === 0xe0);
  assert.ok(frameOffset >= 0, `${file} MPEG audio frame`);
  const header = bytes.readUInt32BE(frameOffset);
  const versionBits = (header >>> 19) & 0x3;
  const layerBits = (header >>> 17) & 0x3;
  const bitrateIndex = (header >>> 12) & 0xf;
  const sampleRateIndex = (header >>> 10) & 0x3;
  assert.notEqual(versionBits, 1, `${file} valid MPEG version`);
  assert.equal(layerBits, 1, `${file} MPEG Layer III`);
  assert.notEqual(bitrateIndex, 0, `${file} non-free bitrate`);
  assert.notEqual(bitrateIndex, 15, `${file} valid bitrate index`);
  assert.notEqual(sampleRateIndex, 3, `${file} valid sample rate index`);
  const version = versionBits === 3 ? 'MPEG1' : versionBits === 2 ? 'MPEG2' : 'MPEG2.5';
  const bitrates = version === 'MPEG1'
    ? [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 0]
    : [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, 0];
  const sampleRates = version === 'MPEG1' ? [44100, 48000, 32000]
    : version === 'MPEG2' ? [22050, 24000, 16000] : [11025, 12000, 8000];
  const bitrateKbps = bitrates[bitrateIndex];
  const sampleRate = sampleRates[sampleRateIndex];
  const duration = (bytes.length - frameOffset) * 8 / (bitrateKbps * 1000);
  return { version, bitrateKbps, sampleRate, duration, size: bytes.length };
};
const runScript = file => {
  const context = { globalThis: {} };
  vm.runInNewContext(read(file), context, { filename: file });
  return context.globalThis;
};

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

test('project scaffold contains homepage, reader and shared scripts', () => {
  ['index.html','reader.html','styles/library.css','styles/reader.css','scripts/catalog.js','scripts/library.js','scripts/reader.js'].forEach(file => assert.ok(exists(file), file));
});

test('brand and textbook source assets are published locally', () => {
  ['assets/brand/br-logo.jpg', 'assets/brand/favicon.png',
   'books/a-musical-boost/assets/textbook-cover.gif']
    .forEach(file => assert.ok(exists(file), file));
});

test('Reading Explorer metadata is attached only to A Musical Boost', () => {
  const { READING_CATALOG } = runScript('scripts/catalog.js');
  const music = READING_CATALOG.find(item => item.id === 'a-musical-boost');
  assert.equal(music.textbook, 'READING EXPLORER 1 · THIRD EDITION');
  assert.equal(music.textbookCover, 'books/a-musical-boost/assets/textbook-cover.gif');
  assert.equal(music.theme, 'reading-explorer-1');
  READING_CATALOG.filter(item => item.id !== music.id)
    .forEach(item => assert.equal(item.theme, undefined));

  const musicBook = loadBook('a-musical-boost');
  assert.equal(musicBook.textbookCover, 'books/a-musical-boost/assets/textbook-cover.gif');
  assert.equal(musicBook.theme, 'reading-explorer-1');
  ['rise-of-the-earth-dragon', 'saving-the-sun-dragon'].forEach(bookId => {
    const book = loadBook(bookId);
    assert.equal(book.theme, undefined, `${bookId} theme`);
    assert.equal(book.textbook, undefined, `${bookId} textbook`);
    assert.equal(book.textbookCover, undefined, `${bookId} textbook cover`);
  });
});

test('homepage renders shared branding and optional textbook identity', () => {
  assert.match(read('index.html'), /class="site-brand-logo"/);
  const js = read('scripts/library.js');
  assert.match(js, /data-theme="\$\{item\.theme \|\| ''\}"/);
  assert.match(js, /item\.textbookCover/);
  assert.match(js, /item\.textbook/);
  assert.match(js, /class="card-brand-logo" src="assets\/brand\/br-logo\.jpg" alt="" aria-hidden="true"/);
  const css = read('styles/library.css');
  assert.match(css, /book-card\[data-theme="reading-explorer-1"\]/);
  assert.match(css, /\.card-brand-logo\{/);
  assert.match(css, /@media\(max-width:700px\)[\s\S]*\.card-brand-logo\{/);
});

test('reader applies shared branding and book-scoped textbook theme', () => {
  const html = read('reader.html');
  const js = read('scripts/reader.js');
  const css = read('styles/reader.css');
  assert.match(html, /class="reader-brand-logo"/);
  assert.match(html, /id="textbookLabel"/);
  assert.match(html, /class="scene-brand-watermark"/);
  assert.match(js, /document\.body\.dataset\.bookTheme\s*=\s*book\.theme\s*\|\|\s*''/);
  assert.match(css, /body\[data-book-theme="reading-explorer-1"\]/);
  assert.match(css, /\.scene-brand-watermark[^}]*pointer-events:none/);
});

test('reader mobile chrome stays in fixed rows without implicit grid overflow', () => {
  const css = read('styles/reader.css');
  assert.match(css, /@media \(max-width: 959px\)[\s\S]*?\.topbar\s*\{[^}]*grid-template-columns:\s*auto minmax\(0,1fr\) auto/);
  assert.match(css, /@media \(max-width: 959px\)[\s\S]*?\.progress-footer\s*\{[^}]*grid-template-columns:\s*auto minmax\(0,1fr\) auto/);
  assert.match(css, /@media \(max-width: 959px\)[\s\S]*?\.progress-dots\s*\{[^}]*grid-column:\s*auto[^}]*min-width:\s*0/);
  assert.match(css, /@media \(max-width: 959px\)[\s\S]*?\.progress-copy\s*\{[^}]*display:\s*none/);
  assert.match(css, /@media\(max-width:540px\)[\s\S]*?#bookBrand\s*\{[^}]*display:\s*none/);
  assert.doesNotMatch(css, /@media\(max-width:540px\)[\s\S]*?\.reader-brand-copy\s*\{\s*display:\s*none/);
  const tabletLabelRule = css.lastIndexOf('.textbook-label { max-width: 150px; }');
  const finalPhoneMedia = css.lastIndexOf('@media (max-width: 540px)');
  const finalPhoneLabel = css.lastIndexOf('.topbar .textbook-label');
  assert.ok(finalPhoneMedia > tabletLabelRule, 'phone media rule follows the tablet label rule');
  assert.ok(finalPhoneLabel > finalPhoneMedia, 'phone label selector is in the final mobile override');
  const finalPhoneRule = css.slice(finalPhoneLabel, css.indexOf('}', finalPhoneLabel) + 1);
  assert.match(finalPhoneRule, /max-width:\s*96px/);
  assert.match(finalPhoneRule, /font-size:\s*7px/);
  assert.match(finalPhoneRule, /white-space:\s*normal/);
});

test('retelling cards brand only their front faces', () => {
  const reader = read('scripts/reader.js');
  assert.match(reader, /retell-front[\s\S]*retell-brand-watermark/);
  assert.doesNotMatch(reader, /retell-back[\s\S]{0,220}retell-brand-watermark/);
  assert.match(read('styles/reader.css'), /\.retell-brand-watermark/);
});

test('catalog registers the dragon sample', () => {
  const { READING_CATALOG } = runScript('scripts/catalog.js');
  assert.equal(READING_CATALOG[0].id, 'rise-of-the-earth-dragon');
  assert.match(READING_CATALOG[0].href, /reader\.html\?book=rise-of-the-earth-dragon/);
});

test('sample book satisfies the complete teaching contract', () => {
  const pagesContext = runScript('books/rise-of-the-earth-dragon/pages.js');
  const context = { globalThis: { READING_PAGES: pagesContext.READING_PAGES } };
  vm.runInNewContext(read('books/rise-of-the-earth-dragon/content.js'), context);
  const book = context.globalThis.BOOK_DATA;
  assert.equal(book.id, 'rise-of-the-earth-dragon');
  assert.equal(book.pages.length, 8);
  assert.equal(book.retelling.length, 8);
  book.pages.forEach((page, index) => {
    assert.equal(page.vocabulary.length, 4);
    assert.equal(page.questions.length, 2);
    assert.ok(['remember','understand'].includes(page.questions[0].level));
    assert.ok(['apply','analyze'].includes(page.questions[1].level));
    page.questions.forEach(question => {
      assert.equal(question.choices.length, 4);
      assert.ok(question.skill && question.evidence && question.rationale);
    });
    assert.ok(page.sentences.length >= 1 && page.sentences.length <= 2);
    assert.ok(exists(`books/${book.id}/${page.image}`), `page ${index + 1} image`);
    assert.ok(exists(`books/${book.id}/${page.audio}`), `page ${index + 1} audio`);
  });
  book.retelling.forEach((item, index) => {
    assert.equal(item.image, book.pages[index].image);
    assert.ok(item.keywords.length >= 2 && item.keywords.length <= 4);
    assert.ok(item.retell && item.cueZh);
  });
});

test('catalog registers all four books with Van Gogh metadata', () => {
  const { READING_CATALOG } = runScript('scripts/catalog.js');
  assert.deepEqual(
    [...READING_CATALOG].map(item => item.id),
    ['rise-of-the-earth-dragon', 'saving-the-sun-dragon', 'a-musical-boost', 'van-goghs-world']
  );
  assert.equal(READING_CATALOG[1].pages, 14);
  assert.equal(READING_CATALOG[2].pages, 8);
  assert.deepEqual({ ...READING_CATALOG[3] }, {
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
    description: '走进梵高的色彩、挣扎、创造力与永恒艺术遗产。',
  });
});

test('homepage renderer uses catalog fields and generic Van Gogh reader link', () => {
  const elements = Object.fromEntries(
    ['#librarySearch', '#gradeFilter', '#levelFilter', '#bookGrid', '#emptyLibrary', '#bookCount']
      .map(selector => [selector, {
        value: '',
        innerHTML: '',
        hidden: false,
        insertAdjacentHTML(_position, html) { this.innerHTML += html; },
        addEventListener() {},
      }])
  );
  const context = {
    globalThis: {
      READING_CATALOG: [{
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
        description: '走进梵高的色彩、挣扎、创造力与永恒艺术遗产。',
      }],
    },
    document: { querySelector: selector => elements[selector] },
  };
  vm.runInNewContext(read('scripts/library.js'), context, { filename: 'scripts/library.js' });

  const markup = elements['#bookGrid'].innerHTML;
  [
    'books/van-goghs-world/assets/cover.png',
    'books/van-goghs-world/assets/textbook-cover.webp',
    "Van Gogh's World",
    '梵高的世界',
    'READING EXPLORER 3 · THIRD EDITION',
    '初中',
    'RE Level 3',
    '8 段＋复述',
    '走进梵高的色彩、挣扎、创造力与永恒艺术遗产。',
    'reader.html?book=van-goghs-world',
  ].forEach(value => assert.ok(markup.includes(value), value));
  assert.equal(elements['#bookCount'].textContent, '共 1 篇');
});

test('Saving the Sun Dragon satisfies the teaching contract', () => {
  const book = loadBook('saving-the-sun-dragon');
  assert.equal(book.id, 'saving-the-sun-dragon');
  assertTeachingContract(book, 14);
  assert.equal(book.pages.flatMap(page => page.questions).length, 28);
});

test('Saving the Sun Dragon visual assets are valid and consistently sized', () => {
  const assetRoot = 'books/saving-the-sun-dragon/assets';
  for (let chapter = 1; chapter <= 14; chapter += 1) {
    const file = `${assetRoot}/reading-page-${chapter}.png`;
    assert.ok(exists(file), file);
    assert.deepEqual(pngDimensions(file), [1440, 960], `${file} dimensions`);
    assert.ok(fs.statSync(path.join(root, file)).size > 100_000, `${file} is not an empty placeholder`);
  }
  const cover = `${assetRoot}/cover.png`;
  assert.ok(exists(cover), cover);
  assert.deepEqual(pngDimensions(cover), [960, 1440], `${cover} dimensions`);
  assert.ok(fs.statSync(path.join(root, cover)).size > 100_000, `${cover} is not an empty placeholder`);
});

test('Saving the Sun Dragon defines two validated bubble-safe positions per chapter', () => {
  const book = loadBook('saving-the-sun-dragon');
  book.pages.forEach((page, pageIndex) => {
    assert.equal(page.bubblePositions.length, 2, `page ${pageIndex + 1} bubble position count`);
    page.bubblePositions.forEach((position, positionIndex) => {
      const label = `page ${pageIndex + 1} bubble ${positionIndex + 1}`;
      assert.ok(Number.isFinite(position.left), `${label} left`);
      assert.ok(Number.isFinite(position.top), `${label} top`);
      assert.ok(position.left >= 14 && position.left <= 86, `${label} horizontal safe bound`);
      assert.ok(position.top >= 14 && position.top <= 86, `${label} vertical safe bound`);
    });
    const [first, second] = page.bubblePositions;
    assert.ok(Math.hypot(first.left - second.left, first.top - second.top) >= 20, `page ${pageIndex + 1} bubbles do not overlap`);
  });
});

test('Saving the Sun Dragon keeps the opening question bubble below the scene heading', () => {
  const book = loadBook('saving-the-sun-dragon');
  assert.ok(book.pages[0].bubblePositions[0].top >= 34);
});

test('A Musical Boost segmentation report locks eight source-backed pages', () => {
  const report = read('books/a-musical-boost/segmentation-report.md');
  const ids = ['music-language','hearing-study','group-comparison','learning-to-listen','filtering-noise','music-speech','singing-brain','overall-boost'];
  ids.forEach(id => assert.match(report, new RegExp(`\\b${id}\\b`)));
  assert.match(report, /Source paragraph: A/);
  assert.match(report, /Source paragraph: E/);
});

test('A Musical Boost satisfies the complete eight-page teaching contract', () => {
  const book = loadBook('a-musical-boost');
  assert.equal(book.id, 'a-musical-boost');
  assert.equal(book.textbook, 'READING EXPLORER 1 · THIRD EDITION');
  assert.equal(book.pages.length, 8);
  assert.equal(book.pages.flatMap(page => page.questions).length, 16);
  assert.equal(book.retelling.length, 8);
  book.pages.forEach((page, index) => {
    assert.ok(page.paragraph.length >= 120, `page ${index + 1} source range`);
    assert.ok(page.translation.length >= 40, `page ${index + 1} translation`);
    assert.ok(page.vocabulary.length >= 3 && page.vocabulary.length <= 6, `page ${index + 1} vocabulary`);
    assert.equal(page.questions.length, 2);
    assert.ok(['remember','understand'].includes(page.questions[0].level));
    assert.ok(['apply','analyze'].includes(page.questions[1].level));
    page.questions.forEach(question => {
      assert.equal(question.choices.length, 4);
      assert.ok(question.skill && question.evidence && question.rationale && question.bubble);
    });
    assert.ok(page.sentences.length >= 1 && page.sentences.length <= 2);
    assert.equal(page.bubblePositions.length, 2);
  });
});

test('A Musical Boost provides eight playable original narration clips', () => {
  const book = loadBook('a-musical-boost');
  assert.equal(book.pages.length, 8);
  book.pages.forEach((page, index) => {
    const file = `books/a-musical-boost/${page.audio}`;
    assert.ok(exists(file), `page ${index + 1} narration`);
    const info = mp3Info(file);
    assert.equal(info.version, 'MPEG1');
    assert.equal(info.sampleRate, 44100);
    assert.equal(info.bitrateKbps, 128);
    assert.ok(info.duration >= 8 && info.duration <= 35, `page ${index + 1} duration`);
    assert.ok(info.size >= 100_000, `page ${index + 1} audio data`);
  });
});

test('A Musical Boost provides a consistent eight-scene visual set and cover', () => {
  const book = loadBook('a-musical-boost');
  book.pages.forEach((page, index) => {
    const file = `books/a-musical-boost/${page.image}`;
    assert.ok(exists(file), `page ${index + 1} scene`);
    const [width, height] = pngDimensions(file);
    assert.ok(width > height, `page ${index + 1} landscape`);
    assert.ok(width >= 1400 && height >= 900, `page ${index + 1} resolution`);
  });
  const cover = `books/a-musical-boost/${book.cover}`;
  assert.ok(exists(cover), 'cover image');
  const [coverWidth, coverHeight] = pngDimensions(cover);
  assert.ok(coverHeight > coverWidth, 'portrait cover');
});

test('reader consumes page bubble positions with bounded responsive fallbacks', () => {
  const reader = read('scripts/reader.js');
  const readerCss = read('styles/reader.css');
  assert.match(reader, /DEFAULT_BUBBLE_POSITIONS/);
  assert.match(reader, /page\.bubblePositions/);
  assert.match(reader, /--bubble-left:\$\{position\.left\}%/);
  assert.match(reader, /--bubble-top:\$\{position\.top\}%/);
  assert.match(readerCss, /left:clamp\([^;]+var\(--bubble-left\)[^;]+\)/);
  assert.match(readerCss, /top:clamp\([^;]+var\(--bubble-top\)[^;]+\)/);
});

test('Saving the Sun Dragon content enriches questions, sentence lessons, and retelling cards', () => {
  const book = loadBook('saving-the-sun-dragon');
  assert.deepEqual(
    [book.id, book.title, book.titleZh, book.grade, book.level, book.cover],
    ['saving-the-sun-dragon', 'Saving the Sun Dragon', '拯救太阳龙', '小学高年级', '初级', 'assets/cover.png']
  );
  assert.equal(
    book.description,
    'The Dragon Masters search for the cause of Kepri’s strange illness and uncover a far-away secret.'
  );

  const rationales = [];
  book.pages.forEach((page, pageIndex) => {
    page.questions.forEach((question, questionIndex) => {
      assert.ok(question.skill.trim().length >= 5, `page ${pageIndex + 1} question ${questionIndex + 1} skill`);
      assert.ok(question.rationale.trim().length >= 40, `page ${pageIndex + 1} question ${questionIndex + 1} rationale`);
      assert.ok(question.bubble.trim().length >= 3, `page ${pageIndex + 1} question ${questionIndex + 1} bubble`);
      rationales.push(question.rationale);
    });

    assert.ok(page.sentences.length >= 1 && page.sentences.length <= 2, `page ${pageIndex + 1} sentence count`);
    page.sentences.forEach((lesson, lessonIndex) => {
      const label = `page ${pageIndex + 1} lesson ${lessonIndex + 1}`;
      assert.ok(page.paragraph.includes(lesson.sentence), `${label} exact paragraph substring`);
      assert.match(lesson.translation, /[\u3400-\u9fff]/, `${label} translation`);
      assert.ok(lesson.pattern.trim().length >= 5, `${label} pattern`);
      assert.match(lesson.grammar, /[\u3400-\u9fff]/, `${label} grammar`);
      assert.ok(lesson.phrases.length >= 1, `${label} phrases`);
      lesson.phrases.forEach(([english, chinese]) => {
        assert.match(english, /[A-Za-z]/, `${label} English phrase`);
        assert.match(chinese, /[\u3400-\u9fff]/, `${label} Chinese phrase`);
      });
      assert.match(lesson.example, /[A-Za-z]/, `${label} example`);
      assert.match(lesson.exampleTranslation, /[\u3400-\u9fff]/, `${label} example translation`);
      assert.equal(lesson.exercises.length, 2, `${label} exercise count`);
      lesson.exercises.forEach((exercise, exerciseIndex) => {
        assert.match(exercise.prompt, /[\u3400-\u9fff]/, `${label} exercise ${exerciseIndex + 1} prompt`);
        assert.match(exercise.answer, /[A-Za-z]/, `${label} exercise ${exerciseIndex + 1} answer`);
        assert.match(exercise.hint, /[\u3400-\u9fff]/, `${label} exercise ${exerciseIndex + 1} hint`);
      });
    });
  });
  assert.equal(new Set(rationales).size, 28, 'all question rationales are page-specific');

  assert.deepEqual(
    [...book.retelling].map(item => item.image),
    [2, 4, 5, 9, 10, 11, 13, 14].map(chapter => `assets/reading-page-${chapter}.png`)
  );
  book.retelling.forEach((item, index) => {
    assert.ok(item.title.trim(), `retelling card ${index + 1} title`);
    assert.ok(item.keywords.length >= 3 && item.keywords.length <= 5, `retelling card ${index + 1} keywords`);
    item.keywords.forEach(keyword => assert.match(keyword, /[A-Za-z]/));
    const retellSentenceCount = item.retell.split(/[.!?]+/).filter(Boolean).length;
    assert.ok(retellSentenceCount >= 1 && retellSentenceCount <= 2, `retelling card ${index + 1} English retell`);
    assert.match(item.cueZh, /[\u3400-\u9fff]/, `retelling card ${index + 1} Chinese cue`);
  });
});

test('Saving the Sun Dragon page data is complete before assets exist', () => {
  const { READING_PAGES: pages } = runScript('books/saving-the-sun-dragon/pages.js');
  const expectedTitles = [
    'Dragons in the Sky',
    'A Sick Dragon',
    "King Roland's Threat",
    "The Wizard's Potion",
    "Ana's Story",
    'Worm Calls',
    'Far-Away Lands',
    'A Strange Boy',
    'Kepri and Wati',
    'Robbers!',
    'Flying',
    "Ana's Decision",
    'One Last Good-bye',
    'Home',
  ];
  assert.equal(pages.length, 14);
  assert.equal(pages.flatMap(page => page.questions).length, 28);
  assert.deepEqual(
    [0, 1, 2, 3].map(answer => pages.flatMap(page => page.questions).filter(question => question.answer === answer).length),
    [7, 7, 7, 7],
    'correct answers are evenly distributed across the four choice indexes'
  );

  pages.forEach((page, index) => {
    const words = page.paragraph.trim().split(/\s+/);
    assert.equal(page.title, expectedTitles[index]);
    assert.equal(page.image, `assets/reading-page-${index + 1}.png`);
    assert.equal(page.audio, `audio/page-${index + 1}.mp3`);
    assert.ok(words.length >= 70 && words.length <= 130, `page ${index + 1} word count`);
    assert.ok(page.translation.trim().length > 0, `page ${index + 1} translation`);
    assert.ok(page.vocabulary.length >= 4 && page.vocabulary.length <= 6, `page ${index + 1} vocabulary count`);
    page.vocabulary.forEach((record, vocabularyIndex) => {
      assert.equal(record.length, 5, `page ${index + 1} vocabulary ${vocabularyIndex + 1}`);
      record.forEach(value => assert.ok(value.trim().length > 0));
      assert.match(record[1], /^\/[^/]+\/$/);
      assert.match(record[2], /^(?:n\.|v\.|adj\.|adv\.)$/);
      assert.match(record[3], /[\u3400-\u9fff]/);
    });
    assert.deepEqual(
      [...page.questions].map(question => question.level),
      ['understand', 'analyze'],
      `page ${index + 1} question levels`
    );
    page.questions.forEach((question, questionIndex) => {
      assert.equal(question.choices.length, 4, `page ${index + 1} question ${questionIndex + 1} choices`);
      assert.ok(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < 4);
      assert.ok(question.question.trim().length > 0);
      assert.ok(question.evidence.trim().length > 0);
    });
  });
});

test('Saving the Sun Dragon narrations are consistent playable MP3 files', () => {
  const { READING_PAGES: pages } = runScript('books/saving-the-sun-dragon/pages.js');
  const formatSignatures = new Set();
  pages.forEach((page, index) => {
    const file = `books/saving-the-sun-dragon/${page.audio}`;
    assert.ok(exists(file), `page ${index + 1} narration`);
    const info = mp3Info(file);
    assert.ok(['MPEG1', 'MPEG2', 'MPEG2.5'].includes(info.version), `${file} MPEG version`);
    assert.ok(info.sampleRate >= 16000 && info.sampleRate <= 48000, `${file} sample rate`);
    assert.ok(info.bitrateKbps >= 16 && info.bitrateKbps <= 128, `${file} suitable speech bitrate`);
    assert.ok(info.duration >= 12 && info.duration <= 120, `${file} reasonable narration duration`);
    assert.ok(info.size >= 100_000, `${file} has substantial audio data`);
    formatSignatures.add(`${info.version}/${info.sampleRate}/${info.bitrateKbps}`);
  });
  assert.equal(formatSignatures.size, 1, 'all page narrations share one audio format');
});

test('reader derives the retelling index from book data', () => {
  const reader = read('scripts/reader.js');
  assert.match(reader, /readingCount\s*=\s*book\.pages\.length/);
  assert.match(reader, /state\.page\s*===\s*readingCount/);
  assert.doesNotMatch(reader, /book\.pages\.length\s*!==\s*8/);
});

test('reader supports an optional assessment page before retelling', () => {
  const html = read('reader.html');
  const reader = read('scripts/reader.js');
  const css = read('styles/reader.css');
  assert.match(html, /id="assessmentPage"/);
  assert.match(html, /id="assessmentSections"/);
  assert.match(reader, /hasAssessment\s*=\s*Boolean\(book\.assessment\)/);
  assert.match(reader, /retellingIndex\s*=\s*readingCount\s*\+\s*\(hasAssessment\s*\?\s*1\s*:\s*0\)/);
  assert.match(reader, /function renderAssessment\(/);
  assert.match(reader, /book\.assessment\.multipleChoice/);
  assert.match(reader, /book\.assessment\.trueFalseNotGiven/);
  assert.match(reader, /book\.assessment\.supportingReasons/);
  assert.match(css, /\.assessment-page/);
});

test('reader renders question bubble metadata as visible accessible controls', () => {
  const reader = read('scripts/reader.js');
  const readerCss = read('styles/reader.css');
  assert.match(reader, /page\.questions\.map\(\(question,index\)=>/);
  assert.match(reader, /const label=question\.bubble\|\|`Question \$\{index\+1\}`/);
  assert.match(reader, /aria-label="打开题目：\$\{escapeHtml\(label\)\}"/);
  assert.match(reader, /class="quiz-bubble-label">\$\{escapeHtml\(label\)\}/);
  assert.match(reader, /data-question="\$\{index\}"/);
  assert.match(readerCss, /\.quiz-bubble-label/);
  assert.match(readerCss, /@media \(max-width:720px\)[\s\S]*\.quiz-bubble/);
});

test('homepage and reader expose required interaction contracts', () => {
  const home = read('index.html');
  const library = read('scripts/library.js');
  const reader = read('scripts/reader.js');
  const readerCss = read('styles/reader.css');
  for (const id of ['librarySearch','gradeFilter','levelFilter','bookGrid','emptyLibrary']) assert.match(home, new RegExp(`id="${id}"`));
  assert.match(library, /reader\.html\?book=/);
  for (const name of ['launchCelebration','playFeedbackSound','openSentenceLesson','showModelAnswer','renderRetelling']) assert.match(reader, new RegExp(name));
  assert.match(reader, /URLSearchParams/);
  assert.match(readerCss, /\.retell-grid/);
  assert.match(readerCss, /grid-template-columns:\s*repeat\(4/);
  assert.match(readerCss, /prefers-reduced-motion/);
});

test('reader hidden states stay hidden until boot selects one', () => {
  const readerCss = read('styles/reader.css');
  assert.match(readerCss, /\[hidden\]\s*\{\s*display\s*:\s*none\s*!important\s*;?\s*\}/);
});

test('reports and nine-prompt toolkit are complete', () => {
  assert.ok(exists('books/rise-of-the-earth-dragon/segmentation-report.md'));
  assert.ok(exists('books/rise-of-the-earth-dragon/audit-report.md'));
  const prompts = read('docs/提示词套装.md');
  const headings = ['总控生成','语义分段与完整翻译','重点词汇','布鲁姆阅读题','核心句式','八幅图片','八图复述页','教学内容审核','技术质量检查与发布'];
  headings.forEach(heading => assert.ok(prompts.includes(heading), heading));
  assert.match(prompts, /segmentation-report\.md/);
  assert.match(prompts, /audit-report\.md/);
  assert.match(prompts, /阻断发布/);
});

test('published files contain no absolute local paths', () => {
  const files = ['index.html','reader.html','scripts/catalog.js','scripts/library.js','scripts/reader.js'];
  files.forEach(file => assert.doesNotMatch(read(file), /[A-Z]:\\|file:\/\//i, file));
});
