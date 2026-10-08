import { readFile, writeFile, mkdir } from 'node:fs/promises';
const root = new URL('../restaurant/', import.meta.url);
const source = await readFile(new URL('index.html', root), 'utf8');
const calm = source
  .replace('data-motion="full"', 'data-motion="calm"')
  .replace('<title>CPI食堂｜揚げたての、しあわせ。</title>', '<title>CPI食堂｜揚げたての、しあわせ。｜控えめなアニメーション</title>')
  .replaceAll('href="assets/', 'href="../assets/')
  .replaceAll('src="assets/', 'src="../assets/')
  .replace('href="../">コーポレート', 'href="../../">コーポレート')
  .replace('href="./" data-version="full" aria-current="page"', 'href="../" data-version="full"')
  .replace('href="calm/" data-version="calm"', 'href="./" data-version="calm" aria-current="page"');
await mkdir(new URL('calm/', root), { recursive: true });
await writeFile(new URL('calm/index.html', root), calm);
console.log('Generated restaurant/calm/index.html from the shared full-motion page.');
