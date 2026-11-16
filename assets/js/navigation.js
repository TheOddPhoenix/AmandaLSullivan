(() => {
  const toggle = document.getElementById('mobile-menu-toggle');
  const drawer = document.getElementById('mobile-drawer');
  if (!toggle || !drawer) return;
  toggle.setAttribute('aria-label', 'Open navigation menu');
  const background = [...document.querySelectorAll('main, footer, #contact-bar')];
  let previousOverflow = '';
  function setMenu(open, restoreFocus = false) {
    const wasOpen = toggle.getAttribute('aria-expanded') === 'true';
    if (open && !wasOpen) previousOverflow = document.body.style.overflow;
    drawer.classList.toggle('hidden', !open);
    drawer.classList.toggle('flex', open);
    drawer.setAttribute('aria-hidden', String(!open));
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    background.forEach(element => { element.inert = open; });
    document.body.style.overflow = open ? 'hidden' : previousOverflow;
    const icon = document.getElementById('menu-icon');
    icon?.setAttribute('data-lucide', open ? 'x' : 'menu');
    window.lucide?.createIcons();
    if (open) drawer.querySelector('a')?.focus();
    else if (restoreFocus) toggle.focus();
  }
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true', true));
  drawer.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  matchMedia('(min-width: 1024px)').addEventListener('change', event => {
    if (event.matches && toggle.getAttribute('aria-expanded') === 'true') setMenu(false);
  });
  document.addEventListener('keydown', event => {
    if (toggle.getAttribute('aria-expanded') !== 'true') return;
    if (event.key === 'Escape') { event.preventDefault(); setMenu(false, true); }
    if (event.key !== 'Tab') return;
    const controls = [toggle, ...drawer.querySelectorAll('a')];
    const first = controls[0], last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  document.querySelectorAll('[data-print]').forEach(button => button.addEventListener('click', () => window.print()));
})();
