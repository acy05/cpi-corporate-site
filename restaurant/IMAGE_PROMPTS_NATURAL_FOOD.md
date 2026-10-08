# 自然な料理写真への更新

組み込み imagegen を使用。CLI/APIフォールバック不使用。写真は生成イメージであり実店舗の料理写真ではありません。元画像を保持し、WebP変換のみsharpで実施。旧画像は削除しません。

## 保存ファイル

- `assets/karaage-bento-natural.webp`: 唐揚げ弁当の自然光・テーブル写真。メニュー、カード、詳細、ストーリー、接写演出、料理背景に使用。
- `assets/shogayaki-bento-natural.webp`: 生姜焼きとごはん・付け合わせを詰めたお弁当。メニュー、カード、詳細に使用。
- `assets/karaage-bento-cutout.webp`: 唐揚げ弁当写真から背景のみ除去。動的・控えめ両方のヒーローに使用。

## プロンプト全文

### karaageNatural

Use case: photorealistic-natural. Asset: believable Japanese neighborhood bento-shop menu photograph, landscape 1536x1024. A single modest lunch-size shallow unbranded kraft-paper takeaway tray, no lid, sitting on a lightly worn light oak table near a window. Camera about 50 degrees above the table, 50mm lens, full box visible with 12% margins on every side, box mostly horizontal. Ordinary human-prepared lunch, photographed honestly by a skilled local food photographer, not a luxury product render. Soft overcast daylight from upper left, gentle real contact shadow, neutral white balance, restrained natural colors, slightly imperfect casual placement. Cooked rice has irregular softly clumped grains, not uniform pearls; side dishes in simple paper divider cups. Keep food inviting and clean but unretouched-looking. Fine film-like grain, normal optical softness, moderate depth of field so the whole lunch reads clearly. No typography, no logos, no watermark, no humans, no theatrical steam, no shallow f/1.2 blur, no HDR halos, no shiny plastic food, no CGI, no exaggerated portions, no symmetrical arrangement, no decorative props. Meal: karaage bento. Four or five uneven hand-cut pieces of Japanese fried chicken thigh, not breaded nuggets, with patchy thin potato-starch crust: dark amber ridges, some paler wrinkles, slightly exposed browned chicken skin, irregular compact sizes. Rice in one compartment, chicken and a little shredded cabbage in the other; a small lemon wedge, two imperfect slices of rolled omelet, a few pickles. Chicken portions vary clearly in shape and orientation. Realistic modest serving, do not mound it above the box.

### porkNatural

Use case: photorealistic-natural. Asset: believable Japanese neighborhood bento-shop menu photograph, landscape 1536x1024. A single modest lunch-size shallow unbranded kraft-paper takeaway tray, no lid, sitting on a lightly worn light oak table near a window. Camera about 50 degrees above the table, 50mm lens, full box visible with 12% margins on every side, box mostly horizontal. Ordinary human-prepared lunch, photographed honestly by a skilled local food photographer, not a luxury product render. Soft overcast daylight from upper left, gentle real contact shadow, neutral white balance, restrained natural colors, slightly imperfect casual placement. Cooked rice has irregular softly clumped grains, not uniform pearls; side dishes in simple paper divider cups. Keep food inviting and clean but unretouched-looking. Fine film-like grain, normal optical softness, moderate depth of field so the whole lunch reads clearly. No typography, no logos, no watermark, no humans, no theatrical steam, no shallow f/1.2 blur, no HDR halos, no shiny plastic food, no CGI, no exaggerated portions, no symmetrical arrangement, no decorative props. Meal: shogayaki bento. Thin irregular slices of cooked Japanese pork shoulder with translucent softened onion, lightly glazed with ginger-soy sauce, browned edges and subtle fat ribbons, loosely folded naturally and packed into the main compartment; white rice in the other compartment, a little cabbage underneath pork, two modest slices of rolled omelet and a few pickles. This must clearly be a complete TAKEAWAY BENTO BOX WITH RICE, not meat on a plate. Sauce is a thin realistic sheen rather than glossy syrup. The rice and side dishes remain distinct from pork.

### 背景除去

undefined
