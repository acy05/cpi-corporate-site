import { readFile, access } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
const root = new URL('../', import.meta.url);
const failures = [];
// Two independently authored pages: never regenerate the preserved calm version from the cinematic page.
for (const file of ['index.html','restaurant/index.html','restaurant/calm/index.html']) {
  const url = new URL(file,root);
  const source = await readFile(url,'utf8');
  for(const [,ref] of source.matchAll(/(?:src|href)="([^"]+)"/g)) {
    if(/^(#|https?:|data:|mailto:)/.test(ref)) continue;
    const target = new URL(ref,url);
    target.search='';target.hash='';
    if(target.pathname.endsWith('/')) target.pathname+='index.html';
    try { await access(target); } catch { failures.push(`${file}: ${ref}`); }
  }
}
const full = await readFile(new URL('restaurant/index.html',root),'utf8');
const calm = await readFile(new URL('restaurant/calm/index.html',root),'utf8');
if(!full.includes('data-motion="cinematic"')) failures.push('New dynamic page must use cinematic motion');
if(!calm.includes('data-motion="full"')) failures.push('Calm page must retain the original full motion');
if(calm.includes('assets/cinematic.')) failures.push('Cinematic assets must not affect the preserved calm page');
if(process.argv.includes('--verify-classic')) {
  const original = execFileSync('git',['show','462a056ac4ec9c637270edc02a43eb5d26b77c4b:restaurant/index.html'],{cwd:root,encoding:'utf8'});
  const expected = original
    .replace('<title>CPI食堂｜揚げたての、しあわせ。</title>','<title>CPI食堂｜揚げたての、しあわせ。｜控えめなアニメーション</title>')
    .replaceAll('href="assets/','href="../assets/')
    .replaceAll('src="assets/','src="../assets/')
    .replace('src="../assets/restaurant.js"','src="../assets/restaurant.js?v=2"')
    .replace('href="../">コーポレート','href="../../">コーポレート')
    .replace('href="./" data-version="full" aria-current="page"','href="../" data-version="full"')
    .replace('href="calm/" data-version="calm"','href="./" data-version="calm" aria-current="page"');
  if(calm!==expected) failures.push('Preserved calm HTML differs from the original full version beyond URL/title adjustments');
  const originalCss=execFileSync('git',['show','462a056ac4ec9c637270edc02a43eb5d26b77c4b:restaurant/assets/restaurant.css'],{cwd:root,encoding:'utf8'});
  if(await readFile(new URL('restaurant/assets/restaurant.css',root),'utf8')!==originalCss) failures.push('Original shared design CSS changed');
}
console.log(JSON.stringify({checkedPages:3,classicCompared:process.argv.includes('--verify-classic'),failures},null,2));
if(failures.length) process.exitCode=1;
