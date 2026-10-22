(() => {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const status = document.getElementById('formStatus');
  const thanks = document.getElementById('formThanks');
  const btn = form.querySelector('.form-submit');
  const names = ['nimi', 'email', 'puhelin', 'palvelu', 'paivamaara', 'paikka', 'viesti'];
  const email = form.dataset.email;
  const label = btn.textContent;

  const showThanks = () => { form.hidden = true; status.textContent = ''; thanks.hidden = false; thanks.focus(); };
  const generalError = () => {
    status.textContent = 'Viestin lähetys ei onnistunut. Voit kirjoittaa minulle suoraan osoitteeseen ';
    const a = document.createElement('a');
    a.href = 'mailto:' + email;
    a.textContent = email;
    status.append(a, '.');
  };
  const clearErrors = () => {
    status.textContent = '';
    names.forEach(n => {
      const el = form.elements[n];
      el.removeAttribute('aria-invalid');
      document.getElementById('err-' + n).textContent = '';
    });
  };

  const params = new URLSearchParams(location.search);
  if (params.has('lahetetty')) showThanks();
  if (params.has('virhe')) generalError();

  form.elements.t.value = Date.now();
  form.noValidate = true;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    clearErrors();
    btn.disabled = true;
    btn.textContent = 'Lähetetään…';
    const body = {};
    new FormData(form).forEach((v, k) => { body[k] = v; });
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) { showThanks(); return; }
      const data = await res.json().catch(() => ({}));
      if (res.status === 400 && data.errors) {
        let first = null;
        names.forEach(n => {
          if (!data.errors[n]) return;
          const el = form.elements[n];
          el.setAttribute('aria-invalid', 'true');
          document.getElementById('err-' + n).textContent = data.errors[n];
          if (!first) first = el;
        });
        if (data.errors.general) status.textContent = data.errors.general;
        if (first) first.focus();
      } else {
        generalError();
      }
    } catch {
      generalError();
    }
    btn.disabled = false;
    btn.textContent = label;
  });
})();
