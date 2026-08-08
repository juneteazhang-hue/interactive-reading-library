(() => {
  const pages = globalThis.READING_PAGES;
  const sentenceLessons = [
    {
      sentence: 'Probably no other artist, at any time in any culture, has achieved such popularity.',
      translation: '也许在任何时代、任何文化中，都没有其他艺术家获得过如此高的知名度。',
      pattern: 'Probably no other + 名词 + has/have + 过去分词 + such + 名词',
      grammar: 'no other artist 表示“没有其他艺术家”；现在完成时 has achieved 强调从过去到现在积累的影响；such 修饰 popularity，表示“如此高的”。',
      phrases: [['at any time', '在任何时代'], ['achieve such popularity', '获得如此高的知名度']],
      example: 'Probably no other student in our class has achieved such progress this year.',
      exampleTranslation: '今年我们班也许没有其他学生取得过如此大的进步。',
      exercises: [
        { prompt: '也许没有其他球队赢得过如此多的比赛。', answer: 'Probably no other team has won so many games.', hint: '用 Probably no other team has won...' },
        { prompt: '在任何时期，没有其他科学家有过如此大的影响。', answer: 'At any time, no other scientist has had such influence.', hint: '使用 no other scientist has had...' },
      ],
    },
    {
      sentence: 'He realized that he was meant to be a painter, and he began to study art in Brussels, receiving financial help from his brother Theo.',
      translation: '他意识到自己注定要成为画家，于是开始在布鲁塞尔学习艺术，并得到弟弟西奥的经济帮助。',
      pattern: '主语 + realized that + 从句, and + began to + 动词, receiving + 名词',
      grammar: 'realized that 后接宾语从句；be meant to 表示“注定要、适合做”；receiving... 是现在分词短语，补充说明同时得到的支持。',
      phrases: [['be meant to be', '注定要成为'], ['financial help', '经济帮助']],
      example: 'Mia realized that she was meant to be a teacher, receiving support from her family.',
      exampleTranslation: '米娅意识到自己适合当老师，并得到了家人的支持。',
      exercises: [
        { prompt: '他意识到自己想当医生，于是开始学习科学。', answer: 'He realized that he wanted to be a doctor, and he began to study science.', hint: '先用 realized that，再用 began to' },
        { prompt: '莉娜开始学习音乐，并得到父母的支持。', answer: 'Lina began to study music, receiving support from her parents.', hint: '用 receiving support from...' },
      ],
    },
    {
      sentence: 'With his innovative color combinations, van Gogh wanted to show others how to better appreciate a flower, the night sky, or a person’s face.',
      translation: '梵高想用创新的色彩组合，向别人展示如何更好地欣赏一朵花、夜空或一张人的脸。',
      pattern: 'With + 名词短语, 主语 + wanted to show + 人 + how to + 动词',
      grammar: 'With 引出所使用的方法或条件；show others how to do 表示“向别人展示如何做某事”；how to 后接动词原形。',
      phrases: [['innovative color combinations', '创新的色彩组合'], ['appreciate the night sky', '欣赏夜空']],
      example: 'With clear pictures, the guide showed us how to better appreciate the museum.',
      exampleTranslation: '导游用清晰的图片向我们展示如何更好地欣赏博物馆。',
      exercises: [
        { prompt: '用这个地图，老师向我们展示如何找到图书馆。', answer: 'With this map, the teacher showed us how to find the library.', hint: '用 With this map 开头' },
        { prompt: '她想向孩子们展示如何照顾植物。', answer: 'She wanted to show the children how to care for plants.', hint: '用 wanted to show...how to...' },
      ],
    },
    {
      sentence: 'Following an argument with fellow artist Paul Gauguin, van Gogh took a razor and cut off his own earlobe.',
      translation: '在与艺术家同伴保罗·高更争吵之后，梵高做出了伤害自己的行为。',
      pattern: 'Following + 名词短语, 主语 + 动词过去式 + and + 动词过去式',
      grammar: 'Following 表示“在……之后”，后接名词短语；主句用两个过去式动词按顺序叙述过去发生的事。这里的原文内容令人不安，应以尊重和关怀的方式阅读。',
      phrases: [['following an argument', '在一次争吵之后'], ['fellow artist', '艺术家同伴']],
      example: 'Following a long discussion, the class chose a new project and made a plan.',
      exampleTranslation: '经过长时间讨论后，全班选择了一个新项目并制订了计划。',
      exercises: [
        { prompt: '比赛之后，队员们握了手并互相祝贺。', answer: 'Following the game, the players shook hands and congratulated one another.', hint: '用 Following the game 开头' },
        { prompt: '会议之后，李老师写了一封邮件并分享了笔记。', answer: 'Following the meeting, Ms. Li wrote an email and shared the notes.', hint: '两个过去式动词用 and 连接' },
      ],
    },
    {
      sentence: 'He began to have attacks during which he would hear strange sounds and think people were trying to hurt him.',
      translation: '他开始出现发作，在发作期间会听到奇怪的声音，并认为有人想伤害他。',
      pattern: '主语 + began to + 动词 + during which + 主语 + would + 动词',
      grammar: 'during which 引导限制性定语从句，修饰前面的 attacks，说明发作发生时的那段期间；would 在这里描述过去一段时间中反复出现的情况。健康状况复杂，不能仅凭文字自行判断。',
      phrases: [['begin to have attacks', '开始出现发作'], ['during which', '在那段期间']],
      example: 'She began to have quiet breaks during which she would read and draw.',
      exampleTranslation: '她开始有一些安静的休息时间，在那段时间里会阅读和画画。',
      exercises: [
        { prompt: '他开始有休息时间，在那段时间里会散步。', answer: 'He began to have breaks during which he would take a walk.', hint: '用 during which he would...' },
        { prompt: '我们有学习时间，在那段时间里会安静地读书。', answer: 'We had study time during which we would read quietly.', hint: 'which 指代前面的 study time' },
      ],
    },
    {
      sentence: 'For the 70 days that he lived there, he produced, on average, a painting a day.',
      translation: '在他住在那里的70天里，他平均每天创作一幅画。',
      pattern: 'For + 时间段 + that + 主语 + 动词, 主语 + 动词, on average, + 数量 + a day',
      grammar: 'that he lived there 修饰 70 days；on average 表示“平均而言”；a painting a day 是“每天一幅画”的频率表达。',
      phrases: [['on average', '平均而言'], ['a painting a day', '每天一幅画']],
      example: 'For the ten days that we practiced, we read, on average, two pages a day.',
      exampleTranslation: '在我们练习的十天里，平均每天读两页。',
      exercises: [
        { prompt: '在她住在北京的三个月里，她平均每周读一本书。', answer: 'For the three months that she lived in Beijing, she read, on average, one book a week.', hint: '用 For the...that she lived...' },
        { prompt: '平均而言，我们每天走两公里。', answer: 'On average, we walk two kilometers a day.', hint: '用 On average 开头' },
      ],
    },
    {
      sentence: 'It was at this time that van Gogh either borrowed or stole a gun.',
      translation: '就在这个时期，梵高借来或拿走了一支枪。',
      pattern: 'It was at + 时间 + that + 主语 + either + 动词 A + or + 动词 B',
      grammar: 'It was...that... 是强调句，强调时间；either...or... 表示两个可能性中的一个。原文涉及令人难过的历史事件，练习只迁移句型，不重现危险情节。',
      phrases: [['at this time', '在这个时期'], ['either...or...', '要么……要么……']],
      example: 'It was at lunch that Maya either chose soup or salad.',
      exampleTranslation: '就在午餐时，玛雅选择了汤或沙拉中的一种。',
      exercises: [
        { prompt: '就在那天，汤姆要么坐公交车，要么骑自行车。', answer: 'It was that day that Tom either took the bus or rode his bike.', hint: '用 It was that day that...' },
        { prompt: '在周末，我们要么去公园，要么待在家里。', answer: 'At the weekend, we either go to the park or stay at home.', hint: '用 either...or... 连接两个选择' },
      ],
    },
    {
      sentence: 'Of course, people are buying great art when they purchase one of van Gogh’s paintings, but they are also buying a piece of his story, which, like his work, will live on forever.',
      translation: '当然，人们购买梵高的一幅画时是在购买伟大的艺术，但也在购买他故事的一部分；他的故事会像作品一样永远流传。',
      pattern: '主语 + be + 动词-ing, but + also + be + 动词-ing, which + will + 动词',
      grammar: 'are buying 用现在进行时强调当下的行为；but...also... 表示补充的对比；which 引导非限定性定语从句，补充说明 his story。',
      phrases: [['a piece of his story', '他故事的一部分'], ['live on forever', '永远流传']],
      example: 'Visitors are learning history, but they are also sharing a story that will live on.',
      exampleTranslation: '参观者正在学习历史，也在分享一个会流传下去的故事。',
      exercises: [
        { prompt: '人们在看电影，但也在了解一个家庭的故事。', answer: 'People are watching a film, but they are also learning a family’s story.', hint: '用 are watching...but are also learning...' },
        { prompt: '这首歌会在许多人的记忆中流传下去。', answer: 'This song will live on in many people’s memories.', hint: '用 will live on' },
      ],
    },
  ];

  const questionMetadata = [
    [['key detail', '抓住“such popularity”这个关键结果。'], ['author’s purpose', '从结尾提问可看出作者想引导读者思考艺术与人生的影响。']],
    [['key detail', '定位时间和地点，直接找到 Brussels。'], ['inference', 'Theo 提供经济帮助，说明他支持 Vincent 学习艺术。']],
    [['sequence', '按颜色出现的顺序定位 blue and red。'], ['author’s purpose', '短句命令引导读者放慢脚步、开放地观察美。']],
    [['key detail', '题目问地点，证据直接指出他搬到了 Arles。'], ['supporting detail', '“he spoke to no one”最能支持他处于孤立状态这一判断。']],
    [['key detail', '找出 periods of calm 后面的直接信息。'], ['cause and effect', '段落同时说明疾病会限制创作，也可能激发创意。']],
    [['key detail', 'on average 和 a day 给出直接的创作频率。'], ['compare and contrast', '文本对比他生前未卖出作品与后来作品的高价值。']],
    [['key detail', '直接读取原文中 Vincent 死亡年龄的信息即可。'], ['author’s purpose', '末尾列出多种可能因素，但没有给出确定答案。']],
    [['key detail', '定位作品名称和价格信息即可找到题目的答案。'], ['inference', '“a piece of his story”说明人生经历增加了作品的意义。']],
  ];
  const bubblePositions = [
    [{ left: 55, top: 18 }, { left: 78, top: 70 }],
    [{ left: 20, top: 28 }, { left: 78, top: 72 }],
    [{ left: 15, top: 20 }, { left: 84, top: 28 }],
    [{ left: 18, top: 22 }, { left: 82, top: 48 }],
    [{ left: 18, top: 48 }, { left: 78, top: 20 }],
    [{ left: 20, top: 20 }, { left: 78, top: 20 }],
    [{ left: 18, top: 22 }, { left: 78, top: 22 }],
    [{ left: 18, top: 20 }, { left: 78, top: 20 }],
  ];

  pages.forEach((page, pageIndex) => {
    page.questions.forEach((question, questionIndex) => {
      const [skill, rationale] = questionMetadata[pageIndex][questionIndex];
      question.skill = skill;
      question.bubble = questionIndex === 0 ? '找证据' : '想一想';
      question.rationale = rationale;
    });
    page.sentences = [sentenceLessons[pageIndex]];
    page.bubblePositions = bubblePositions[pageIndex];
  });

  const book = {
    id: 'van-goghs-world',
    title: "Van Gogh's World",
    titleZh: '梵高的世界',
    textbook: 'READING EXPLORER 3 · THIRD EDITION',
    grade: '初中',
    level: 'RE Level 3',
    difficulty: '进阶',
    cover: 'assets/cover.png',
    textbookCover: 'assets/textbook-cover.webp',
    description: 'Van Gogh’s bold colors, personal struggles, creativity, and enduring legacy invite readers to see art and life with fresh attention.',
    pages,
    retelling: [
      { title: 'A Famous Painter', image: 'assets/reading-page-1.png', keywords: ['bold colors', 'sunflowers', 'popularity'], retell: 'People around the world recognize van Gogh’s bold paintings. His art and life still move readers today.', cueZh: '梵高的大胆色彩使他闻名世界，他的人生与艺术至今仍能打动人。' },
      { title: 'Choosing Art', image: 'assets/reading-page-2.png', keywords: ['Zundert', 'talent', 'Brussels', 'Theo'], retell: 'Van Gogh grew up serious and sensitive. At age twenty-six, he chose to study art with Theo’s support.', cueZh: '梵高从小喜欢画画，后来在弟弟西奥支持下选择学习艺术。' },
      { title: 'Discovering Color', image: 'assets/reading-page-3.png', keywords: ['Paris', 'Impressionists', 'blue and red', 'beauty'], retell: 'In Paris, van Gogh learned from new color techniques. He used bright combinations to help people notice beauty.', cueZh: '在巴黎，梵高学习新的色彩技法，并用明亮色彩表现美。' },
      { title: 'A Difficult Time', image: 'assets/reading-page-4.png', keywords: ['Arles', 'isolation', 'painting', 'argument'], retell: 'Van Gogh moved to Arles and often worked alone for long hours. The period shows his isolation and serious struggles.', cueZh: '在阿尔勒，梵高长期独自作画，也经历了严峻的困境。' },
      { title: 'Illness and Art', image: 'assets/reading-page-5.png', keywords: ['Saint-Rémy', 'calm', 'masterpieces', 'The Starry Night'], retell: 'During difficult periods, van Gogh needed care and could not always paint. In calmer times, he completed many important works.', cueZh: '梵高的健康状况让他需要照顾；在平静时期，他完成了许多重要作品。' },
      { title: 'Seventy Productive Days', image: 'assets/reading-page-6.png', keywords: ['Auvers-sur-Oise', 'seventy days', 'painting a day', 'value'], retell: 'In Auvers-sur-Oise, van Gogh painted about one work a day for seventy days. His paintings later became highly valuable.', cueZh: '在欧韦尔的七十天里，梵高平均每天画一幅画；这些画后来价值很高。' },
      { title: 'His Final Period', image: 'assets/reading-page-7.png', keywords: ['final period', 'loneliness', 'unanswered questions', 'respect'], retell: 'Van Gogh’s final period was marked by loneliness and unanswered questions. He died at age thirty-seven, and his life should be remembered with care and respect.', cueZh: '梵高生命最后阶段充满孤独与未解的问题；我们应以关怀和尊重记住他。' },
      { title: 'A Lasting Legacy', image: 'assets/reading-page-8.png', keywords: ['legacy', 'Portrait of Dr. Gachet', 'story', 'live on'], retell: 'Van Gogh’s paintings became famous around the world. People value both the art and the human story that lives on with it.', cueZh: '梵高的作品闻名世界，人们珍视其中的艺术，也珍视随之流传的人生故事。' },
    ],
  };

  globalThis.READING_BOOK = book;
  globalThis.BOOK_DATA = book;
})();
