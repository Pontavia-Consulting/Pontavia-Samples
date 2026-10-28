/* Fern & Field: menu and demo forms (every package level) */
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    // Mobile menu
    const btn = document.querySelector('.menu-btn');
    const nav = document.getElementById('nav');
    if (btn && nav) {
      btn.addEventListener('click', function () {
        const open = nav.classList.toggle('open');
        btn.setAttribute('aria-expanded', open);
      });
    }

    // Demo forms: validate in the browser, then show a thank-you message. Nothing is sent.
    document.querySelectorAll('form.demo-form').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        let first = null;
        form.querySelectorAll('.err').forEach(function (n) { n.remove(); });
        form.querySelectorAll('[required]').forEach(function (f) {
          let msg = '';
          if (!f.value.trim()) msg = 'Please fill this in.';
          else if (f.type === 'email' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.value)) msg = 'Enter an email like name@example.com.';
          f.setAttribute('aria-invalid', msg ? 'true' : 'false');
          if (msg) {
            const p = document.createElement('p');
            p.className = 'err'; p.id = f.id + '-err'; p.textContent = msg; p.style.margin = '0';
            f.setAttribute('aria-describedby', p.id);
            f.insertAdjacentElement('afterend', p);
            if (!first) first = f;
          }
        });
        if (first) { first.focus(); return; }
        const name = (form.querySelector('[name=name]') || {}).value || 'there';
        const text = (form.dataset.success || 'Thanks, {name}. We got it.').replace('{name}', name.split(' ')[0]);
        const box = document.createElement('div');
        box.className = 'success'; box.setAttribute('role', 'status'); box.tabIndex = -1;
        box.innerHTML = '<h3>Message received</h3><p></p><p class="small muted">This is a demo site, so nothing was actually sent.</p>';
        box.querySelector('p').textContent = text;
        form.replaceWith(box);
        box.focus();
      });
    });
  });
})();
