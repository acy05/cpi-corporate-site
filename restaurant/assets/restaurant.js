'use strict';
(() => {
  const body = document.body;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const isFull = body.dataset.motion === 'full';
  const nav = document.querySelector('.nav');
  const navToggle = document.querySelector('.nav-toggle');
  const pauseButton = document.querySelector('.motion-pause');
  const hero = document.querySelector('.hero-scroll');
  const heroPhoto = document.querySelector('.hero-photo');
  const heroProgress = document.querySelector('.hero-progress i');
  const seal = document.querySelector('.round-seal');
  const kitchen = document.querySelector('.kitchen');
  const kitchenImage = document.querySelector('.kitchen-image');
  let paused = false;
  let framePending = false;

  const closeNav = (restoreFocus = false) => {
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'メニューを開く');
    if (restoreFocus) navToggle.focus();
  };
  navToggle.addEventListener('click', () => {
    const open = navToggle.getAttribute('aria-expanded') !== 'true';
    nav.classList.toggle('is-open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeNav()));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('is-open')) closeNav(true); });
  document.addEventListener('click', e => { if (!e.target.closest('.header')) closeNav(); });
  window.matchMedia('(min-width: 701px)').addEventListener('change', () => closeNav());

  const revealElements = [...document.querySelectorAll('[data-reveal]')];
  const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    });
  }, { threshold: .08, rootMargin: '0px 0px -20px 0px' }) : null;
  if (observer && !reducedMotion.matches) {
    body.classList.add('motion-ready');
    revealElements.forEach(element => observer.observe(element));
  }

  const updateMotion = () => {
    framePending = false;
    if (!isFull || paused || reducedMotion.matches) return;
    const box = hero.getBoundingClientRect();
    const headerHeight = document.querySelector('.header').offsetHeight;
    const progress = Math.max(0, Math.min(1, (headerHeight - box.top) / Math.max(1, box.height - document.querySelector('.hero').offsetHeight)));
    heroPhoto.style.transform = `scale(${1 + progress * .12})`;
    seal.style.transform = `rotate(${9 - progress * 16}deg)`;
    heroProgress.style.transform = `scaleX(${progress})`;
    const kitchenBox = kitchen.getBoundingClientRect();
    if (kitchenBox.bottom > 0 && kitchenBox.top < innerHeight) {
      const distance = ((innerHeight / 2 - (kitchenBox.top + kitchenBox.height / 2)) / innerHeight) * 55;
      kitchenImage.style.transform = `translateY(${Math.max(-60, Math.min(60, distance))}px)`;
    }
  };
  const scheduleMotion = () => {
    if (!isFull || paused || reducedMotion.matches || framePending) return;
    framePending = true; requestAnimationFrame(updateMotion);
  };
  const applyMotionPreference = () => {
    const stopped = paused || reducedMotion.matches;
    body.classList.toggle('motion-paused', stopped);
    pauseButton.setAttribute('aria-pressed', String(stopped));
    pauseButton.textContent = reducedMotion.matches ? '端末設定で停止' : paused ? '再生' : '一時停止';
    pauseButton.setAttribute('aria-label', stopped ? '動きを再生する' : '動きを停止する');
    pauseButton.disabled = reducedMotion.matches;
    if (stopped) revealElements.forEach(element => element.classList.add('visible'));
    document.dispatchEvent(new CustomEvent('cpi:motion', { detail: { stopped } }));
    scheduleMotion();
  };
  pauseButton.addEventListener('click', () => { paused = !paused; applyMotionPreference(); });
  reducedMotion.addEventListener('change', applyMotionPreference);
  window.addEventListener('scroll', scheduleMotion, { passive: true });
  window.addEventListener('resize', scheduleMotion, { passive: true });
  applyMotionPreference();

  const tabs = [...document.querySelectorAll('[role=tab]')];
  const activateTab = tab => {
    tabs.forEach(candidate => {
      const active = candidate === tab;
      candidate.setAttribute('aria-selected', String(active));
      candidate.tabIndex = active ? 0 : -1;
      document.getElementById(candidate.getAttribute('aria-controls')).hidden = !active;
    });
  };
  tabs.forEach((tab,index) => {
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('keydown', e => {
      let next;
      if (e.key === 'ArrowRight') next = tabs[(index + 1) % tabs.length];
      if (e.key === 'ArrowLeft') next = tabs[(index + tabs.length - 1) % tabs.length];
      if (e.key === 'Home') next = tabs[0];
      if (e.key === 'End') next = tabs[tabs.length - 1];
      if (next) { e.preventDefault(); activateTab(next); next.focus(); }
    });
  });

  const assetRoot = new URL('.', document.querySelector('script[src*="assets/restaurant.js"]').src);
  const dishes = {
    karaage: { title: '唐揚げ定食', image: 'karaage.webp', description: 'からっとした衣と、じゅわっと広がる旨み。レモンを少ししぼって、最後のひと口まで。CPI食堂の顔になる、唐揚げ定食のご提案です。', includes: 'ごはん・味噌汁・小鉢付き（提案内容）' },
    shogayaki: { title: '生姜焼き定食', image: 'shogayaki.webp', description: '香る生姜と甘辛いたれを、豚肉と玉ねぎにからめて。ごはんと一緒に頬張りたい、定番の定食のご提案です。', includes: 'ごはん・味噌汁・小鉢付き（提案内容）' },
    side: { title: '唐揚げを、もう一皿。', image: 'karaage.webp', description: 'もう少し食べたいときや、誰かと分け合いたいときに。定食と組み合わせられる、単品の唐揚げをご提案しています。', includes: '単品メニュー（数量・価格は未確定）' }
  };
  const dialog = document.querySelector('.dish-dialog');
  let dialogTrigger = null;
  document.querySelectorAll('[data-dish]').forEach(button => button.addEventListener('click', () => {
    const dish = dishes[button.dataset.dish];
    if (!dish) return;
    dialogTrigger = button;
    document.getElementById('dialog-title').textContent = dish.title;
    document.getElementById('dialog-description').textContent = dish.description;
    document.getElementById('dialog-includes').textContent = dish.includes;
    const photo = document.getElementById('dialog-photo');
    photo.src = new URL(dish.image, assetRoot).href;
    photo.alt = `${dish.title}の提案用イメージ`;
    dialog.showModal();
    body.style.overflow = 'hidden';
    dialog.querySelector('.dialog-close').focus();
  }));
  dialog.querySelectorAll('.dialog-close,.dialog-return').forEach(button => button.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('click', e => { if (e.target === dialog) { const r=dialog.getBoundingClientRect(); if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom) dialog.close(); } });
  dialog.addEventListener('close', () => { body.style.overflow = ''; dialogTrigger?.focus({ preventScroll: true }); });
})();
