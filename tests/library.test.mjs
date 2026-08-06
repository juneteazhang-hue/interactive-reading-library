import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const exists = file => fs.existsSync(path.join(root, file));
const runScript = file => {
  const context = { globalThis: {} };
  vm.runInNewContext(read(file), context, { filename: file });
  return context.globalThis;
};

test('project scaffold contains homepage, reader and shared scripts', () => {
  ['index.html','reader.html','styles/library.css','styles/reader.css','scripts/catalog.js','scripts/library.js','scripts/reader.js'].forEach(file => assert.ok(exists(file), file));
});

test('catalog registers the dragon sample', () => {
  const { READING_CATALOG } = runScript('scripts/catalog.js');
  assert.equal(READING_CATALOG.length, 1);
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
