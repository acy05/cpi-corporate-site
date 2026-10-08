'use strict';
(() => {
  const nav=document.querySelector('#nav'),toggle=document.querySelector('.menu-toggle'),pause=document.querySelector('.motion-toggle'),header=document.querySelector('.header');
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  document.documentElement.classList.add('js');
  let stopped=false,pending=false;
  function closeMenu(focus=false){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','メニューを開く');if(focus)toggle.focus();}
  toggle.addEventListener('click',()=>{const open=!nav.classList.contains('open');nav.classList.toggle('open',open);toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'メニューを閉じる':'メニューを開く');});
  nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>closeMenu()));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open'))closeMenu(true);});
  document.addEventListener('click',e=>{if(!e.target.closest('.header'))closeMenu();});
  matchMedia('(min-width:1001px)').addEventListener('change',()=>closeMenu());
  function updateHeader(){document.documentElement.style.setProperty('--header-height',header.offsetHeight+'px');}
  if('ResizeObserver' in window)new ResizeObserver(updateHeader).observe(header);
  addEventListener('resize',updateHeader);updateHeader();
  function preference(){const off=stopped||media.matches;document.documentElement.classList.toggle('paused',off);pause.setAttribute('aria-pressed',String(off));pause.textContent=media.matches?'端末設定で動きを停止中':stopped?'動きを再生':'動きを停止';pause.disabled=media.matches;pause.setAttribute('aria-label',media.matches?'端末設定によりアニメーションを停止中':stopped?'アニメーションを再生する':'アニメーションを停止する');}
  pause.addEventListener('click',()=>{stopped=!stopped;preference();});media.addEventListener('change',preference);preference();
  const hero=document.querySelector('.hero'),photo=document.querySelector('.hero-photo');
  addEventListener('scroll',()=>{if(pending||stopped||media.matches)return;pending=true;requestAnimationFrame(()=>{pending=false;const y=hero.getBoundingClientRect().top;if(y>-hero.offsetHeight&&y<innerHeight)photo.style.transform=`scale(1.04) translateY(${Math.min(25,Math.max(0,-y*.06))}px)`;});},{passive:true});
  const proposalLink=document.querySelector('.proposal>a');
  proposalLink.addEventListener('click',()=>{document.querySelector('#proposal-details').open=true;});
})();
