(() => {
  const pages = globalThis.READING_PAGES;

  const questionMetadata = [
    [
      {
        skill: 'key-detail-location',
        bubble: 'Valley practice',
        rationale: 'Drake is in the Valley of Clouds behind the castle. The cave, farm, and castle roof are not named as his practice location.',
      },
      {
        skill: 'contrast-and-change',
        bubble: 'Drake’s new life',
        rationale: 'The paragraph contrasts Drake’s old life with living at the castle and working with dragons; the other choices contradict his new role.',
      },
    ],
    [
      {
        skill: 'cause-and-time',
        bubble: 'When illness began',
        rationale: 'Ana connects Kepri’s first symptoms with the tunnel cave-in last week. The other events are not given as the starting time.',
      },
      {
        skill: 'character-motivation',
        bubble: 'Ana feels guilty',
        rationale: 'Ana had already noticed tiredness and cloudy eyes, so she wishes she had reported those warning signs sooner; she did not cause the cave-in or know a cure.',
      },
    ],
    [
      {
        skill: 'reported-detail',
        bubble: 'Griffith’s story',
        rationale: 'Griffith told the king that the dragons had tried to escape. None of the other statements is the explanation he gave after the cave-in.',
      },
      {
        skill: 'cause-and-effect',
        bubble: 'A protective lie',
        rationale: 'Griffith’s lie protected the children but made him responsible in the king’s eyes. The text does not say he caused the illness, closed the tunnel, or stopped teaching.',
      },
    ],
    [
      {
        skill: 'sequence-detail',
        bubble: 'Potion changes',
        rationale: 'While Rori stirs, the liquid turns blue and begins to shine. Freezing, smoking, and spilling never occur in this potion-making sequence.',
      },
      {
        skill: 'meaning-in-context',
        bubble: 'Test the potion',
        rationale: 'Griffith means they must let Kepri drink the potion to learn whether it works. The group has not tested it already, and he does not reject the recipe.',
      },
    ],
    [
      {
        skill: 'collect-key-details',
        bubble: 'What robbers steal',
        rationale: 'Ana names sale goods such as fabrics, plus gold and pyramid treasures. Dragons, books, horses, and castle keys are not part of her list.',
      },
      {
        skill: 'character-inference',
        bubble: 'Everyone misses home',
        rationale: 'Ana’s sadness and Drake’s thought show that the young Dragon Masters share homesickness even though their family stories are different. The passage does not show that they prefer danger or dislike one another.',
      },
    ],
    [
      {
        skill: 'action-and-reference',
        bubble: 'Worm points to Kepri',
        rationale: 'Worm answers Drake by nodding toward Kepri, directing attention to the sick dragon. He does not leave, wake Griffith, or bring a book.',
      },
      {
        skill: 'evidence-based-inference',
        bubble: 'Did it work?',
        rationale: 'Kepri looks much worse after receiving the potion, so the children reasonably wonder whether it failed or harmed her. Her worsening condition rules out the cheerful alternatives.',
      },
    ],
    [
      {
        skill: 'setting-evidence',
        bubble: 'A different kingdom',
        rationale: 'Bo points to their unfamiliar surroundings and says they are no longer in Bracken. That direct change of setting supports mind travel better than any unmentioned sign.',
      },
      {
        skill: 'connection-and-cause',
        bubble: 'Who was touching?',
        rationale: 'Worm transported those linked by touch: the children touched Worm, and Drake touched Kepri. Vulcan and Shu stayed in their caves and were outside that chain.',
      },
    ],
    [
      {
        skill: 'sequence-and-method',
        bubble: 'The secret door',
        rationale: 'The boy touches the pyramid and a stone pushes inward to reveal the opening. He uses neither a key nor dragon fire, and the door is not already open.',
      },
      {
        skill: 'clue-based-inference',
        bubble: 'A sparkling clue',
        rationale: 'The green sparkling object on the boy’s cord is a Dragon Stone, the strongest clue that he may be a Dragon Master. His voice and clothes do not prove that role.',
      },
    ],
    [
      {
        skill: 'explain-a-causal-chain',
        bubble: 'Kepri’s message',
        rationale: 'Drake reasons that Kepri told Worm about her twin and his healing power, which explains why Worm chose this destination. No map, wizard, or robber guided him.',
      },
      {
        skill: 'judge-an-action',
        bubble: 'Worm chose well',
        rationale: 'Worm brought the sick Kepri to Wati, who could heal her, so Heru judges the choice as helpful and correct. The other options do not solve Kepri’s illness.',
      },
    ],
    [
      {
        skill: 'action-and-result',
        bubble: 'Wati fights back',
        rationale: 'Wati fires a black beam that knocks down the first robber after the weapons are raised. Hiding, flying away, or opening a door does not match his response.',
      },
      {
        skill: 'character-trait-inference',
        bubble: 'Ana protects Kepri',
        rationale: 'Ana jumps into the arrow’s path, showing courage and a strong wish to protect Kepri. Her risky action is the opposite of fear, anger at Kepri, or trust in the robbers.',
      },
    ],
    [
      {
        skill: 'combine-key-details',
        bubble: 'Two beams, one exit',
        rationale: 'Wati’s dark beam and Kepri’s rainbow ribbon meet at the chamber top, and then it opens. Worm and the robbers do not create this exit.',
      },
      {
        skill: 'collaborative-problem-solving',
        bubble: 'Powers work together',
        rationale: 'The two dragons combine different light powers to open an escape route that neither opens alone. The other choices separate their actions or invent events.',
      },
    ],
    [
      {
        skill: 'reason-for-a-decision',
        bubble: 'Why stay with Wati?',
        rationale: 'Ana thinks Kepri should stay because Wati knew how to heal her when everyone else could not. Ownership, an order from Drake, and an inability to fly are not her reasons.',
      },
      {
        skill: 'apply-a-story-rule',
        bubble: 'What a glow means',
        rationale: 'The paragraph establishes that a glowing Dragon Stone signals connection, so a future glow would mean Ana and Kepri have grown closer. It would not show lost magic or a broken bond elsewhere.',
      },
    ],
    [
      {
        skill: 'present-and-future-detail',
        bubble: 'Kepri’s choice',
        rationale: 'Kepri wants to remain with Ana in Bracken for now and visit her brother later. The pyramid, robbers, and a return without Ana do not fit her message.',
      },
      {
        skill: 'compare-character-goals',
        bubble: 'The same family wish',
        rationale: 'Ana compares them because Kepri hopes to see her brother again while Ana hopes to see her family again. Their shared idea is future reunion, not fear or loss of magic.',
      },
    ],
    [
      {
        skill: 'identify-group-responsibility',
        bubble: 'Who will defend?',
        rationale: 'Griffith says protection is up to their group, and Ana promises that everyone will help. Maldred’s army, the robbers, and Ana’s family are not chosen as defenders.',
      },
      {
        skill: 'theme-and-main-idea',
        bubble: 'Together against danger',
        rationale: 'Drake’s final words express teamwork: friends and dragons will face whatever comes together. The other choices deny cooperation or claim the danger is already gone.',
      },
    ],
  ];

  const sentenceLessons = [
    {
      sentence: 'He was a Dragon Master—someone who had been chosen by the Dragon Stone to work with dragons.',
      translation: '他是一名驯龙大师——一个被龙石选中、与龙一起工作的人。',
      pattern: 'someone who + 过去分词 / 动词短语',
      grammar: 'who 引导定语从句，补充说明 someone 是怎样的人；had been chosen 是过去完成时的被动语态，表示在当时之前已经被选中。',
      phrases: [['be chosen by', '被……选中'], ['work with', '与……一起工作']],
      example: 'Mia was a guide who had been trained to help lost travelers.',
      exampleTranslation: '米娅是一名接受过训练、帮助迷路旅人的向导。',
      exercises: [
        { prompt: '他是一名被国王选中的守卫。', answer: 'He was a guard who had been chosen by the king.', hint: '用 a guard who had been chosen by...' },
        { prompt: '莉莉是一个与动物一起工作的女孩。', answer: 'Lily is a girl who works with animals.', hint: '用 a girl who works with...' },
      ],
    },
    {
      sentence: 'She has seemed a little off since last week—when the tunnel caved in.',
      translation: '从上周隧道坍塌时起，她就显得有点不对劲。',
      pattern: '主语 + has/have + 过去分词 + since + 过去时间',
      grammar: '现在完成时和 since 连用，说明一种状态从过去开始并持续到现在；seem off 表示“看起来不太对劲”。',
      phrases: [['seem a little off', '显得有点不对劲'], ['since last week', '从上周起']],
      example: 'My dog has seemed tired since yesterday.',
      exampleTranslation: '我的狗从昨天起就显得很累。',
      exercises: [
        { prompt: '从星期一开始，他就显得很安静。', answer: 'He has seemed very quiet since Monday.', hint: '用 has seemed...since...' },
        { prompt: '从上个月起，这条河就看起来很浑浊。', answer: 'The river has looked cloudy since last month.', hint: '用 has looked...since...' },
      ],
    },
    {
      sentence: 'Griffith had only wanted to protect us when he told that lie, Drake thought.',
      translation: '德雷克想，格里菲斯说那个谎时只是想保护我们。',
      pattern: '主语 + had wanted to + 动词 + when + 一般过去时',
      grammar: 'had wanted 表示“想保护”发生在德雷克此刻回想之前；when 引出当时发生的具体事件。',
      phrases: [['want to protect', '想要保护'], ['tell a lie', '说谎']],
      example: 'Dad had only wanted to help when he gave me that advice.',
      exampleTranslation: '爸爸给我那个建议时只是想帮助我。',
      exercises: [
        { prompt: '她关上门时只是想保护小猫。', answer: 'She had only wanted to protect the kitten when she closed the door.', hint: '用 had only wanted to protect...when...' },
        { prompt: '汤姆说那些话时只是想帮助朋友。', answer: 'Tom had only wanted to help his friend when he said those words.', hint: '先写 had only wanted to help' },
      ],
    },
    {
      sentence: 'Griffith scooped up some liquid with a ladle and put it in a clean jar.',
      translation: '格里菲斯用长柄勺舀起一些液体，把它装进一个干净的罐子里。',
      pattern: '主语 + 动作 1 + with + 工具 + and + 动作 2',
      grammar: '两个一般过去时动词 scooped 和 put 由 and 连接，按顺序描述动作；with 表示使用的工具。',
      phrases: [['scoop up', '舀起'], ['put ... in ...', '把……放进……']],
      example: 'Ella picked up the seed with a spoon and put it in a small cup.',
      exampleTranslation: '埃拉用勺子拿起种子，把它放进一个小杯子里。',
      exercises: [
        { prompt: '本用网捞起小鱼，把它放进水桶里。', answer: 'Ben scooped up the little fish with a net and put it in a bucket.', hint: '用 with a net 和 put it in...' },
        { prompt: '我用筷子夹起面条，把它们放进碗里。', answer: 'I picked up the noodles with chopsticks and put them in a bowl.', hint: '两个过去式动作由 and 连接' },
      ],
    },
    {
      sentence: 'That is why my father did not argue when King Roland’s men came for me.',
      translation: '那就是为什么罗兰德国王的人来接我时，我父亲没有争辩。',
      pattern: 'That is why + 结果 + when + 事件',
      grammar: 'That is why 用来承接前面的原因并说明结果；when 引出结果发生时的事件。',
      phrases: [['that is why', '那就是为什么'], ['come for someone', '来接某人']],
      example: 'The road was dangerous. That is why we waited when the storm began.',
      exampleTranslation: '道路很危险。那就是为什么暴风雨开始时我们选择等待。',
      exercises: [
        { prompt: '我很想家。那就是为什么妈妈来接我时我很开心。', answer: 'I missed home. That is why I was happy when Mom came for me.', hint: '用 That is why + 结果' },
        { prompt: '山路结冰了。那就是为什么他们没有出发。', answer: 'The mountain road was icy. That is why they did not leave.', hint: '用 did not leave 表示没有出发' },
      ],
    },
    {
      sentence: 'Kepri was asleep, too—but she looked sicker than before.',
      translation: '凯普莉也睡着了——但她看起来比以前病得更重。',
      pattern: '主语 + looked + 比较级 + than before',
      grammar: 'looked 后接形容词比较级，than before 表示和以前相比；sick 的比较级是 sicker。',
      phrases: [['be asleep', '睡着'], ['sicker than before', '比以前病得更重']],
      example: 'The little bird looked stronger than before.',
      exampleTranslation: '那只小鸟看起来比以前更强壮了。',
      exercises: [
        { prompt: '这棵树看起来比以前更高了。', answer: 'The tree looked taller than before.', hint: '用 looked + taller + than before' },
        { prompt: '治疗后，小狗看起来比以前更开心了。', answer: 'After the treatment, the dog looked happier than before.', hint: 'happy 的比较级是 happier' },
      ],
    },
    {
      sentence: 'We are no longer in the Kingdom of Bracken.',
      translation: '我们已经不在布拉肯王国了。',
      pattern: '主语 + be + no longer + 地点 / 状态',
      grammar: 'no longer 表示“不再”，放在 be 动词之后，说明原来的地点或状态已经改变。',
      phrases: [['no longer', '不再'], ['the Kingdom of Bracken', '布拉肯王国']],
      example: 'The travelers are no longer near their village.',
      exampleTranslation: '旅行者们已经不在村庄附近了。',
      exercises: [
        { prompt: '我们已经不在森林里了。', answer: 'We are no longer in the forest.', hint: '把 no longer 放在 are 后面' },
        { prompt: '那条龙已经不再虚弱了。', answer: 'The dragon is no longer weak.', hint: '用 is no longer + 形容词' },
      ],
    },
    {
      sentence: 'Something green and sparkling was dangling from the cord.',
      translation: '一个绿色、闪闪发光的东西正悬在绳子上。',
      pattern: 'Something + 形容词 + was/were + 动词-ing + 地点',
      grammar: '形容词 green and sparkling 放在 something 后面作后置修饰；was dangling 是过去进行时，描写当时正在呈现的状态。',
      phrases: [['green and sparkling', '绿色且闪闪发光的'], ['dangle from', '悬挂在……上']],
      example: 'Something bright and golden was shining under the water.',
      exampleTranslation: '一个明亮的金色物体正在水下发光。',
      exercises: [
        { prompt: '一个又小又银亮的东西正挂在树枝上。', answer: 'Something small and silver was dangling from the branch.', hint: '形容词放在 something 后' },
        { prompt: '一个又圆又发亮的东西正在洞里滚动。', answer: 'Something round and shiny was rolling in the cave.', hint: '用 was rolling 表示当时正在滚动' },
      ],
    },
    {
      sentence: 'That’s how Worm knew to bring her here!',
      translation: '虫虫就是这样知道要把她带到这里来的！',
      pattern: 'That is how + 主语 + 动词过去式 + to do',
      grammar: 'That is how 用来总结“事情是怎样发生的”；knew to do 表示“知道应该做某事”。',
      phrases: [['that is how', '就是这样'], ['know to do', '知道应该做']],
      example: 'The map showed Mia the path. That is how she knew to turn left.',
      exampleTranslation: '地图给米娅指了路。她就是这样知道要左转的。',
      exercises: [
        { prompt: '钟声响了。他就是这样知道该回家的。', answer: 'The bell rang. That is how he knew to go home.', hint: '用 That is how he knew to...' },
        { prompt: '路标指向河边。我们就是这样知道要去哪里。', answer: 'The sign pointed to the river. That is how we knew where to go.', hint: '用 knew where to go' },
      ],
    },
    {
      sentence: 'When the robbers saw the dragons, they stopped, their eyes wide.',
      translation: '当强盗们看见巨龙时，他们停了下来，眼睛睁得大大的。',
      pattern: 'When + 事件, 主句, 身体部位 + 形容词',
      grammar: 'when 引导时间状语从句；their eyes wide 是简短的补充描写，说明强盗停下时惊讶的样子。',
      phrases: [['when ... saw ...', '当……看见……时'], ['eyes wide', '眼睛睁得大大的']],
      example: 'When Leo saw the rainbow dragon, he froze, his mouth open.',
      exampleTranslation: '当利奥看见彩虹龙时，他愣住了，嘴巴张得大大的。',
      exercises: [
        { prompt: '当女孩看见礼物时，她停了下来，眼睛睁得大大的。', answer: 'When the girl saw the gift, she stopped, her eyes wide.', hint: '用 When...saw..., she stopped' },
        { prompt: '当男孩听见吼声时，他站着不动，双手冰凉。', answer: 'When the boy heard the roar, he stood still, his hands cold.', hint: '末尾用 his hands cold 补充状态' },
      ],
    },
    {
      sentence: 'Drake could see the green light in Worm’s eyes starting to flicker.',
      translation: '德雷克能看见虫虫眼中的绿光开始闪烁。',
      pattern: '主语 + could see + 宾语 + 动词-ing',
      grammar: 'see 后接“宾语 + 动词-ing”，表示看见某个动作正在发生；starting to flicker 表示开始闪烁。',
      phrases: [['could see', '能够看见'], ['start to flicker', '开始闪烁']],
      example: 'Nina could see the morning sun starting to rise.',
      exampleTranslation: '妮娜能看见朝阳开始升起。',
      exercises: [
        { prompt: '我能看见小船开始移动。', answer: 'I could see the little boat starting to move.', hint: '用 could see + 宾语 + starting to...' },
        { prompt: '他们能看见星星在天空中闪烁。', answer: 'They could see the stars shining in the sky.', hint: '用 see the stars shining 表示看见星星正在闪烁' },
      ],
    },
    {
      sentence: 'He knew how to heal her when no one else could.',
      translation: '在其他人都做不到时，他知道怎样治好她。',
      pattern: '主语 + knew how to + 动词 + when + 从句',
      grammar: 'how to 加动词表示“怎样做某事”；no one else could 中的 could 代替前面重复的 heal her。',
      phrases: [['know how to', '知道怎样'], ['no one else', '没有其他人']],
      example: 'Maya knew how to open the gate when no one else could.',
      exampleTranslation: '在其他人都打不开时，玛雅知道怎样打开大门。',
      exercises: [
        { prompt: '其他人都不会时，他知道怎样修理小船。', answer: 'He knew how to fix the boat when no one else could.', hint: '用 knew how to fix...' },
        { prompt: '其他人都找不到时，苏知道怎样找到回家的路。', answer: 'Sue knew how to find the way home when no one else could.', hint: '结尾用 when no one else could' },
      ],
    },
    {
      sentence: 'But until then, she wants to stay with me in the kingdom of Bracken.',
      translation: '但在那之前，她想和我一起留在布拉肯王国。',
      pattern: 'Until then, 主语 + want(s) to + 动词',
      grammar: 'until then 表示“在那之前”，承接前面提到的未来时间；wants to 后接动词原形。',
      phrases: [['until then', '在那之前'], ['stay with', '和……待在一起']],
      example: 'Dad will return on Friday. Until then, I want to stay with Grandma.',
      exampleTranslation: '爸爸星期五回来。在那之前，我想和奶奶待在一起。',
      exercises: [
        { prompt: '比赛下周开始。在那之前，我们想继续练习。', answer: 'The game starts next week. Until then, we want to keep practicing.', hint: '用 Until then, we want to...' },
        { prompt: '小鸟以后会飞。在那之前，它想留在巢里。', answer: 'The bird will fly later. Until then, it wants to stay in the nest.', hint: '第三人称用 wants' },
      ],
    },
    {
      sentence: 'Whatever happens, we’re all in this together!',
      translation: '无论发生什么，我们都会一起面对！',
      pattern: 'Whatever + 动词, 主句',
      grammar: 'whatever happens 表示“无论发生什么”，引出任何可能的情况；主句说明大家共同面对的态度。',
      phrases: [['whatever happens', '无论发生什么'], ['be in this together', '共同面对这件事']],
      example: 'Whatever happens, our team will help one another.',
      exampleTranslation: '无论发生什么，我们的队伍都会互相帮助。',
      exercises: [
        { prompt: '无论发生什么，我都会和你在一起。', answer: 'Whatever happens, I will stay with you.', hint: '句首用 Whatever happens' },
        { prompt: '无论谁获胜，我们仍然是朋友。', answer: 'Whoever wins, we will still be friends.', hint: '“无论谁”用 Whoever' },
      ],
    },
  ];

  // Percentage anchors chosen against the final chapter contact sheet. Each
  // pair keeps the two question bubbles on quiet background regions instead
  // of covering the chapter's faces, dragons, weapons, or story action.
  const bubblePositions = [
    [{ left: 34, top: 18 }, { left: 82, top: 70 }],
    [{ left: 46, top: 16 }, { left: 78, top: 16 }],
    [{ left: 27, top: 24 }, { left: 64, top: 82 }],
    [{ left: 80, top: 17 }, { left: 82, top: 78 }],
    [{ left: 26, top: 17 }, { left: 76, top: 16 }],
    [{ left: 31, top: 17 }, { left: 70, top: 17 }],
    [{ left: 32, top: 17 }, { left: 68, top: 16 }],
    [{ left: 24, top: 18 }, { left: 25, top: 78 }],
    [{ left: 27, top: 16 }, { left: 73, top: 16 }],
    [{ left: 37, top: 17 }, { left: 78, top: 17 }],
    [{ left: 35, top: 18 }, { left: 74, top: 18 }],
    [{ left: 35, top: 17 }, { left: 75, top: 17 }],
    [{ left: 33, top: 17 }, { left: 76, top: 78 }],
    [{ left: 32, top: 16 }, { left: 62, top: 16 }],
  ];

  pages.forEach((page, pageIndex) => {
    page.questions.forEach((question, questionIndex) => {
      Object.assign(question, questionMetadata[pageIndex][questionIndex]);
    });
    page.sentences = [sentenceLessons[pageIndex]];
    page.bubblePositions = bubblePositions[pageIndex];
  });

  globalThis.BOOK_DATA = {
    id: 'saving-the-sun-dragon',
    title: 'Saving the Sun Dragon',
    titleZh: '拯救太阳龙',
    description: 'The Dragon Masters search for the cause of Kepri’s strange illness and uncover a far-away secret.',
    grade: '小学高年级',
    level: '初级',
    cover: 'assets/cover.png',
    pages,
    retelling: [
      {
        title: 'Kepri Falls Ill',
        image: 'assets/reading-page-2.png',
        keywords: ['tired dragon', 'cloudy eyes', 'tunnel cave-in', 'Ana’s worry'],
        retell: 'Kepri became tired and her eyes looked cloudy. Ana told Griffith that the illness began after the tunnel cave-in.',
        cueZh: '凯普莉生病了，安娜说症状在隧道坍塌后出现。',
      },
      {
        title: 'The Magic Potion',
        image: 'assets/reading-page-4.png',
        keywords: ['blue potion', 'shining liquid', 'clean jar', 'help Kepri'],
        retell: 'The Dragon Masters made a blue, shining potion. Ana gave it to Kepri and hoped it would help.',
        cueZh: '伙伴们调制发光的蓝色药水，希望治好凯普莉。',
      },
      {
        title: 'Ana Misses Home',
        image: 'assets/reading-page-5.png',
        keywords: ['far-away home', 'dangerous roads', 'robbers', 'homesick'],
        retell: 'Ana described the robbers near her far-away home. Drake realized that all the Dragon Masters missed their families.',
        cueZh: '安娜讲述家乡的危险，德雷克发现大家都很想家。',
      },
      {
        title: 'Kepri Finds Wati',
        image: 'assets/reading-page-9.png',
        keywords: ['twin dragons', 'healing power', 'Worm’s journey', 'Wati'],
        retell: 'Kepri had told Worm about her twin, Wati. Worm brought her to the dragon who could heal her.',
        cueZh: '虫虫把凯普莉带到孪生兄弟瓦蒂身边接受治疗。',
      },
      {
        title: 'The Robbers Attack',
        image: 'assets/reading-page-10.png',
        keywords: ['armed robbers', 'black beam', 'flying arrow', 'Ana’s courage'],
        retell: 'Robbers aimed their weapons at the dragons, so Wati fought back. Ana bravely jumped in front of an arrow meant for Kepri.',
        cueZh: '强盗发动攻击，瓦蒂反击，安娜勇敢地保护凯普莉。',
      },
      {
        title: 'A Shared Escape',
        image: 'assets/reading-page-11.png',
        keywords: ['flickering power', 'two light beams', 'open roof', 'fly out'],
        retell: 'Worm could not hold the robbers much longer. Wati and Kepri joined their powers, opened the pyramid, and helped everyone escape.',
        cueZh: '两条龙合力打开金字塔顶部，伙伴们一起逃了出去。',
      },
      {
        title: 'A Stronger Bond',
        image: 'assets/reading-page-13.png',
        keywords: ['voice in her head', 'family', 'brother', 'return to Bracken'],
        retell: 'Ana finally heard Kepri’s voice in her mind. Kepri chose to return to Bracken with Ana and visit her brother one day.',
        cueZh: '安娜听见凯普莉的心声，她们决定一起回到布拉肯。',
      },
      {
        title: 'Together at Home',
        image: 'assets/reading-page-14.png',
        keywords: ['Maldred', 'dark magic', 'protect the kingdom', 'teamwork'],
        retell: 'Back home, the friends learned that Maldred was still a threat. They promised to protect the kingdom together.',
        cueZh: '回到家后，伙伴们决定团结起来守护王国。',
      },
    ],
  };
})();
