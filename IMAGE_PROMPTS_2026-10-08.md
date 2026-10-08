# 物流・お弁当改訂の画像生成

組み込み imagegen 使用。外部API / CLIフォールバック不使用。元PNGは生成フォルダに保持し、sharpでWebPへ形式変換。生成画像は実施設・実商品ではなく、提案イメージと明示。

## お弁当

保存先: `restaurant/assets/bento.webp` (1536×1024、RGBA)

Prompt: Use case: product-mockup. Create a premium photorealistic Japanese karaage takeaway bento hero product photograph, isolated on genuine transparent background. One elegant unbranded rectangular natural kraft takeaway box, lid absent, generous golden crispy chicken karaage on one half with thin cabbage and lemon wedge; fluffy white rice with black sesame and a small red umeboshi on the other, tiny portions of tamagoyaki and pickled vegetables neatly separated. View from elevated 45 degree angle so rice, food and box are clearly visible, full box contained with comfortable transparent margins, wide 3:2 image, appetizing natural side light, realistic food detail. No plate, no bowls, no miso soup, no chopsticks, no text, no logo, no watermark. This is an illustrative website proposal, not real shop photography.

## 物流

保存先: `logistics/assets/logistics-hero.webp` (1536×1024、RGB)

Prompt: Use case: photorealistic-natural. Asset: Japanese logistics company website editorial hero image, wide landscape 3:2. A single unbranded modern white medium-size delivery box truck at a clean Japanese distribution warehouse loading area, right-hand drive vehicle with credible geometry. Camera low three-quarter front side angle, truck occupies right two thirds, architectural lines lead from left towards vehicle. Early morning cool navy shadow with natural sunrise highlights, quiet professional understated photograph, muted concrete and deep blue palette, realistic details, no illustration. No people, no numbers or readable registration plates, no brand logos, no text overlay, no invented company signage. Visually compelling corporate art direction, clear negative space left for page heading.
