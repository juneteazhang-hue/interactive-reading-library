(() => {
  const pages = globalThis.READING_PAGES;
  const skills = [
    ['key-detail', 'character-motivation'],
    ['key-detail', 'cause-effect'],
    ['reference', 'inference'],
    ['key-detail', 'character-motivation'],
    ['sequence', 'inference'],
    ['key-detail', 'cause-effect'],
    ['key-detail', 'character-motivation'],
    ['key-detail', 'inference'],
  ];
  pages.forEach((page, pageIndex) => page.questions.forEach((question, questionIndex) => {
    question.skill = skills[pageIndex][questionIndex];
    question.rationale = questionIndex === 0
      ? `The answer is stated directly in page ${pageIndex + 1}; the other choices do not match the key detail.`
      : `The best answer follows from the evidence on page ${pageIndex + 1}; the distractors are possible ideas without enough textual support.`;
  }));

  globalThis.BOOK_DATA = {
    id: 'rise-of-the-earth-dragon',
    title: 'Rise of the Earth Dragon',
    titleZh: '大地之龙的崛起',
    description: 'Drake leaves his onion farm and discovers that dragons are real.',
    grade: '小学高年级',
    level: '初级',
    cover: 'assets/cover.png',
    pages,
    retelling: [
      { title:'The Onion Field', image:'assets/reading-page-1.png', keywords:['onion field','farmer’s son','ordinary life'], retell:'Drake worked in the onion field. He expected to stay a farmer.', cueZh:'德雷克原本在洋葱地劳动，以为自己会一直当农夫。' },
      { title:'A Soldier Arrives', image:'assets/reading-page-2.png', keywords:['loud voice','black horse','royal soldier'], retell:'A loud voice called Drake. A royal soldier waited on a black horse.', cueZh:'一名皇家士兵骑着黑马来到农场并叫住德雷克。' },
      { title:'The King’s Symbol', image:'assets/reading-page-3.png', keywords:['golden dragon','king’s symbol','pulled onto'], retell:'Drake saw the king’s golden dragon symbol. The soldier pulled him onto the horse.', cueZh:'德雷克认出国王的金龙标志，随后被带上黑马。' },
      { title:'Chosen', image:'assets/reading-page-4.png', keywords:['mother','chosen','royal order'], retell:'The soldier said the king had chosen Drake. His mother told him to obey.', cueZh:'士兵说国王选中了德雷克，母亲让他服从王命。' },
      { title:'To the Castle', image:'assets/reading-page-5.png', keywords:['village','stone bridge','castle'], retell:'They raced through the village and crossed a bridge. The castle appeared ahead.', cueZh:'他们穿过村庄和石桥，终于看见国王的城堡。' },
      { title:'Down Below', image:'assets/reading-page-6.png', keywords:['great hall','downstairs','stone door'], retell:'The soldier led Drake downstairs. Then he left Drake beside a huge stone door.', cueZh:'士兵把德雷克带到地下的一扇巨大石门前，然后离开。' },
      { title:'The Stone Door', image:'assets/reading-page-7.png', keywords:['dragon marks','warm light','curious'], retell:'Drake saw dragon marks and warm light. His curiosity made him open the door.', cueZh:'德雷克看到龙形印记和暖光，好奇地推开石门。' },
      { title:'A Real Dragon', image:'assets/reading-page-8.png', keywords:['red dragon','ball of fire','new life'], retell:'A giant red dragon breathed fire. Drake’s ordinary life changed forever.', cueZh:'红龙喷出火焰，德雷克的平凡生活从此改变。' },
    ],
  };
})();
