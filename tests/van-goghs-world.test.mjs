import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const bytes = file => fs.readFileSync(path.join(root, file));
const run = file => {
  const context = { globalThis: {} };
  vm.runInNewContext(read(file), context, { filename: file });
  return context.globalThis;
};
const pages = run('books/van-goghs-world/pages.js').READING_PAGES;
const contentContext = { globalThis: { READING_PAGES: pages } };
vm.runInNewContext(read('books/van-goghs-world/content.js'), contentContext, { filename: 'content.js' });
const book = contentContext.globalThis.BOOK_DATA;

const pngSize = file => {
  const data = bytes(file);
  assert.equal(data.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  return [data.readUInt32BE(16), data.readUInt32BE(20)];
};

const parseMp3 = file => {
  const data = bytes(file);
  const first = data.findIndex((value, index) => index + 3 < data.length && value === 0xff && (data[index + 1] & 0xe0) === 0xe0);
  assert.ok(first >= 0, `${file} has an MPEG frame`);
  let offset = first;
  let frames = 0;
  while (offset + 4 <= data.length) {
    const header = data.readUInt32BE(offset);
    assert.equal(header >>> 21, 0x7ff, `${file} frame sync at ${offset}`);
    const bitrateIndex = (header >>> 12) & 0xf;
    const sampleRateIndex = (header >>> 10) & 0x3;
    const padding = (header >>> 9) & 1;
    assert.ok(bitrateIndex > 0 && bitrateIndex < 15);
    assert.ok(sampleRateIndex < 3);
    const bitrate = [0,32,40,48,56,64,80,96,112,128,160,192,224,256,320,0][bitrateIndex];
    const sampleRate = [44100,48000,32000][sampleRateIndex];
    offset += Math.floor(144000 * bitrate / sampleRate) + padding;
    assert.ok(offset <= data.length, `${file} has complete frames`);
    frames += 1;
  }
  assert.equal(offset, data.length, `${file} parses to EOF`);
  assert.ok(frames > 20, `${file} is not an empty clip`);
  return { frames, first };
};

test('Van Gogh preserves the eight source scenes and complete teaching contract', () => {
  assert.equal(pages.length, 8);
  assert.deepEqual(Array.from(pages, page => page.id), [
    'world-recognizes-van-gogh', 'artist-is-born', 'discovering-color', 'descent-into-madness',
    'illness-and-creativity', 'seventy-productive-days', 'end-of-his-life', 'van-goghs-legacy',
  ]);
  assert.equal(book.id, 'van-goghs-world');
  assert.equal(book.pages.length, 8);
  assert.equal(book.retelling.length, 8);
  book.pages.forEach((page, index) => {
    assert.equal(page.paragraph, pages[index].paragraph);
    assert.ok(page.paragraph.length >= 250, `scene ${index + 1} source text`);
    assert.ok(page.translation.length >= 80, `scene ${index + 1} translation`);
    assert.ok(page.vocabulary.length >= 4 && page.vocabulary.length <= 6);
    page.vocabulary.forEach(([word, ipa, pos, zh, en]) => {
      assert.ok(word);
      assert.match(ipa, /^\/.+\/$/);
      assert.match(pos, /^(n\.|v\.|adj\.|adv\.|phr\.|prep\.|conj\.)$/);
      assert.ok(zh && en);
    });
    assert.ok(page.sentences.length >= 1 && page.sentences.length <= 2);
    page.sentences.forEach(sentence => {
      assert.ok(page.paragraph.includes(sentence.sentence));
      assert.ok(sentence.pattern && sentence.grammar && sentence.example);
      assert.equal(sentence.exercises.length, 2);
      sentence.exercises.forEach(item => assert.ok(item.prompt && item.answer));
    });
    assert.equal(page.questions.length, 2);
    assert.ok(['remember', 'understand'].includes(page.questions[0].level));
    assert.ok(['apply', 'analyze'].includes(page.questions[1].level));
    page.questions.forEach(question => {
      assert.equal(question.choices.length, 4);
      assert.ok(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < 4);
      assert.ok(question.skill && question.evidence && question.rationale && question.bubble);
    });
  });
});

test('Van Gogh uses the reviewed bubble-safe positions', () => {
  const expected = [
    [[55,18],[78,70]], [[20,28],[78,72]], [[15,20],[84,28]], [[18,22],[82,48]],
    [[18,48],[78,20]], [[20,20],[78,20]], [[18,22],[78,22]], [[18,20],[78,20]],
  ];
  assert.deepEqual(Array.from(book.pages, page => Array.from(page.bubblePositions, p => [p.left, p.top])), expected);
  book.pages.flatMap(page => page.bubblePositions).forEach(position => {
    assert.ok(position.left >= 14 && position.left <= 86);
    assert.ok(position.top >= 18 && position.top <= 86);
  });
});

test('Van Gogh visual assets are substantial and mapped one-to-one', () => {
  assert.deepEqual(pngSize('books/van-goghs-world/assets/cover.png'), [960, 1440]);
  assert.ok(bytes('books/van-goghs-world/assets/cover.png').length > 100_000);
  book.pages.forEach((page, index) => {
    const file = `books/van-goghs-world/${page.image}`;
    assert.equal(file, `books/van-goghs-world/assets/reading-page-${index + 1}.png`);
    assert.deepEqual(pngSize(file), [1440, 960]);
    assert.ok(bytes(file).length > 100_000);
    assert.equal(book.retelling[index].image, page.image);
  });
  const textbook = bytes('books/van-goghs-world/assets/textbook-cover.webp');
  assert.equal(crypto.createHash('sha256').update(textbook).digest('hex').toUpperCase(), 'ACF05D81A6D525E99D2B6EFACD89449C643395116E7299ECC64B9CF544E842F8');
});

test('Van Gogh has eight structurally valid page narration clips', () => {
  const signatures = new Set();
  book.pages.forEach((page, index) => {
    assert.equal(page.audio, `audio/page-${index + 1}.mp3`);
    const file = `books/van-goghs-world/${page.audio}`;
    const parsed = parseMp3(file);
    const data = bytes(file);
    signatures.add(data.subarray(parsed.first, parsed.first + 4).toString('hex').slice(0, 6));
  });
  assert.equal(signatures.size, 1);
  assert.match(read('scripts/split-van-gogh-audio.py'), /parse_mpeg_frames/);
  assert.match(read('scripts/split-van-gogh-audio.py'), /preroll/i);
});

test('Van Gogh segmentation and audit reports cover every scene', () => {
  const segmentation = read('books/van-goghs-world/segmentation-report.md');
  ['A', 'B', 'C', 'D', 'E–F', 'G', 'H', 'I'].forEach(label => assert.match(segmentation, new RegExp(`\\b${label.replace('–', '.')}\\b`)));
  const audit = read('books/van-goghs-world/audit-report.md');
  assert.match(audit, /38\/38 passed/);
  assert.match(audit, /Final teacher listening is still recommended/);
});

test('Van Gogh sensitive scenes remain respectful and non-procedural in teaching layers', () => {
  const teachingOnly = [book.pages[3], book.pages[4], book.pages[6]].map(page => JSON.stringify({
    translation: page.translation,
    questions: page.questions,
    sentences: page.sentences,
    retelling: book.retelling.find(card => card.image === page.image),
  })).join('\n');
  assert.match(teachingOnly, /respect|关怀|尊重|健康|困境|照顾/i);
  assert.doesNotMatch(teachingOnly, /how to (?:hurt|injure|shoot)|步骤|方法是/i);
});

test('shared reader persists retelling flips in the book progress record', () => {
  const reader = read('scripts/reader.js');
  assert.match(reader, /flipped:Array\.isArray\(data\?\.flipped\)/);
  assert.match(reader, /state\.flipped\.includes\(index\)/);
  assert.match(reader, /state\.flipped\.push\(index\)/);
  assert.match(reader, /state\.flipped=state\.flipped\.filter/);
  assert.match(reader, /state\.flipped=\[\];save\(\)/);
});

test('shared reader exposes a clear audio failure status', () => {
  assert.match(read('reader.html'), /id="audioStatus"[^>]*role="status"/);
  const reader = read('scripts/reader.js');
  assert.match(reader, /paragraphAudio.*addEventListener\('error'/s);
  assert.match(reader, /音频加载失败/);
  assert.match(reader, /audioStatus/);
});
