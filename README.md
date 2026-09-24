<!--
---
id: day027
slug: playfair-cipherlab

title: "Playfair CipherLab"

subtitle_ja: "ビジュアルで学ぶプレイフェア暗号ツール"
subtitle_en: "Visual Learning Tool for Playfair Cipher"

description_ja: "プレイフェア暗号の暗号化・復号過程をステップバイステップのアニメーションで視覚的に学べる教育ツール。段階的なチャレンジシステムとヒント機能で、古典暗号の仕組みを楽しく理解できます。"
description_en: "An educational tool to visually learn the Playfair cipher encryption and decryption process through step-by-step animations. Features a progressive challenge system with hints to help understand classical cryptography concepts."

category_ja:
  - 古典暗号
  - 換字式暗号
category_en:
  - Classical Cryptography
  - Substitution Cipher

difficulty: 2

tags:
  - visualization
  - education
  - ctf

repo_url: "https://github.com/ipusiron/playfair-cipherlab"
demo_url: "https://ipusiron.github.io/playfair-cipherlab/"

hub: true
---
-->

# Playfair CipherLab - ビジュアルで学ぶプレイフェア暗号ツール

![GitHub Repo stars](https://img.shields.io/github/stars/ipusiron/playfair-cipherlab?style=social)
![GitHub forks](https://img.shields.io/github/forks/ipusiron/playfair-cipherlab?style=social)
![GitHub last commit](https://img.shields.io/github/last-commit/ipusiron/playfair-cipherlab)
![GitHub license](https://img.shields.io/github/license/ipusiron/playfair-cipherlab)
[![GitHub Pages](https://img.shields.io/badge/demo-GitHub%20Pages-blue?logo=github)](https://ipusiron.github.io/playfair-cipherlab/)

**Day027 - 生成AIで作るセキュリティツール100**

Playfair CipherLabは、古典暗号の一種であるプレイフェア暗号を視覚的に学べるWebツールです。
5×5の鍵表を作り、暗号化・復号を2文字の組ごとに再生できます。
日本語・英語の画面と、ヒント付きの解読チャレンジを備えています。

## 🌐 デモページ

👉 [Playfair CipherLabを開く](https://ipusiron.github.io/playfair-cipherlab/)

ブラウザーで直接利用できます。ダウンロードしたindex.htmlを直接開くこともできます。

## 📸 スクリーンショット

![暗号化の10組目と鍵表のハイライト](assets/screenshot.png)

> *PLAYFAIR EXAMPLEの鍵表でWikipediaの例を暗号化し、10/13組目のEX→XMを表示しています。*

![解読チャレンジの正解と埋め文字の候補](assets/screenshot2.png)

> *SECRETの鍵表でmystery-02に正解した状態です。末尾Xの候補と、候補を除いた文を並べています。*

![ダーク・英語の鍵語プレビュー](assets/screenshot3.png)

> *英語・ダーク表示でPLAYFAIR EXAMPLEを入力し、鍵語由来の文字を色分けしています。*

## ✨ 機能

### 📊 学習進捗管理

- チャレンジ3問の得点管理（10・20・30点、各問1回だけ加算）
- 正解による次レベルの解放と、進捗パネル・リセット
- 同じブラウザー内への進捗保存。保存できない場合もページ内で利用可能

### 🔑 鍵生成

- キーワード指定と25文字のマトリクス直接入力
- 5×5の表のリアルタイムプレビュー
- J→Iの統合、重複・文字数の検証

### 🔐 暗号化・復号

- 標準のプレイフェア暗号とX・Q・Zからの埋め文字選択
- 標準ではない3つの変種（変化なし・右隣置換・対角移動）
- 8つの例文、復号練習3問、解読チャレンジ3問
- 埋め文字を自動で削除しない復号結果と、候補の印・候補を除いた文

### 🎬 再生と表示

- 前・再生／停止・次・最初から・最後までの操作
- 組の規則の説明、埋め文字の下線、最大4セルのハイライト
- 暗号化・復号の独立した再生状態と、鍵・入力・設定変更時の古い結果の非表示
- 日本語・英語、ライト・ダーク、キーボード操作、モバイル表示
- 動きを減らす設定では自動再生せず、全組の結果を表示

## 📖 使い方

### 🔑 鍵生成

1. 「編集」を押す。
2. キーワード指定で英単語を入力するか、マトリクス指定で25文字を入力する。
3. プレビューを確認し、「保存」で鍵表を確定する。

鍵語なしの既定の表に戻す場合は、マトリクス指定で`ABCDEFGHIKLMNOPQRSTUVWXYZ`を入力します。

### 🔐 暗号化で学習

1. 平文を入力するか、カテゴリから例文を選んで読み込む。
2. 標準では補完文字挿入をオンにし、埋め文字を選ぶ。
3. 「暗号化」を押し、各組の説明と鍵表の位置を見る。
4. 前・次・最初から・最後までで表示位置を変え、再生／停止で自動送りを切り替える。

補完文字挿入をオフにした場合は変種です。「既知の例」のWikipediaの文を読み込むと、鍵表もPLAYFAIR EXAMPLEに変わります。

### 🔓 復号でチャレンジ

1. 「復号」の課題選択で解読チャレンジを読み込む。
2. ヒントを読み、「鍵生成」で課題に対応する鍵表を保存する。
3. 「復号」を押して、復号結果と埋め文字の候補を確認する。
4. 解答を入力して「解答をチェック」を押す。

解答が合っていても鍵表が違えば正解になりません。空白や大文字・小文字は問いません。
元の答え、埋め文字を含む復号結果、候補を除いた文のいずれかを受け付けますが、無関係な末尾の文字を足した解答は受け付けません。

## 🧠 プレイフェア暗号とは

**プレイフェア暗号（Playfair cipher）** は、19世紀半ばに考案された古典暗号の一種です。

平文を数文字ずつに区切って、そのグループごとに<ruby>換字<rt>かえじ</rt></ruby>するタイプの暗号を、<ruby>綴字<rt>つづりじ</rt></ruby>暗号といいます。
プレイフェア暗号も綴字暗号の一種であり、2文字ペア（ダイグラフ：digraph）で区切ります。

**2文字単位の文字変換（digraph substitution）** を用いる点で、より単純な換字式暗号よりも高い複雑性を持ちます。

---

### 🔎 背景と歴史

この暗号は **チャールズ・ホイートストン（Charles Wheatstone）** によって1854年に発明されましたが、彼の友人であった **プレイフェア男爵（Lord Playfair）** が紹介したことで評判が高まったので、プレイフェア暗号という名で広く知られるようになりました。

イギリス軍では第一次世界大戦および第二次世界大戦でも一定期間採用された実績があり、**手軽に使える割に強力な暗号** として評価されていました。

---

### ⚙ 仕組みの概要

プレイフェア暗号は、**5×5のマトリクス（鍵表）** を用いて文字ペアごとに暗号化を行います。
アルファベットのうち `I` と `J` を統合して25文字に圧縮し、以下のような処理を行います。

| 2文字の位置関係 | 処理方法 |
|----------------|----------|
| 同じ行         | 右に1文字ずらす（右端は左端へ） |
| 同じ列         | 下に1文字ずらす（下端は上端へ） |
| 長方形（異なる行・列）| 対角線で相手の列を交換 |

また、暗号化の際に、同一文字のペアだった場合や、終端が1文字になってしまう場合には、`X`や`Z`などの補完文字（埋め文字）を挿入して調整します。

---

### 🧭 古典暗号における位置づけ

プレイフェア暗号は、以下の点で単純な換字式暗号（Caesar, Monoalphabetic）よりも高度です。

- **ペア単位の換字** により、頻度分析を難しくする  
- 1文字ずつではなく **2文字ずつ扱う** ことで、アルファベット単体の頻度分析が通用しない  
- 鍵として使うマトリクスが **構造的に視覚的** で、教育向けにも適している

このため、プレイフェア暗号は古典暗号における **中級レベルの教育暗号** として位置づけられています。

---

### 🧩 解読のされやすさと弱点

プレイフェア暗号は、以下のような **構造的な強みと弱み** を持っています。

---
#### ✅ 強み

- シンプルな頻度分析では解読が困難
- 2文字単位の換字により、1文字単位の推測を困難にする
- キーワードによる柔軟な鍵生成が可能。鍵マトリクス全体を記憶するのは難しいが、キーワードなら覚えやすい。

---
#### ⚠️ 弱み

- 暗号化ルールが単純であるため、**十分な量の暗号文があれば総当たりでの推測が可能**
- **同じ平文ペア → 同じ暗号ペア** となるため、パターンが現れやすい
- **2文字単位の構造** は、暗号文中に現れる「頻出ペア」などの統計情報に弱い

現在ではコンピューターによって **容易に解読可能な暗号** とされており、**実用性はほとんどありません** が、教育用途やCTFなどでは頻繁に登場します。

---

## 🔬 規則と既知解答

標準では入力を大文字にし、JをIに統合して英字以外を除きます。
左から2文字ずつ組を確定し、同じ文字の組にだけ埋め文字を挟みます。
奇数の末尾にも埋め文字を足します。組の境界をまたぐ同じ文字には挟みません。

埋め文字はX・Q・Zから選べます。対象の文字が埋め文字と同じ場合は、Xの代わりにQ、それ以外の代わりにXを使います。
同じ行は右へ、同じ列は下へ1つずらし、長方形では列を交換します。復号は左・上への移動です。

| 鍵語 | 平文 | 前処理 | 暗号文 |
|---|---|---|---|
| 既定 | HELLO | HELXLO | KCNVMP |
| 既定 | SEEN | SEEN | UCCP |
| 既定 | BALLOON | BALXLOON | CBNVMPPO |
| 既定 | FOXX | FOXQXQ | ILVSVS |
| PLAYFAIR EXAMPLE | HIDE THE GOLD IN THE TREE STUMP | HIDETHEGOLDINTHETREXESTUMP | BMODZBXDNABEKUDMUIXMMOUVIF |

既定の表は`ABCDEFGHIKLMNOPQRSTUVWXYZ`です。
変化なし・右隣置換・対角移動は、同じ文字の組を分割せず扱う変種であり、標準ではありません。

復号では埋め文字かどうかを一意に決められないため、候補だけを下線で示します。
たとえばTHE QUICK BROWN FOXの末尾Xは本物ですが、候補に見えます。「候補を除いた文」は答えを保証しません。

標準の暗号文には同じ文字からなる組がありません。同じ鍵表で組の順を逆にすると、対応する暗号文の組も逆順になります。
これらは2文字の組についての性質で、任意の隣り合う文字や文章全体についての主張ではありません。

### 現行版からの変更点

組の境界をまたいだ同じ文字にも埋め文字を挟んでいた不具合を修正しました。
課題の暗号文は標準の規則で作り直し、解答時には実際の鍵表も検証します。
既知解答・課題データ・READMEの表は同じ暗号実装で検査します。

## 🏆 チャレンジ一覧

| レベル | タイトル | 暗号文 | 鍵語 | 得点 |
|---|---|---|---|---|
| 1 | 謎の単語 | KCNVMP | 既定 | 10 |
| 2 | 秘密のメッセージ | ITCSITEUOHAMCZ | SECRET | 20 |
| 3 | 軍事作戦 | MAAMDHMAKDUP | MILITARY | 30 |

<details>
<summary>レベル1：謎の単語の答えとヒント</summary>

答えは`HELLO`です。

- 挨拶に使われる言葉です
- 鍵語は設定しません（既定の表）
- 5文字の英単語です
- 復号すると埋め文字の X が1つ入っています

</details>

<details>
<summary>レベル2：秘密のメッセージの答えとヒント</summary>

答えは`MEET ME TONIGHT`です。

- 鍵表は『秘密』という意味の英単語から作ります
- 待ち合わせに関する文です
- 3つの単語でできています
- 解答の空白と大文字・小文字は問いません

</details>

<details>
<summary>レベル3：軍事作戦の答えとヒント</summary>

答えは`ATTACK AT DAWN`です。

- 鍵表は軍事に関係する英単語から作ります
- 鍵語は8文字です
- 暗号の教科書で定番の例文です
- 時刻に関する単語が入っています

</details>

## 🔒 セキュリティ

暗号処理はブラウザー内で完結し、実行時の外部通信・外部ライブラリー・外部フォントはありません。
プレイフェア暗号は教育用の古典暗号であり、秘密情報を保護する用途には使わないでください。

meta CSPでスクリプトとスタイルを同一オリジンに制限し、unsafe-inlineを許可しません。
referrerはno-referrerです。表示はtextContentとDOM APIを使い、HTML挿入は辞書の固定ヘルプとフッターに限ります。
インラインのイベントハンドラーとstyle属性は使いません。metaでは無効なframe-ancestorsは指定していません。

localStorageに保存するのは進捗・言語・テーマだけで、同じブラウザーの中でだけ保持します。
鍵・入力文・復号結果は保存しません。保存領域が遮断されても操作できますが、その場合は再読み込みで設定と進捗が戻ります。
クリップボードが使えない場合は、コピー失敗の通知を表示します。

## 📚 教育利用

### 対象レベル
- **中学生〜高校生**: 情報科目での暗号学習
- **大学生**: 情報セキュリティ入門課程
- **一般向け**: プログラミング教育、STEAM教育

---
### 活用シーン
- 📖 **授業での演示**: プロジェクター投影でのデモンストレーション
- 💻 **個人学習**: 自分のペースでの暗号理解
- 👥 **グループワーク**: チーム対抗での暗号解読競技
- 🏆 **コンテスト**: CTF初心者向けの練習問題

---

## 🔗 参考

- [Wikipedia「Playfair cipher」](https://en.wikipedia.org/wiki/Playfair_cipher)
- 『暗号の秘密』P.70-72
- 『暗号解読事典』P.181-183
- 『暗号事典』P.556-559

## 🧪 テスト

Node.js 22以上で、依存パッケージをインストールせずに実行できます。

```bash
npm test
```

GitHub Actionsでもpushとpull_requestごとにNode 22で実行します。
READMEの既知解答5行・チャレンジ3行とヒントも、PlayfairCore・課題データ・辞書から検証します。

| テストファイル | 検査内容 |
|---|---|
| test/cipher.test.js | 鍵表・前処理・標準・変種・往復・埋め文字候補・固定シード200例 |
| test/exercises.test.js | 6問の暗号文・正誤判定・得点・壊れた保存データ |
| test/i18n.test.js | 日英のキー・値・日本語の直書き・ヘルプ |
| test/html.test.js | CSP・referrer・ARIA・ラベル・インライン属性 |
| test/contrast.test.js | ライト・ダークの18組が4.5:1以上 |
| test/format.test.js | 最長行と行数、minifyの検出 |
| test/readme.test.js | 表の再計算・ヒント・YAML・ツリー・画像参照 |

## 📁 ディレクトリー構造

```text
playfair-cipherlab/             # プロジェクトのルート
├── .github/                    # GitHubの設定
│   └── workflows/              # GitHub Actionsのワークフロー
│       └── test.yml            # pushとpull_requestでnpm testをNode 22で実行
├── .gitignore                  # Git管理から除外するファイル
├── .nojekyll                   # GitHub PagesのJekyll処理を無効化
├── CLAUDE.md                   # 開発ガイド（構成・規則・テスト）
├── LICENSE                     # MITライセンス
├── README.md                   # 使い方・規則・既知解答・テスト・構成
├── package.json                # npm testの定義。依存パッケージなし
├── index.html                  # 画面（3タブ・処理過程・ヘルプ・meta CSP）
├── assets/                     # README用の画像
│   ├── screenshot.png          # 暗号化の再生（Wikipediaの例、10組目）
│   ├── screenshot2.png         # 解読チャレンジの正解と埋め文字の候補
│   └── screenshot3.png         # ダーク・英語の鍵生成プレビュー
├── css/                        # スタイルシート
│   └── styles.css              # 配色変数・ダーク・レスポンシブ
├── js/                         # classic script（file://対応）
│   ├── cipher.js               # 暗号の中核（標準・変種・候補。DOM非依存）
│   ├── exercises.js            # 例文・課題・判定・進捗（DOM非依存）
│   ├── ui.js                   # 画面の処理（タブ・鍵表・再生・課題）
│   ├── i18n.js                 # 日英の辞書と切り替え（ヘルプを含む）
│   ├── theme-init.js           # 初回描画前のテーマ適用
│   ├── theme.js                # ダークモードの切り替え
│   ├── help.js                 # ヘルプのダイアログ
│   └── main.js                 # 起動処理
└── test/                       # 自動テスト（node --test）
    ├── cipher.test.js          # 鍵表・前処理・暗号化・変種・往復・候補
    ├── exercises.test.js       # 課題データ・正誤判定・進捗
    ├── i18n.test.js            # 辞書のキー・日本語の直書きの検査
    ├── html.test.js            # CSP・referrer・ARIA・属性の静的検証
    ├── contrast.test.js        # 明暗18組のコントラスト検証
    ├── format.test.js          # minifyの検出（最長行・行数）
    └── readme.test.js          # READMEの表・YAML・ツリー・画像の検証
```

## 💻 動作環境

HTML5・CSS3・JavaScriptに対応したモダンブラウザー向けです。
ビルドは不要で、index.htmlを直接開くfile://と、次のHTTP配信の両方で動きます。
既存のChromiumで両方式、日英、幅1280・768・390・320pxを確認しています。

```bash
python -m http.server 8000
```

## 📄 ライセンス

MIT License - 詳細は[LICENSE](LICENSE)をご覧ください。

## 🛠️ このツールについて

本ツールは、「生成AIで作るセキュリティツール100」プロジェクトの一環として開発されました。
このプロジェクトでは、AIの支援を活用しながら、セキュリティに関連するさまざまなツールを100日間にわたり制作・公開しています。
古典暗号から現代暗号、ネットワークセキュリティ、マルウェア解析まで、幅広いセキュリティ分野を扱っています。

🔗 [プロジェクトの詳細とほかのツール](https://akademeia.info/?page_id=42163)
