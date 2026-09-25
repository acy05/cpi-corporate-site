(() => {
  const header = document.querySelector('[data-header]');
  const menuButton = document.querySelector('[data-menu-button]');
  const nav = document.querySelector('[data-nav]');

  const closeMenu = () => {
    if (!menuButton || !nav) return;
    menuButton.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
  };

  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!open));
    nav?.classList.toggle('is-open', !open);
  });
  nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => { if (window.innerWidth > 980) closeMenu(); });

  const updateScroll = () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 12);
    const progress = document.querySelector('[data-scroll-progress]');
    if (progress) {
      const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      progress.style.height = `${Math.min(100, (scrollY / max) * 100)}%`;
    }
  };
  updateScroll();
  addEventListener('scroll', updateScroll, { passive: true });

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const motionPage = document.documentElement.dataset.variant === 'motion';
  if (motionPage && !reduced && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('is-visible'); });
    }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('[data-reveal],[data-stagger]').forEach((node) => observer.observe(node));

    const heroMedia = document.querySelector('[data-parallax]');
    const soft = document.querySelector('[data-parallax-soft]');
    const parallax = () => {
      const y = Math.min(80, scrollY * 0.08);
      if (heroMedia) heroMedia.style.transform = `translate3d(0,${y}px,0) scale(1.035)`;
      if (soft) {
        const rect = soft.getBoundingClientRect();
        const offset = Math.max(-18, Math.min(18, (innerHeight * .5 - rect.top) * .035));
        soft.querySelector('img').style.transform = `translate3d(0,${offset}px,0) scale(1.06)`;
      }
    };
    parallax();
    addEventListener('scroll', parallax, { passive: true });
  } else {
    document.querySelectorAll('[data-reveal],[data-stagger]').forEach((node) => node.classList.add('is-visible'));
  }

  document.querySelectorAll('[data-contact-form]').forEach((form) => {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const status = form.querySelector('[data-form-status]');
      if (!form.checkValidity()) {
        status.textContent = '必須項目をご確認ください。';
        status.className = 'form-status is-error';
        form.reportValidity();
        return;
      }
      status.textContent = '入力内容を確認しました。現在は制作確認用のため、送信は行われません。';
      status.className = 'form-status is-success';
    });
  });
})();
