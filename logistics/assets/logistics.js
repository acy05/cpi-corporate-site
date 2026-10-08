'use strict';
(() => {
  const nav=document.querySelector('#nav'),toggle=document.querySelector('.menu-toggle'),pause=document.querySelector('.motion-toggle');
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  let stopped=false,pending=false;
  function closeMenu(focus=false){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','メニューを開く');if(focus)toggle.focus();}
  toggle.addEventListener('click',()=>{const open=!nav.classList.contains('open');nav.classList.toggle('open',open);toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'メニューを閉じる':'メニューを開く');});
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>closeMenu()));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open'))closeMenu(true);});
  document.addEventListener('click',e=>{if(!e.target.closest('.header'))closeMenu();});
  matchMedia('(min-width:701px)').addEventListener('change',()=>closeMenu());
  const reveals=[...document.querySelectorAll('[data-reveal]')];
  if('IntersectionObserver' in window&&!media.matches){document.body.classList.add('reveal-ready');const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target);}}),{threshold:.08});reveals.forEach(el=>observer.observe(el));}
  function preference(){const off=stopped||media.matches;document.body.classList.toggle('paused',off);pause.setAttribute('aria-pressed',String(off));pause.textContent=media.matches?'端末設定で停止':stopped?'動きを再生':'動きを停止';pause.disabled=media.matches;if(off)reveals.forEach(el=>el.classList.add('visible'));}
  pause.addEventListener('click',()=>{stopped=!stopped;preference();});media.addEventListener('change',preference);preference();
  const hero=document.querySelector('.hero'),photo=document.querySelector('.hero-photo');
  addEventListener('scroll',()=>{if(pending||stopped||media.matches)return;pending=true;requestAnimationFrame(()=>{pending=false;const y=hero.getBoundingClientRect().top;if(y>-hero.offsetHeight&&y<innerHeight)photo.style.transform=`scale(1.04) translateY(${Math.min(45,Math.max(0,-y*.09))}px)`;});},{passive:true});
})();
