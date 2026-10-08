# 株式会社CPI コーポレートサイト 2案

## 飲食店サイト（2026-10-08追加）

- `restaurant/`: 唐揚げなどの定食屋を想定した動的版
- `restaurant/calm/`: 同一内容のアニメーション控えめ版
- `restaurant/README.md`: 仕様・参考・検証・未確定情報
- 更新後は `node tools/build-restaurant.mjs` で控えめ版を共通HTMLから生成

既存のコーポレートサイトは以下のURLに保持しています。

- `static/`: アニメーションなし
- `motion/`: アニメーションあり
- `index.html`: 2案の選択画面

## ローカル確認

```bash
python3 -m http.server 4174 --directory .
```

開くURL:

- `http://127.0.0.1:4174/static/`
- `http://127.0.0.1:4174/motion/`

## フォント

直近の再現工程で作成した `Yahata Reference Serif` 系ファイルを、案件内の `CPI Reference Serif` としてローカル配信しています。これはLibre Baskerville由来の英数字・欧文表示用です。日本語はOSの明朝体（ヒラギノ明朝／游明朝）へフォールバックし、参考画像に合わせて字幅・太さ・行間をCSSで調整しています。

## 公開前に必要なもの

- 実際の代表者・スタッフ・オフィス・建物写真への差し替え
- 代表者名、設立年、連絡先、サービス詳細等の正式原稿
- フォーム送信先、プライバシーポリシー、ドメイン・サーバー設定
- 実機Safariを含む公開環境QA
