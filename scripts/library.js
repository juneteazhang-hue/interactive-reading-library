(() => {
  const catalog = globalThis.READING_CATALOG || [];
  const search = document.querySelector('#librarySearch');
  const grade = document.querySelector('#gradeFilter');
  const level = document.querySelector('#levelFilter');
  const grid = document.querySelector('#bookGrid');
  const empty = document.querySelector('#emptyLibrary');
  const count = document.querySelector('#bookCount');
  const unique = key => [...new Set(catalog.map(item => item[key]))];
  unique('grade').forEach(value => grade.insertAdjacentHTML('beforeend', `<option value="${value}">${value}</option>`));
  unique('level').forEach(value => level.insertAdjacentHTML('beforeend', `<option value="${value}">${value}</option>`));
  function render() {
    const term = search.value.trim().toLowerCase();
    const items = catalog.filter(item => (!term || `${item.title} ${item.titleZh}`.toLowerCase().includes(term)) && (!grade.value || item.grade === grade.value) && (!level.value || item.level === level.value));
    grid.innerHTML = items.map(item => `<article class="book-card"><img class="cover" src="${item.cover}" alt="${item.titleZh}封面"><div class="card-body"><div class="chips"><span class="chip">${item.grade}</span><span class="chip">${item.level}</span><span class="chip">${item.pages} 段＋复述</span></div><h3>${item.title}</h3><h4>${item.titleZh}</h4><p>${item.description}</p><a class="start-link" href="reader.html?book=${encodeURIComponent(item.id)}">开始精读 <span>→</span></a></div></article>`).join('');
    empty.hidden = items.length > 0;
    count.textContent = `共 ${items.length} 篇`;
  }
  [search, grade, level].forEach(control => control.addEventListener('input', render));
  render();
})();
