(() => {
  // Filter
  const btns = document.querySelectorAll('.filter-btn');
  const items = Array.from(document.querySelectorAll('.gallery-item'));
  const countEl = document.getElementById('galleryCount');
  let activeFilter = 'kaikki';
  let visibleItems = items;
  
  function applyFilter(filter) {
    activeFilter = filter;
    visibleItems = [];
    items.forEach(item => {
      const cat = item.dataset.category;
      const show = filter === 'kaikki' || cat === filter;
      item.classList.toggle('hidden', !show);
      if (show) visibleItems.push(item);
    });
    countEl.textContent = visibleItems.length + ' kuvaa';
    btns.forEach(b => b.classList.toggle('active', b.dataset.filter === filter));
  }
  btns.forEach(btn => btn.addEventListener('click', () => applyFilter(btn.dataset.filter)));
  
  // Lightbox
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbCap = document.getElementById('lbCap');
  const lbCounter = document.getElementById('lbCounter');
  let current = 0;
  
  function openLb(idx) {
    current = idx;
    const item = visibleItems[idx];
    const img = item.querySelector('img');
    lbImg.src = img.srcset ? img.srcset.split(',').pop().trim().split(' ')[0] : img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = item.querySelector('.gallery-item-cat').textContent;
    lbCounter.textContent = (idx + 1) + ' / ' + visibleItems.length;
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeLb() { lb.classList.remove('active'); document.body.style.overflow = ''; lbImg.src = ''; }
  function nav(dir) { current = (current + dir + visibleItems.length) % visibleItems.length; openLb(current); }
  
  items.forEach((item, i) => item.addEventListener('click', () => {
    const visIdx = visibleItems.indexOf(item);
    if (visIdx > -1) openLb(visIdx);
  }));
  document.getElementById('lbClose').addEventListener('click', closeLb);
  document.getElementById('lbPrev').addEventListener('click', () => nav(-1));
  document.getElementById('lbNext').addEventListener('click', () => nav(1));
  lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('active')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') nav(-1);
    if (e.key === 'ArrowRight') nav(1);
  });
})();
