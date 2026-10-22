(() => {
  const heroBg = document.getElementById('heroBg');
  const img = heroBg && heroBg.querySelector('img');
  if (!img) return;
  const go = () => heroBg.classList.add('loaded');
  if (img.complete) go(); else img.addEventListener('load', go);
})();
