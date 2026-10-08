'use strict';
(() => {
  if (document.body.dataset.motion !== 'cinematic') return;
  const body = document.body;
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  const $ = selector => document.querySelector(selector);
  const hero = $('.cinema-scroll');
  const stage = $('.cinema-stage');
  const plate = $('.plate-scene');
  const left = $('.intro-left');
  const right = $('.intro-right');
  const macro = $('.cinema-macro');
  const macroPhoto = $('.cinema-macro img');
  const crunch = $('.cinema-crunch');
  const finish = $('.cinema-finish');
  const opening = $('.cinema-opening');
  const wordmark = $('.cinema-wordmark');
  const tag = $('.cinema-tag');
  const orbit = $('.plate-orbit');
  const meter = $('.cinema-meter i');
  const sceneButtons = [...document.querySelectorAll('[data-scene]')];
  const story = $('.story');
  const storyPhoto = $('.story-image');
  const taste = $('.taste-scroll');
  const tasteStage = $('.taste-stage');
  const rail = $('.taste-rail');
  const cards = [...document.querySelectorAll('.taste-card')];
  const tasteHeading = $('.taste-heading');
  const tasteMeter = $('.taste-meter i');
  const kitchen = $('.kitchen');
  const kitchenImage = $('.kitchen-image');
  const kitchenTitle = $('.kitchen h2');
  const footer = $('.footer');
  const footerMark = $('.footer-wordmark');
  let scheduled = false;
  let headerHeight = $('.header').offsetHeight;
  let viewportHeight = innerHeight;
  let small = innerWidth <= 700;
  let lastScene = -1;
  let active = true;
  const clamp = value => Math.max(0, Math.min(1, value));
  const range = (value, start, end) => clamp((value - start) / (end - start));
  const ease = value => value * value * (3 - 2 * value);
  const between = (value, from, to) => from + (to - from) * value;
  const stopped = () => media.matches || body.classList.contains('motion-paused');
  const progress = (section, pin) => clamp((headerHeight - section.getBoundingClientRect().top) / Math.max(1, section.offsetHeight - pin.offsetHeight));
  const visible = rect => rect.top < viewportHeight && rect.bottom > headerHeight;

  const renderHero = p => {
    const enterMacro = ease(range(p,.25,.45));
    const leaveMacro = ease(range(p,.64,.82));
    const finishProgress = ease(range(p,.73,.93));
    const openingOut = ease(range(p,.04,.23));
    const mainZoom = ease(range(p,0,.4));
    const returnPlate = ease(range(p,.74,.95));
    const plateOpacity = p < .6 ? 1 - ease(range(p,.37,.49)) : returnPlate;
    const plateScale = p < .6 ? between(mainZoom,1,1.85) : between(returnPlate,1.45,.76);
    const plateRotation = p < .6 ? between(mainZoom,-8,18) : between(returnPlate,25,-5);
    const plateY = p < .6 ? between(mainZoom,0,4) : between(returnPlate,14,small ? 3 : 9);
    stage.style.backgroundColor = `rgb(${Math.round(between(leaveMacro,238,156))}, ${Math.round(between(leaveMacro,227,48))}, ${Math.round(between(leaveMacro,205,33))})`;
    stage.style.setProperty('--cinema-ink', enterMacro > .5 ? '#f5efdf' : '#902e22');
    plate.style.transform = `translate(-50%, -50%) translateY(${plateY}vh) rotate(${plateRotation}deg) rotateY(${between(mainZoom,0,-12)}deg) scale(${plateScale})`;
    plate.style.opacity = plateOpacity;
    plate.style.zIndex = p > .67 ? '6' : '3';
    left.style.transform = `translateX(${-openingOut * 120}%) rotate(${-openingOut * 12}deg)`;
    right.style.transform = `translateX(${openingOut * 120}%) rotate(${openingOut * 12}deg)`;
    left.style.opacity = right.style.opacity = 1 - openingOut;
    opening.style.opacity = 1 - openingOut;
    opening.style.visibility = openingOut > .95 ? 'hidden' : 'visible';
    opening.style.pointerEvents = openingOut > .6 ? 'none' : 'auto';
    tag.style.opacity = orbit.style.opacity = 1 - openingOut;
    tag.style.transform = `rotate(${10+openingOut*60}deg) scale(${1-openingOut*.4})`;
    wordmark.style.transform = `translateX(-50%) translateY(${-mainZoom * 90}px) scale(${1 + mainZoom * .25})`;
    wordmark.style.opacity = 1 - ease(range(p,.2,.37));
    macro.style.opacity = enterMacro * (1-leaveMacro);
    macro.style.clipPath = `circle(${enterMacro * 100}% at 52% 53%)`;
    macroPhoto.style.transform = `scale(${between(range(p,.28,.8),1.3,1)})`;
    const crunchIn = ease(range(p,.4,.53));
    const crunchOut = ease(range(p,.6,.76));
    crunch.style.opacity = crunchIn * (1-crunchOut);
    crunch.style.transform = `translateY(${(1-crunchIn)*80-crunchOut*90}px) scale(${1+crunchOut*.22})`;
    finish.style.opacity = finishProgress;
    finish.style.transform = `translateY(${(1-finishProgress)*70}px)`;
    meter.style.transform = `scaleX(${p})`;
    const chapter = p < .38 ? 0 : p < .76 ? 1 : 2;
    if (chapter !== lastScene) {
      sceneButtons.forEach((button,i) => { if(i===chapter) button.setAttribute('aria-current','step'); else button.removeAttribute('aria-current'); });
      lastScene = chapter;
    }
    stage.dataset.scene = String(chapter + 1);
  };

  const render = () => {
    scheduled = false;
    if (stopped() || !active) return;
    const heroBox = hero.getBoundingClientRect();
    if (visible(heroBox)) renderHero(progress(hero, stage));
    const storyBox = story.getBoundingClientRect();
    if (visible(storyBox)) {
      const p = range(viewportHeight - storyBox.top,0,viewportHeight + storyBox.height * .4);
      story.style.setProperty('--read-progress',`${p*100}%`);
      storyPhoto.style.transform = `translateY(${between(p,48,-32)}px) rotate(${between(p,6,-3)}deg)`;
    }
    const tasteBox = taste.getBoundingClientRect();
    if (visible(tasteBox)) {
      const p = progress(taste,tasteStage);
      const first = cards[0].offsetLeft;
      const last = cards.at(-1);
      const total = last.offsetLeft + last.offsetWidth - first;
      const travel = Math.max(0,total - cards[0].offsetWidth);
      const x = travel*p;
      rail.style.transform = `translateX(${-x}px)`;
      cards.forEach((card,i) => {
        const center = (card.offsetLeft-first+card.offsetWidth/2-x)/Math.max(1,cards[0].offsetWidth);
        const d = Math.max(-1,Math.min(1,center-.5));
        card.style.transform = `perspective(1100px) rotateY(${d*-10}deg) rotate(${d*4}deg) scale(${1-Math.abs(d)*.055})`;
      });
      tasteHeading.style.opacity = small ? 1 : 1-ease(range(p,.05,.24));
      tasteHeading.style.transform = small ? 'none' : `translateX(${-ease(range(p,0,.3))*80}px)`;
      tasteMeter.style.transform = `scaleX(${p})`;
    }
    const kitchenBox = kitchen.getBoundingClientRect();
    if (visible(kitchenBox)) {
      const p = range(viewportHeight-kitchenBox.top,0,viewportHeight+kitchenBox.height);
      kitchenImage.style.transform = `translateY(${between(p,-80,80)}px) scale(${between(p,1.25,1)})`;
      kitchenTitle.style.transform = `translateX(${between(p,55,-20)}px) scale(${between(p,.88,1.08)})`;
    }
    const footerBox=footer.getBoundingClientRect();
    if(visible(footerBox)) footerMark.style.transform=`translateX(${between(clamp((viewportHeight-footerBox.top)/viewportHeight),10,0)}%)`;
  };
  const schedule = () => { if (!scheduled && !stopped() && active) { scheduled=true;requestAnimationFrame(render); } };
  const resize = () => { headerHeight=$('.header').offsetHeight; viewportHeight=innerHeight; small=innerWidth<=700; schedule(); };
  const preference = () => {
    body.classList.toggle('cinematic-ready', !media.matches);
    if (!media.matches) schedule();
  };
  sceneButtons.forEach((button,index) => button.addEventListener('click', () => {
    const p = [0,.55,.97][index];
    const target=hero.getBoundingClientRect().top+scrollY-headerHeight+p*(hero.offsetHeight-stage.offsetHeight);
    window.scrollTo({top:Math.max(0,target),behavior:stopped()?'instant':'smooth'});
    if(stopped()&&!media.matches) renderHero(p);
  }));
  // Off-screen transformed cards stay reachable with keyboard navigation.
  cards.forEach((card,index)=>card.addEventListener('focus',()=>{
    if(stopped()||!body.classList.contains('cinematic-ready')) return;
    const target=taste.getBoundingClientRect().top+scrollY-headerHeight+(index/(cards.length-1))*(taste.offsetHeight-tasteStage.offsetHeight);
    window.scrollTo({top:target,behavior:'instant'});
    schedule();
  }));
  window.addEventListener('scroll', schedule, {passive:true});
  window.addEventListener('resize', resize, {passive:true});
  window.addEventListener('pageshow',resize);
  document.addEventListener('cpi:motion',preference);
  media.addEventListener('change',preference);
  document.addEventListener('visibilitychange',()=>{active=!document.hidden;if(active)schedule();});
  preference();
  renderHero(0);
})();
