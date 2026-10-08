# Noto Sans JP — CPI logistics subset

Source: https://github.com/google/fonts/tree/main/ofl/notosansjp

Upstream file: `NotoSansJP[wght].ttf`, retrieved 2026-10-08.

Source SHA-256: `c2f3b4d463500a2ddcd3849cded1fceeb9fd6d1c32e6cbecd568453ba50fc68f`

Local subset: `noto-sans-jp-cpi-v3.woff2`, 166,412 bytes. The upstream variable weight range (100–900) is preserved; this site uses 400 / 500 / 700. Family name and copyright/name records are retained. CSS aliases this file as `Noto Sans JP CPI` and does not load the older Latin-only CPI Sans fonts.

License: SIL Open Font License 1.1; original copyright and license are included in OFL.txt.

The subset includes all text and relevant accessible labels/meta content in logistics/index.html, JS toggle labels, and printable ASCII (378 code points). Build asserts source/output coverage with no missing code points.

Rebuild with Python, fonttools and brotli installed:

```sh
python logistics/scripts/build-font.py /path/to/NotoSansJP-wght.ttf
```

Rerun after every copy change. When publishing a changed font, change its versioned filename and update both CSS src and HTML preload. Other site variants are intentionally unaffected.
