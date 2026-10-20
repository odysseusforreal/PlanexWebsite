(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const header = document.querySelector('.site-header');

  /* ---------- Header height -> CSS var (announcement bar can wrap) ---------- */
  const setHeaderHeight = () => {
    document.documentElement.style.setProperty('--header-h', header.offsetHeight + 'px');
  };
  setHeaderHeight();
  window.addEventListener('resize', setHeaderHeight, { passive: true });

  /* ---------- Mobile navigation ---------- */
  const toggle = document.querySelector('.nav__toggle');
  const menu = document.getElementById('nav-menu');
  // Everything outside the open menu goes inert, so focus can't wander behind it
  const outside = [document.querySelector('.announce'), document.querySelector('.nav__brand'),
    document.getElementById('main'), document.querySelector('.footer'), document.querySelector('.dock')].filter(Boolean);

  const setMenu = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    outside.forEach((el) => { el.inert = open; });
  };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    const wasOpen = menu.classList.contains('is-open');
    setMenu(false);
    // The open menu locks body scroll; jump to the section only once it's unlocked
    const hash = link.getAttribute('href');
    if (wasOpen && hash.startsWith('#')) {
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth' });
        history.pushState(null, '', hash);
      });
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) { setMenu(false); toggle.focus(); }
  });
  window.matchMedia('(min-width: 961px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

  /* ---------- Scroll: header state + parallax ---------- */
  const hero = document.querySelector('.hero');
  const heroMedia = document.querySelector('.hero__media');
  const vision = document.querySelector('.vision');
  const visionMedia = document.querySelector('.vision__media');
  let ticking = false;

  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 24);

    if (!reduceMotion.matches) {
      if (y < hero.offsetHeight) heroMedia.style.setProperty('--parallax', (y * 0.3).toFixed(1) + 'px');
      const r = vision.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) {
        const p = (r.top + r.height / 2 - window.innerHeight / 2) * -0.08;
        visionMedia.style.setProperty('--parallax', p.toFixed(1) + 'px');
      }
    }
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  if (!('IntersectionObserver' in window)) return setupLightbox();

  /* ---------- Active nav link ---------- */
  // Watch every section, so the highlight clears in sections the nav doesn't list
  const navLinks = [...document.querySelectorAll('.nav__links a')];
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((a) => {
        if (a.getAttribute('href') === '#' + entry.target.id) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main > section').forEach((s) => navObserver.observe(s));

  /* ---------- Mobile dock: Discord in thumb reach between hero and final CTA ---------- */
  const dock = document.querySelector('.dock');
  const finalCta = document.querySelector('.final');
  if (dock && finalCta) {
    const seen = { hero: true, final: false };
    const updateDock = () => {
      const show = !seen.hero && !seen.final;
      dock.classList.toggle('is-shown', show);
      dock.setAttribute('aria-hidden', String(!show));
      dock.tabIndex = show ? 0 : -1;
    };
    const dockObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        seen[entry.target === hero ? 'hero' : 'final'] = entry.isIntersecting;
      });
      updateDock();
    });
    dockObserver.observe(hero);
    dockObserver.observe(finalCta);
  }

  setupLightbox();

  /* ---------- Gallery lightbox ---------- */
  function setupLightbox() {
    const dialog = document.querySelector('.lightbox');
    const links = [...document.querySelectorAll('[data-gallery] a')];
    if (!dialog || typeof dialog.showModal !== 'function' || !links.length) return;

    // Created here rather than in the markup, so there is never an empty <img> in the page
    const img = document.createElement('img');
    img.className = 'lightbox__img';
    dialog.querySelector('.lightbox__frame').prepend(img);
    const tag = dialog.querySelector('.lightbox__tag');
    const caption = dialog.querySelector('.lightbox__caption');
    let index = 0;
    let opener = null;

    img.addEventListener('load', () => img.classList.remove('is-loading'));

    const show = (i) => {
      index = (i + links.length) % links.length;
      const a = links[index];
      img.classList.add('is-loading');
      img.src = a.getAttribute('href');
      img.alt = a.querySelector('img').alt;
      tag.hidden = !a.hasAttribute('data-prototype');
      caption.textContent = `${a.dataset.caption}  ·  ${index + 1} / ${links.length}`;
    };

    links.forEach((a, i) => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        opener = a;
        show(i);
        dialog.showModal();
      });
    });

    dialog.querySelector('.lightbox__close').addEventListener('click', () => dialog.close());
    dialog.querySelector('.lightbox__prev').addEventListener('click', () => show(index - 1));
    dialog.querySelector('.lightbox__next').addEventListener('click', () => show(index + 1));
    dialog.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') show(index - 1);
      if (e.key === 'ArrowRight') show(index + 1);
    });
    // Click on the backdrop (outside the image) closes
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog || e.target.classList.contains('lightbox__figure')) dialog.close();
    });
    // Swipe on touch
    let sx = null;
    dialog.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; }, { passive: true });
    dialog.addEventListener('touchend', (e) => {
      if (sx === null) return;
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
      sx = null;
    });
    dialog.addEventListener('close', () => { if (opener) opener.focus(); });
  }
})();
