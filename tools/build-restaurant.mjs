import { readFile, access } from 'node:fs/promises';
const root=new URL('../',import.meta.url),failures=[];
const pages=['index.html','restaurant/index.html','restaurant/calm/index.html','logistics/index.html'];
for(const file of pages){const url=new URL(file,root),source=await readFile(url,'utf8');for(const [,ref] of source.matchAll(/(?:src|href)="([^"]+)"/g)){if(/^(#|https?:|data:|mailto:)/.test(ref))continue;const target=new URL(ref,url);target.search='';target.hash='';if(target.pathname.endsWith('/'))target.pathname+='index.html';try{await access(target);}catch{failures.push(file+': '+ref);}}}
const full=await readFile(new URL('restaurant/index.html',root),'utf8'),calm=await readFile(new URL('restaurant/calm/index.html',root),'utf8');
if(!full.includes('data-motion="cinematic"'))failures.push('Dynamic mode missing');
if(!calm.includes('data-motion="full"')||calm.includes('assets/cinematic.'))failures.push('Calm motion baseline changed');
for(const [name,source] of [['dynamic',full],['calm',calm]]){if(/定食|味噌汁|CPI食堂|SHOKUDO|TEISHOKU/.test(source))failures.push(name+': stale diner content');if((!source.includes('karaage-bento-cutout.webp') || !source.includes('shogayaki-bento-natural.webp'))||!source.includes('出店・開業は未確定'))failures.push(name+': bento/bar content missing');}
console.log(JSON.stringify({checkedPages:pages.length,failures},null,2));if(failures.length)process.exitCode=1;
