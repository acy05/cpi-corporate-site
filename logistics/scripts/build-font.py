"""Build the page-specific Noto Sans JP WOFF2; rerun after changing page text.

Usage: python build-font.py path/to/NotoSansJP-wght.ttf
Dependencies: fonttools, brotli. Output retains the upstream OFL/name records.
"""
from pathlib import Path
from html.parser import HTMLParser
import hashlib
import json
import sys
from fontTools.ttLib import TTFont
from fontTools import subset

root = Path(__file__).resolve().parents[1]

class TextContent(HTMLParser):
    def __init__(self):
        super().__init__()
        self.parts = []
    def handle_data(self, value):
        self.parts.append(value)
    def handle_starttag(self, tag, attrs):
        self.parts.extend(v for k, v in attrs if v and k in ('alt', 'title', 'aria-label', 'content'))

parser = TextContent()
parser.feed((root / 'index.html').read_text())
text = ''.join(parser.parts) + (root / 'assets/logistics.js').read_text()
required = {ord(c) for c in text if not c.isspace()} | set(range(32, 127))
font = TTFont(sys.argv[1])
missing = required - font.getBestCmap().keys()
assert not missing, f'Source font misses characters: {sorted(missing)}'
options = subset.Options()
options.name_IDs = ['*']
options.name_legacy = True
options.name_languages = ['*']
options.layout_features = ['*']
subsetter = subset.Subsetter(options=options)
subsetter.populate(unicodes=required)
subsetter.subset(font)
font.flavor = 'woff2'
output = root / 'assets/fonts/noto-sans-jp-cpi-v3.woff2'
font.save(output)
check = TTFont(output)
missing = required - check.getBestCmap().keys()
assert not missing, f'Output font misses characters: {sorted(missing)}'
print(json.dumps({'characters': len(required), 'missing': [], 'bytes': output.stat().st_size,
    'source_sha256': hashlib.sha256(Path(sys.argv[1]).read_bytes()).hexdigest(),
    'output_sha256': hashlib.sha256(output.read_bytes()).hexdigest(),
    'weight_range': [(a.minValue, a.maxValue) for a in check['fvar'].axes]}, indent=2))
