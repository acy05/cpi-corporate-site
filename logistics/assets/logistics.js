'use strict';
(() => {
  const root = document.documentElement;
  const nav = document.querySelector('#nav');
  const toggle = document.querySelector('.menu-toggle');
  const pause = document.querySelector('.motion-toggle');
  const header = document.querySelector('.header');
  const hero = document.querySelector('.hero');
  const photo = document.querySelector('.hero-photo');
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  root.classList.add('js');

  let stopped = false;
  let pending = false;
  const seen = new WeakSet();
  const animations = new Map();
  const revealGroups = [
    '.company-intro, .company-data',
    '.business .section-heading, .business-grid article',
    '.approach-layout > div:first-child, .principles article',
    '.flow h2, .steps li',
    '.contact > div'
  ];
  const revealTargets = revealGroups.flatMap(selector => [...document.querySelectorAll(selector)]);
  const delays = new WeakMap();
  revealGroups.forEach(selector => {
    document.querySelectorAll(selector).forEach((element, index) => {
      delays.set(element, Math.min(index, 3) * 70);
      element.dataset.motionReveal = '';
    });
  });
  const heroCopy = document.querySelector('.hero-copy');
  const motionOff = () => stopped || media.matches;
  const canAnimate = typeof heroCopy.animate === 'function';
  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      reveal(entry.target);
    });
  }, { threshold: .08, rootMargin: '0px 0px -16px 0px' }) : null;

  // Content remains visible by default: only animate once it enters the viewport.
  function reveal(element, heroEntrance = false) {
    if (seen.has(element)) return;
    seen.add(element);
    if (motionOff() || !canAnimate || element.contains(document.activeElement)) return;
    const animation = element.animate([
      { opacity: 0, transform: 'translateY(' + (heroEntrance ? 20 : 24) + 'px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], {
      duration: heroEntrance ? 1100 : 850,
      delay: heroEntrance ? 0 : (delays.get(element) || 0),
      easing: 'cubic-bezier(.22,.7,.2,1)',
      fill: 'backwards'
    });
    animations.set(element, animation);
    animation.finished.catch(() => {}).finally(() => {
      if (animations.get(element) === animation) animations.delete(element);
    });
  }

  function showImmediately(element) {
    [heroCopy, ...revealTargets].forEach(target => {
      if (element !== target && !element.contains(target) && !target.contains(element)) return;
      seen.add(target);
      observer?.unobserve(target);
      animations.get(target)?.cancel();
      animations.delete(target);
    });
  }

  function closeMenu(focus = false) {
    nav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'メニューを開く');
    if (focus) toggle.focus();
  }
  toggle.addEventListener('click', () => {
    const open = !nav.classList.contains('open');
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => closeMenu()));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('open')) closeMenu(true);
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.header')) closeMenu();
    const link = event.target.closest('a[href^="#"]');
    const target = link && document.getElementById(link.hash.slice(1));
    if (target) showImmediately(target);
  });
  document.addEventListener('focusin', event => showImmediately(event.target));
  addEventListener('hashchange', () => {
    const target = document.getElementById(location.hash.slice(1));
    if (target) showImmediately(target);
  });
  matchMedia('(min-width:1001px)').addEventListener('change', () => closeMenu());

  function updateHeader() {
    root.style.setProperty('--header-height', header.offsetHeight + 'px');
  }
  if ('ResizeObserver' in window) new ResizeObserver(updateHeader).observe(header);
  addEventListener('resize', () => { updateHeader(); schedulePhoto(); });
  updateHeader();

  function updatePhoto() {
    pending = false;
    if (motionOff()) return;
    const box = hero.getBoundingClientRect();
    if (box.bottom <= 0 || box.top >= innerHeight) return;
    const progress = Math.max(0, Math.min(1, (header.offsetHeight - box.top) / box.height));
    photo.style.transform = 'scale(' + (1.04 + progress * .08) + ')';
  }
  function schedulePhoto() {
    if (pending || motionOff()) return;
    pending = true;
    requestAnimationFrame(updatePhoto);
  }
  function preference() {
    const off = motionOff();
    root.classList.toggle('paused', off);
    root.classList.toggle('motion-on', !off);
    pause.setAttribute('aria-pressed', String(off));
    pause.textContent = media.matches ? '端末設定で動きを停止中' : stopped ? '動きを再生' : '動きを停止';
    pause.disabled = media.matches;
    pause.setAttribute('aria-label', media.matches ? '端末設定によりアニメーションを停止中' : stopped ? 'アニメーションを再生する' : 'アニメーションを停止する');
    if (off) {
      observer?.disconnect();
      [heroCopy, ...revealTargets].forEach(element => seen.add(element));
      animations.forEach(animation => animation.cancel());
      animations.clear();
      photo.style.removeProperty('transform');
    } else {
      schedulePhoto();
    }
  }
  pause.addEventListener('click', () => { stopped = !stopped; preference(); });
  media.addEventListener('change', preference);
  addEventListener('scroll', schedulePhoto, { passive: true });
  preference();

  if (!motionOff()) {
    const fragment = document.getElementById(location.hash.slice(1));
    if (fragment) showImmediately(fragment);
    if (hero.getBoundingClientRect().bottom > 0) reveal(heroCopy, true);
    revealTargets.forEach(element => {
      if (observer) observer.observe(element);
      else seen.add(element);
    });
  }

  document.querySelector('.proposal>a').addEventListener('click', () => {
    document.querySelector('#proposal-details').open = true;
  });
})();
