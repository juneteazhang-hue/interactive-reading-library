(() => {
  const pages = globalThis.READING_PAGES;
  const lessons = [
    [{sentence:'Is there a connection between music and language?',translation:'音乐和语言之间有联系吗？',pattern:'Is there + a/an + 名词 + between A and B?',grammar:'Is there 用来询问是否存在某事；between A and B 表示两者之间。connection 由 connect 加名词后缀 -ion 构成。',phrases:[['a connection between','……之间的联系'],['music and language','音乐和语言']],example:'Is there a connection between sleep and memory?',exampleTranslation:'睡眠和记忆之间有联系吗？',exercises:[{prompt:'运动和健康之间有联系吗？',answer:'Is there a connection between exercise and health?',hint:'用 Is there a connection between A and B?'},{prompt:'声音和情绪之间有联系吗？',answer:'Is there a connection between sound and emotion?',hint:'between 后并列两个名词'}]}],
    [{sentence:'A study from Northwestern University shows that playing a musical instrument can improve a person’s hearing ability.',translation:'西北大学的一项研究表明，演奏乐器可以提高一个人的听力。',pattern:'A study shows that + 动名词短语 + can + 动词',grammar:'that 引导宾语从句；playing a musical instrument 是动名词短语，在从句中作主语。',phrases:[['a study shows that','一项研究表明'],['play a musical instrument','演奏乐器'],['improve hearing ability','提高听力']],example:'A study shows that reading every day can improve vocabulary.',exampleTranslation:'一项研究表明，每天阅读可以增加词汇量。',exercises:[{prompt:'一项研究表明，唱歌可以改善记忆力。',answer:'A study shows that singing can improve memory.',hint:'singing 作主语'},{prompt:'一项研究表明，锻炼可以改善睡眠。',answer:'A study shows that exercising can improve sleep.',hint:'用 can improve'}]}],
    [{sentence:'The people in the first group were musicians, while those in the second group had no musical training.',translation:'第一组人是音乐家，而第二组人没有受过音乐训练。',pattern:'A ..., while those in B ...',grammar:'while 在这里表示对比；those 代替前面出现的 people，避免重复。',phrases:[['the first group','第一组'],['the second group','第二组'],['musical training','音乐训练']],example:'The first team wore red, while those in the second team wore blue.',exampleTranslation:'第一队穿红色，而第二队穿蓝色。',exercises:[{prompt:'第一组在听音乐，而第二组在阅读。',answer:'The first group listened to music, while those in the second group read.',hint:'用 while 连接对比'},{prompt:'第一组是学生，而第二组是老师。',answer:'The people in the first group were students, while those in the second group were teachers.',hint:'those 代替 people'}]}],
    [{sentence:'Musicians hear better, says study leader Nina Kraus, because they learn to pay attention to certain sounds.',translation:'研究负责人妮娜·克劳斯说，音乐家听得更好，因为他们学会了注意特定的声音。',pattern:'结果 + because + 原因',grammar:'because 引导原因状语从句，直接回答“为什么”；插入的 says... 说明观点来源。',phrases:[['hear better','听得更好'],['pay attention to','注意'],['certain sounds','特定声音']],example:'Lena remembers the tune because she listens carefully.',exampleTranslation:'莉娜记得这段旋律，因为她听得很认真。',exercises:[{prompt:'音乐家进步了，因为他们每天练习。',answer:'The musicians improved because they practiced every day.',hint:'because 后写原因'},{prompt:'我听得更清楚，因为我注意了这个声音。',answer:'I heard more clearly because I paid attention to the sound.',hint:'pay 的过去式是 paid'}]}],
    [{sentence:'In this way, musicians are able to concentrate on certain sounds, even in a room with lots of noise.',translation:'通过这种方式，即使房间里有很多噪音，音乐家也能专注于特定声音。',pattern:'In this way, 主语 + be able to + 动词, even in + 地点',grammar:'with lots of noise 是介词短语，放在 room 后作后置定语；be able to 表示“能够”。',phrases:[['in this way','通过这种方式'],['be able to','能够'],['concentrate on','专注于'],['with lots of noise','有很多噪音的']],example:'In this way, Mia is able to read even in a room with many people.',exampleTranslation:'通过这种方式，即使房间里有很多人，米娅也能阅读。',exercises:[{prompt:'通过这种方式，即使在嘈杂的教室里，他也能专心。',answer:'In this way, he is able to concentrate even in a noisy classroom.',hint:'be able to concentrate'},{prompt:'她在一间有很多书的房间里学习。',answer:'She studies in a room with lots of books.',hint:'with lots of books 后置修饰 room'}]}],
    [{sentence:'Because of their illness, these people cannot say their names, addresses, or other information normally.',translation:'由于疾病，这些人无法正常说出姓名、地址或其他信息。',pattern:'Because of + 名词, 主语 + cannot + 动词',grammar:'because of 后接名词或名词短语；because 后接完整句子。normally 修饰 say。',phrases:[['because of','由于'],['other information','其他信息'],['speak normally','正常说话']],example:'Because of the noise, Leo cannot hear the teacher clearly.',exampleTranslation:'由于噪音，利奥无法清楚地听见老师。',exercises:[{prompt:'由于大雨，我们不能去公园。',answer:'Because of the heavy rain, we cannot go to the park.',hint:'because of 后接名词短语'},{prompt:'由于疾病，他不能正常走路。',answer:'Because of his illness, he cannot walk normally.',hint:'normally 放在动词后'}]}],
    [
      {sentence:'Dr. Schlaug was surprised to find that singing words helped his patients to eventually speak.',translation:'施劳格医生惊讶地发现，唱出词语帮助患者最终开口说话。',pattern:'主语 + be surprised to find that + 从句',grammar:'be surprised to find that 表示“惊讶地发现……”；singing words 是动名词短语作主语。',phrases:[['be surprised to find','惊讶地发现'],['sing words','唱出词语'],['eventually speak','最终说话']],example:'The teacher was surprised to find that singing helped the class remember.',exampleTranslation:'老师惊讶地发现，唱歌帮助全班记忆。',exercises:[{prompt:'我惊讶地发现音乐帮助我专注。',answer:'I was surprised to find that music helped me concentrate.',hint:'find 后接 that 从句'},{prompt:'医生惊讶地发现病人能够唱歌。',answer:'The doctor was surprised to find that the patient could sing.',hint:'could 表示能够'}]},
      {sentence:'Music seems to activate different parts of the brain, including the damaged parts.',translation:'音乐似乎能够激活大脑的不同区域，包括受损区域。',pattern:'主语 + seem(s) to + 动词, including + 名词',grammar:'seem to 表示“似乎”；including 用于补充列举包含的内容。',phrases:[['seem to','似乎'],['activate the brain','激活大脑'],['including','包括']],example:'The rhythm seems to activate her memory, including old songs.',exampleTranslation:'节奏似乎激活了她的记忆，包括旧歌。',exercises:[{prompt:'音乐似乎能激活记忆。',answer:'Music seems to activate memory.',hint:'seems to 后接动词原形'},{prompt:'这项活动帮助许多学生，包括初学者。',answer:'The activity helps many students, including beginners.',hint:'including 补充举例'}]},
    ],
    [{sentence:'Music, therefore, is not only enjoyable; it’s also good for us in many other ways.',translation:'因此，音乐不仅令人愉快，还能以许多其他方式给我们带来好处。',pattern:'主语 + be + not only A; 主语 + be also B',grammar:'not only...also... 连接并列信息；therefore 表示前文证据带来的结论。',phrases:[['not only...also...','不仅……而且……'],['therefore','因此'],['in many ways','以许多方式']],example:'Reading is not only useful; it is also enjoyable.',exampleTranslation:'阅读不仅有用，而且令人愉快。',exercises:[{prompt:'唱歌不仅有趣，而且对记忆有好处。',answer:'Singing is not only fun; it is also good for memory.',hint:'not only 与 also 对应'},{prompt:'因此，锻炼以很多方式帮助我们。',answer:'Exercise, therefore, helps us in many ways.',hint:'therefore 前后用逗号隔开'}]}],
  ];

  const metadata = [
    [{skill:'main-idea',bubble:'Music + language',rationale:'The paragraph explicitly introduces music and language; the other pairs are not discussed.'},{skill:'text-structure',bubble:'Two examples ahead',rationale:'The author states a claim and previews examples, so the next section will explain evidence.'}],
    [{skill:'key-detail-source',bubble:'Where was the study?',rationale:'Northwestern University is named directly; the other places belong to different or invented contexts.'},{skill:'apply-method',bubble:'Copy the experiment',rationale:'The defining setup is two groups listening to speech in noise.'}],
    [{skill:'compare-groups',bubble:'Who had training?',rationale:'The musicians were in the first group and the second group had no musical training.'},{skill:'infer-from-result',bubble:'What does it suggest?',rationale:'Clearer speech perception by musicians supports a possible training benefit without proving the distractors.'}],
    [{skill:'cause-and-effect',bubble:'Why hear better?',rationale:'Kraus connects better hearing with learned attention to selected sounds.'},{skill:'apply-example',bubble:'Find your own sound',rationale:'A violinist must monitor their instrument inside many simultaneous sounds.'}],
    [{skill:'key-detail-action',bubble:'Ignore which sounds?',rationale:'The text says violinists ignore the other sounds, not their own playing.'},{skill:'analyze-causal-chain',bubble:'Focus through filtering',rationale:'Close listening plus ignoring competitors leads to concentration in noise.'}],
    [{skill:'contrast',bubble:'Speech vs. singing',rationale:'The patients cannot speak normally but can still sing.'},{skill:'cohesion-however',bubble:'Why “However”?',rationale:'However signals the surprising contrast between impaired speech and preserved singing.'}],
    [{skill:'treatment-detail',bubble:'Singing words',rationale:'The observed activity was singing words, not the unrelated distractors.'},{skill:'evaluate-explanation',bubble:'Possible, not certain',rationale:'Schlaug offers activation as a possible mechanism and openly says he is not sure.'}],
    [{skill:'summary-detail',bubble:'Many benefits',rationale:'Concentration is part of the explicit list of benefits.'},{skill:'theme-synthesis',bubble:'The overall boost',rationale:'The conclusion combines enjoyment with broad cognitive and language benefits.'}],
  ];

  const bubblePositions = [
    [{left:28,top:42},{left:75,top:70}], [{left:72,top:42},{left:30,top:72}],
    [{left:28,top:38},{left:74,top:72}], [{left:72,top:40},{left:28,top:72}],
    [{left:30,top:42},{left:76,top:72}], [{left:75,top:40},{left:28,top:70}],
    [{left:28,top:42},{left:74,top:72}], [{left:72,top:42},{left:28,top:70}],
  ];

  pages.forEach((page,index) => {
    page.sentences = lessons[index];
    page.bubblePositions = bubblePositions[index];
    page.questions.forEach((question,qIndex) => Object.assign(question, metadata[index][qIndex]));
  });

  const assessment = {
    title:'Whole-Text Check',
    sections:[
      {type:'multiple-choice',title:'Reading Comprehension',items:[
        {label:'GIST',question:'What could be another title for the “Music and Hearing” section?',choices:['Trained to Listen','How to Be a Musician','Playing in an Orchestra'],answer:0,evidence:'The section explains how musical training teaches selective listening.'},
        {label:'DETAIL',question:'What two groups did Nina Kraus study?',choices:['noisy people and quiet people','musicians and nonmusicians','violinists and other musicians'],answer:1,evidence:'The first group were musicians and the second had no musical training.'},
        {label:'REFERENCE',question:'What does “they” refer to in paragraph C, line 3?',choices:['orchestra musicians','instruments','violinists'],answer:2,evidence:'The sentence begins with the violinists and then says they hear their own instrument.'},
        {label:'DETAIL',question:'What is true about Nina Kraus and Gottfried Schlaug?',choices:['They both work at Harvard Medical School.','They both play an instrument in an orchestra.','They are both interested in how music and the brain are connected.'],answer:2,evidence:'Both researchers study effects of music on hearing, language, or the brain.'},
        {label:'DETAIL',question:'How does Gottfried Schlaug help stroke patients speak?',choices:['by playing music for them','by getting them to sing words','by teaching them to play instruments'],answer:1,evidence:'Singing words helped the patients eventually speak.'},
      ]},
      {type:'tfn',title:'True, False, or Not Given',items:[
        {question:'In the Northwestern University study, the nonmusicians could hear better.',choices:['T','F','NG'],answer:'F',evidence:'The musicians heard the talking person more clearly.',rationale:'This directly contradicts the passage.'},
        {question:'Nina Kraus can play the violin very well.',choices:['T','F','NG'],answer:'NG',evidence:'The passage uses violinists as an example but gives no information about Kraus playing violin.',rationale:'No statement confirms or denies her violin skill.'},
        {question:'People who speak well can learn to play an instrument quickly.',choices:['T','F','NG'],answer:'NG',evidence:'The passage does not discuss speed of learning an instrument.',rationale:'The information is absent.'},
        {question:'Gottfried Schlaug isn’t sure why music helps stroke patients.',choices:['T','F','NG'],answer:'T',evidence:'The passage explicitly says Schlaug isn’t sure.',rationale:'The statement matches the text.'},
        {question:'Studies show that listening to music helps people sleep better.',choices:['T','F','NG'],answer:'NG',evidence:'Sleep is not discussed among the listed benefits.',rationale:'The text neither confirms nor denies this claim.'},
        {question:'Nina Kraus believes that singing lessons can help students get better grades in school.',choices:['T','F','NG'],answer:'T',evidence:'Kraus says playing an instrument or singing can help us do better in school.',rationale:'Doing better in school supports the statement.'},
      ]},
      {type:'supporting-reasons',title:'Identifying Supporting Reasons',passage:'Researchers believe Western music is popular because of its ability to express emotions across cultures. Since Tom Fritz wanted to include a variety of Western music types, he played classical, rock, pop, and jazz to members of the Mafa. The Mafa identified the emotions correctly, probably due to rhythms and melodies that are similar to basic human speech.',items:[
        {question:'Why do researchers believe Western music is popular?',answer:'Because it can express emotions across cultures.',signal:'because',evidence:'popular because of its ability to express emotions across cultures'},
        {question:'Why did Tom Fritz play classical, rock, pop, and jazz?',answer:'Because he wanted to include a variety of Western music types.',signal:'since',evidence:'Since he wanted to include a variety...'},
        {question:'Why could the Mafa identify the emotions?',answer:'Because Western rhythms and melodies are similar to basic human speech.',signal:'due to',evidence:'due to rhythms and melodies...similar to basic human speech'},
      ]},
    ],
  };

  assessment.multipleChoice = assessment.sections.find(section => section.type === 'multiple-choice').items;
  assessment.trueFalseNotGiven = assessment.sections.find(section => section.type === 'tfn').items;
  assessment.supportingReasons = assessment.sections.find(section => section.type === 'supporting-reasons').items;

  const retelling = [
    {title:'Music Meets Language',image:'assets/reading-page-1.png',keywords:['music','language','connection','brain'],retell:'Studies show a connection between music and language. Music can boost language abilities in the brain.',cueZh:'研究发现音乐和语言有关联。'},
    {title:'A Hearing Study',image:'assets/reading-page-2.png',keywords:['study','instrument','hearing','noisy room'],retell:'Researchers tested two groups listening to speech in a noisy room. They wanted to compare hearing ability.',cueZh:'研究人员在嘈杂环境中测试两组人的听力。'},
    {title:'The Clearer Listeners',image:'assets/reading-page-3.png',keywords:['musicians','nonmusicians','training','clearly'],retell:'The first group were musicians, but the second had no musical training. The musicians heard the speaker more clearly.',cueZh:'音乐家比没有训练的人听得更清楚。'},
    {title:'Listening in an Orchestra',image:'assets/reading-page-4.png',keywords:['violinists','orchestra','own instrument','attention'],retell:'Violinists hear many instruments at once. They learn to pay attention to their own sound.',cueZh:'小提琴手在乐团中练习选择性聆听。'},
    {title:'Filtering the Noise',image:'assets/reading-page-5.png',keywords:['listen closely','ignore','concentrate','noise'],retell:'Musicians listen closely and ignore other sounds. This helps them concentrate even in noise.',cueZh:'音乐家过滤干扰音并集中注意力。'},
    {title:'Speech Becomes Difficult',image:'assets/reading-page-6.png',keywords:['doctor','stroke patients','normally','still sing'],retell:'Some stroke patients cannot speak normally. However, they can still sing.',cueZh:'中风患者难以说话，却仍然能够唱歌。'},
    {title:'Singing Wakes the Brain',image:'assets/reading-page-7.png',keywords:['singing words','eventually speak','activate','damaged parts'],retell:'Singing words helped patients speak again. Music may activate different parts of the brain.',cueZh:'唱词可能激活脑区并帮助恢复语言。'},
    {title:'The Musical Boost',image:'assets/reading-page-8.png',keywords:['concentration','memory','language','sharp brain'],retell:'Music supports concentration, memory, listening and language. It is enjoyable and good for us in many ways.',cueZh:'音乐给专注、记忆、语言和大脑带来多种益处。'},
  ];

  globalThis.BOOK_DATA = {id:'a-musical-boost',title:'A Musical Boost',titleZh:'音乐给大脑的助力',description:'How music can strengthen hearing, speech, attention and the brain.',grade:'小学高年级',level:'RE Level 1',cover:'assets/cover.png',textbook:'READING EXPLORER 1 · THIRD EDITION',textbookCover:'books/a-musical-boost/assets/textbook-cover.gif',theme:'reading-explorer-1',pages,assessment,retelling};
})();
