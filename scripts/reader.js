(() => {
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const params = new URLSearchParams(location.search);
  const bookId = params.get('book') || '';
  const entry = (globalThis.READING_CATALOG || []).find(item => item.id === bookId);
  const bookBase = `books/${bookId}/`;
  let book;
  let state;
  let activeQuestion = 0;
  let activeSentence = 0;
  let celebrationTimer;

  const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const loadScript = src => new Promise((resolve, reject) => { const script = document.createElement('script'); script.src = src; script.onload = resolve; script.onerror = reject; document.head.append(script); });

  async function boot() {
    if (!entry || !/^[a-z0-9-]+$/.test(bookId)) return showError();
    try {
      await loadScript(`${bookBase}pages.js`);
      await loadScript(`${bookBase}content.js`);
      book = globalThis.BOOK_DATA;
      if (!book || book.id !== bookId || book.pages.length !== 8 || book.retelling.length !== 8) throw new Error('Invalid book data');
      state = loadProgress();
      $('#loadingState').hidden = true;
      $('#readerApp').hidden = false;
      $('#bookBrand').textContent = book.titleZh;
      $('#bookGrade').textContent = `${book.grade} · ${book.level}`;
      $('#bookTitle').textContent = book.title;
      document.title = `${book.titleZh} · 互动精读`;
      bindEvents();
      render();
    } catch { showError(); }
  }

  function showError() { $('#loadingState').hidden = true; $('#errorState').hidden = false; }
  function loadProgress() { try { const data = JSON.parse(localStorage.getItem(`reading-progress:${bookId}`)); return data && Number.isInteger(data.page) && data.page >= 0 && data.page <= 8 ? { page:data.page, done:Array.isArray(data.done)?data.done:[] } : {page:0,done:[]}; } catch { return {page:0,done:[]}; } }
  function save() { localStorage.setItem(`reading-progress:${bookId}`, JSON.stringify(state)); }
  const questionId = (page, question) => `${page}-${question}`;
  const pageComplete = page => book.pages[page]?.questions.every((_, index) => state.done.includes(questionId(page,index)));

  function emphasize(text, vocabulary) {
    let html = escapeHtml(text);
    vocabulary.map(item=>item[0]).sort((a,b)=>b.length-a.length).forEach(term => { html = html.replace(new RegExp(`\\b(${escapeRegex(term)}(?:s|ed|ing)?)\\b`,'gi'),'<strong class="key-word">$1</strong>'); });
    return html;
  }

  function paragraphHtml(page) {
    let cursor=0, html='';
    [...page.sentences].sort((a,b)=>page.paragraph.indexOf(a.sentence)-page.paragraph.indexOf(b.sentence)).forEach((lesson,index)=>{
      const start=page.paragraph.indexOf(lesson.sentence,cursor); if(start<0)return;
      html+=emphasize(page.paragraph.slice(cursor,start),page.vocabulary);
      html+=`<button class="core-sentence" type="button" data-sentence="${index}"><span>${emphasize(lesson.sentence,page.vocabulary)}</span><small>点击解析</small></button>`;
      cursor=start+lesson.sentence.length;
    });
    return html+emphasize(page.paragraph.slice(cursor),page.vocabulary);
  }

  function render() {
    const isRetelling=state.page===8;
    $('#readingWorkspace').hidden=isRetelling;
    $('#retellingPage').hidden=!isRetelling;
    if(isRetelling) renderRetelling(); else renderReading();
    renderProgress();
  }

  function renderReading() {
    const page=book.pages[state.page];
    $('#nodeEyebrow').textContent=`STORY PAGE ${String(state.page+1).padStart(2,'0')} · CLOSE READING`;
    $('#nodeTitle').textContent=page.title;
    $('#nodeIntro').textContent='重点词汇已加粗；金色核心句可以点击解析。';
    $('#missionText').textContent='听读文段，学习词汇，再完成右侧两个气泡问题。';
    $('#storyText').innerHTML=`<p>${paragraphHtml(page)}</p>`;
    $$('[data-sentence]').forEach(button=>button.addEventListener('click',()=>openSentenceLesson(Number(button.dataset.sentence))));
    $('#translation').textContent=page.translation; $('#translation').hidden=true; $('#translateBtn').textContent='中 显示句意';
    $('#vocabCards').innerHTML=page.vocabulary.map(([word,ipa,pos,cn,en])=>`<article class="vocab-card"><button type="button" data-word="${escapeHtml(word)}" aria-label="朗读 ${escapeHtml(word)}">🔊</button><div class="vocab-word">${escapeHtml(word)}</div><div class="vocab-phonetic">${escapeHtml(ipa)} · ${escapeHtml(pos)}</div><div class="vocab-cn">${escapeHtml(cn)}</div><div class="vocab-en">${escapeHtml(en)}</div></article>`).join('');
    $$('[data-word]').forEach(button=>button.addEventListener('click',()=>speak(button.dataset.word,.76)));
    $('#sceneImage').src=`${bookBase}${page.image}`; $('#sceneImage').alt=`${page.title} 场景插图`;
    $('#sceneKicker').textContent=`STORY SCENE · ${state.page+1}/8`; $('#sceneTitle').textContent=page.title;
    $('#bubbleLayer').innerHTML=page.questions.map((_,index)=>`<button class="quiz-bubble ${state.done.includes(questionId(state.page,index))?'done':''}" style="left:${index?28:67}%;top:${index?70:46}%" data-question="${index}" type="button"><span>${state.done.includes(questionId(state.page,index))?'✓':index+1}</span></button>`).join('');
    $$('[data-question]').forEach(button=>button.addEventListener('click',()=>openQuestion(Number(button.dataset.question))));
    $('#paragraphAudio').src=`${bookBase}${page.audio}`;
    $('#taskArea').innerHTML=pageComplete(state.page)?'<p class="feedback">✓ 本页两道题已完成。</p>':'<p>可自由翻页；答题进度会自动保存。</p>';
    $('#readingPanel').scrollTop=0;
  }

  function renderProgress() {
    $('#progressText').textContent=`${state.page+1} / 9`;
    $('#progressLabel').textContent=state.page===8?'STORY RETELLING':book.pages[state.page].title.toUpperCase();
    $('#prevBtn').disabled=state.page===0; $('#nextBtn').disabled=state.page===8;
    $('#progressDots').innerHTML=Array.from({length:9},(_,index)=>`<li><button class="progress-page ${index===state.page?'active':''} ${index<8&&pageComplete(index)?'complete':''}" data-page="${index}" type="button" ${index===state.page?'aria-current="page"':''} aria-label="前往第 ${index+1} 页">${index===8?'复述':index+1}</button></li>`).join('');
    $$('[data-page]').forEach(button=>button.addEventListener('click',()=>goToPage(Number(button.dataset.page))));
  }

  function goToPage(page) { if(!Number.isInteger(page)||page<0||page>8||page===state.page)return; stopAudio(); closeLayers(); state.page=page; save(); render(); }
  function stopAudio(){const audio=$('#paragraphAudio');audio.pause();audio.currentTime=0;if('speechSynthesis'in window)speechSynthesis.cancel();}
  function speak(text,rate=.86){if(!('speechSynthesis'in window))return; speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='en-US';u.rate=rate;speechSynthesis.speak(u);}

  function openQuestion(index){activeQuestion=index;const q=book.pages[state.page].questions[index];$('#quizProgress').textContent=`BLOOM · ${q.level.toUpperCase()} · ${q.skill}`;$('#quizQuestion').textContent=q.question;$('#quizChoices').innerHTML=q.choices.map((choice,i)=>`<button class="quiz-answer" data-answer="${i}" type="button">${String.fromCharCode(65+i)}. ${escapeHtml(choice)}</button>`).join('');$('#quizFeedback').textContent='';$$('[data-answer]').forEach(button=>button.addEventListener('click',()=>answerQuestion(button)));$('#quizDialog').showModal();}
  function answerQuestion(button){const q=book.pages[state.page].questions[activeQuestion];const correct=Number(button.dataset.answer)===q.answer;$$('.quiz-answer').forEach(item=>item.classList.remove('correct','wrong','shake'));if(correct){button.classList.add('correct');$('#quizFeedback').textContent=`回答正确！文本依据：${q.evidence}`;const id=questionId(state.page,activeQuestion);if(!state.done.includes(id))state.done.push(id);save();playFeedbackSound('success');launchCelebration(button);renderProgress();}else{button.classList.add('wrong','shake');$('#quizFeedback').textContent=`再试一次。文本依据：${q.evidence}`;playFeedbackSound('error');setTimeout(()=>button.classList.remove('shake'),520);}}

  function playFeedbackSound(type){try{const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;const c=new AC(),now=c.currentTime;const notes=type==='success'?[[520,0,.12,'sine'],[780,.11,.18,'triangle']]:[[180,0,.16,'square'],[120,.2,.22,'square']];notes.forEach(([f,at,d,wave])=>{const o=c.createOscillator(),g=c.createGain();o.type=wave;o.frequency.value=f;g.gain.setValueAtTime(.07,now+at);g.gain.exponentialRampToValueAtTime(.001,now+at+d);o.connect(g).connect(c.destination);o.start(now+at);o.stop(now+at+d)});setTimeout(()=>c.close().catch(()=>{}),900)}catch{}}
  function launchCelebration(anchor){clearTimeout(celebrationTimer);const layer=$('#celebrationLayer'),rect=anchor.getBoundingClientRect();layer.replaceChildren();layer.style.setProperty('--origin-x',`${rect.left+rect.width/2}px`);layer.style.setProperty('--origin-y',`${rect.top+rect.height/2}px`);for(let i=0;i<40;i++){const p=document.createElement('i');p.className=i%6?'celebration-confetti':'celebration-star';p.style.cssText=`--x:${(Math.random()-.5)*620}px;--y:${-90-Math.random()*390}px;--r:${Math.random()*700-350}deg;--delay:${Math.random()*.18}s;background:${['#ffd75a','#ff6b6b','#72e6a6','#65b7ff','#c68cff'][i%5]}`;layer.append(p)}layer.classList.add('active');celebrationTimer=setTimeout(()=>{layer.classList.remove('active');layer.replaceChildren()},1800)}

  function openSentenceLesson(index){activeSentence=index;const lesson=book.pages[state.page].sentences[index],layer=$('#sentenceLesson');layer.style.setProperty('--lesson-bg',`url("${bookBase}${book.pages[state.page].image}")`);$('#sentenceLessonTitle').textContent=`核心句式 ${index+1}`;$('#sentenceLessonBody').innerHTML=`<blockquote class="lesson-sentence">${escapeHtml(lesson.sentence)}</blockquote><p class="lesson-translation">${escapeHtml(lesson.translation)}</p><section class="lesson-block"><h3>句型骨架</h3><code>${escapeHtml(lesson.pattern)}</code></section><section class="lesson-block"><h3>语法解析</h3><p>${escapeHtml(lesson.grammar)}</p></section><section class="lesson-block"><h3>核心词组</h3><div class="phrase-chips">${lesson.phrases.map(([en,cn])=>`<span><b>${escapeHtml(en)}</b>${escapeHtml(cn)}</span>`).join('')}</div></section><section class="lesson-block example-block"><h3>示范例句</h3><p>${escapeHtml(lesson.example)}</p><small>${escapeHtml(lesson.exampleTranslation)}</small></section><section class="lesson-block"><h3>仿写练习</h3><div class="exercise-list">${lesson.exercises.map((x,i)=>`<article class="exercise-card"><span>练习 ${i+1}</span><p>${escapeHtml(x.prompt)}</p><button type="button" data-model-answer="${i}">查看参考答案</button></article>`).join('')}</div></section>`;$$('[data-model-answer]').forEach(button=>button.addEventListener('click',()=>showModelAnswer(Number(button.dataset.modelAnswer))));layer.hidden=false;document.body.classList.add('overlay-open');}
  function closeSentenceLesson(){if($('#sentenceLesson').hidden)return;closeModelAnswer();$('#sentenceLesson').hidden=true;document.body.classList.remove('overlay-open');}
  function showModelAnswer(index){const x=book.pages[state.page].sentences[activeSentence].exercises[index];$('#modelAnswerText').textContent=x.answer;$('#modelAnswerHint').textContent=`结构提示：${x.hint}`;$('#modelAnswer').hidden=false;}
  function closeModelAnswer(){$('#modelAnswer').hidden=true;}

  function renderRetelling(){const grid=$('#retellGrid');grid.innerHTML=book.retelling.map((item,index)=>`<button class="retell-card" type="button" aria-pressed="false" aria-label="翻转第 ${index+1} 幅复述卡"><span class="retell-inner"><span class="retell-face retell-front"><img src="${bookBase}${item.image}" alt="第 ${index+1} 幅：${escapeHtml(item.title)}"><b class="retell-number">${index+1}</b><strong class="retell-title">${escapeHtml(item.title)}</strong></span><span class="retell-face retell-back"><h3>Keywords</h3><span class="retell-keywords">${item.keywords.map(word=>`<span>${escapeHtml(word)}</span>`).join('')}</span><span class="retell-en">${escapeHtml(item.retell)}</span><span class="retell-zh">中文提示：${escapeHtml(item.cueZh)}</span></span></span></button>`).join('');$$('.retell-card').forEach(card=>card.addEventListener('click',()=>{const flipped=card.classList.toggle('is-flipped');card.setAttribute('aria-pressed',String(flipped))}));}
  function closeLayers(){if($('#quizDialog').open)$('#quizDialog').close();closeSentenceLesson();}
  function bindEvents(){$('#prevBtn').addEventListener('click',()=>goToPage(state.page-1));$('#nextBtn').addEventListener('click',()=>goToPage(state.page+1));$('#translateBtn').addEventListener('click',()=>{const box=$('#translation');box.hidden=!box.hidden;$('#translateBtn').textContent=box.hidden?'中 显示句意':'中 隐藏句意'});$('#speakBtn').addEventListener('click',()=>{const audio=$('#paragraphAudio');audio.currentTime=0;audio.play().catch(()=>speak(book.pages[state.page].paragraph))});$('#soundToggle').addEventListener('click',()=>state.page<8&&speak(book.pages[state.page].paragraph));$('#resetBtn').addEventListener('click',()=>{if(confirm('确定重置本故事的学习进度吗？')){localStorage.removeItem(`reading-progress:${bookId}`);state={page:0,done:[]};render()}});$('#resetCards').addEventListener('click',()=>$$('.retell-card').forEach(card=>{card.classList.remove('is-flipped');card.setAttribute('aria-pressed','false')}));$('.quiz-close').addEventListener('click',()=>$('#quizDialog').close());$('#sentenceLessonClose').addEventListener('click',closeSentenceLesson);$('#modelAnswerClose').addEventListener('click',closeModelAnswer);$('[data-close-lesson]').addEventListener('click',closeSentenceLesson);$('[data-close-answer]').addEventListener('click',closeModelAnswer);document.addEventListener('keydown',event=>{if(event.key!=='Escape')return;if(!$('#modelAnswer').hidden)closeModelAnswer();else if(!$('#sentenceLesson').hidden)closeSentenceLesson();else if($('#quizDialog').open)$('#quizDialog').close()});$$('.mobile-tab').forEach(button=>button.addEventListener('click',()=>{$$('.mobile-tab').forEach(x=>x.classList.toggle('active',x===button));$('#readingPanel').classList.toggle('active-panel',button.dataset.panel==='read');$('#scenePanel').classList.toggle('active-panel',button.dataset.panel==='explore')}));}
  boot();
})();
