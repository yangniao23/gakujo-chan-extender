# More-Better Gakujo Extension
学務情報システムを使いやすくするブラウザ拡張機能

最初の開発者様が卒業されたため，2025年12月よりメンテナンスを引き継ぎました．
リリースもこちらのリポジトリから行います．かく言う私も2027年3月には卒業予定なので，
開発に興味がある方はぜひご連絡ください．

以下元開発者様による記述

**※注**  
作者卒業により2024/4/1以降はメンテナンス不可能です．もし何かしら要望が出ても動作検証ができないため対応できないと思われます．  
ただまあ学情が何ぞ仕様変更するとは思えないためしばらくは問題なく使えると思います．もし何かあったときはそれが命日なんで誰か何とかしてくれ．

---
---
新潟大学学務情報システムちゃんを使いやすくするためのブラウザ拡張機能を作りたいな～ってやつです  
外部に情報を送信するようなことは全く無いので安心安全です．  

ストアで見たけど「More-Better」は文法的におかしい?…うるせぇ！！！気にすんな！！！！！忘れて！！！！！！！！！~~深夜テンションで命名したらこうなってた(変えられない)~~  


### なにができるの？
以下の機能を搭載しています
- 時間制限120分ぐらいまで自動延長
- レポートをソート
    - 期限順
    - タイトル
    - 開講番号
- 成績のソート
    - 得点順
    - 開講番号順
    - No.順(標準まま)
- GPA計算
- 連絡通知一括既読
- 二段階認証自動化(要セットアップ)

細けえ話は下の方でやってます，読んでね

---

### 利用可能な環境
とりあえず最新版のFirefoxで開発しています．Chromeも動作確認を行っています．Edgeもたぶん大丈夫．  
聞いた話によるとBraveでも動くらしい．chromiumベース系は動くんでしょう．

### インストール
ChromeとEdge等のchromium系はこちらから  
https://chrome.google.com/webstore/detail/more-better-gakujo/gagpkjpimdfhiccjdofhpnnnecadmmod

Firefoxはこちらからどうぞ  
https://addons.mozilla.org/ja/firefox/addon/more-better-gakujo/  

権限がどうとか出るかと思われますが，この拡張機能は学情で画面に表示されている以上の内容は一切取得しない（できない）し，取得した内容も保存しないし，外部への送信なんて全くしません．ここに書いてある以外の機能はありません．  
ただ二段階認証の自動化をセットアップしたならば，そのためのデータの保存と取り出しだけはします．んでもどっかにそれを送信したりはありません．  
もし疑うならソースコード読んでください．「下手糞で醜い杜撰なコード」などという意見は得られるかもしれませんが，怪しいプログラムではないと分かってもらえると思います．


# 機能の説明と使い方

### 時間延長
残り時間が10分になると1分以内に内部で時計アイコンクリックに相当する動作を行い，残り時間を20分に戻します．これによりメモ帳とかワードとかでレポートを書いてから学情にコピペするという許せるっちゃ許せるけど何となくめんどくさいような気もする作業を消し去ることが出来るかもしれません．  
んでも無限に延長するとログインしっぱなしの人とか出てきて学情
がクソ重くなりそうなんで「URLが変わった時点から大体120分」を上限としています．その後はURLが変わる操作をしない限りは延長しません．  

---

### レポートのソート
![レポート画面のボタン](https://github.com/koji-genba/gakujo-chan-extender/blob/Readme_images/report_firefox.png?raw=true)  
レポート提出の画面を開きますとこんな感じにボタンが追加されてます．ボタンを押すと書いてある感じにソートします．使えばわかる．  
ボタン押さなくても提出期間でソートします．  
  
ついでにぱっと見分かりにくいことに定評のある一時保存さんを青字で表示することにより分かりやすくします．  
#### 提出期間でソート
期限内  
｜未提出  
｜一時保存  
｜提出済み  
期限切れ  
｜未提出  
｜一時保存  
｜提出済み  

の順番にソートします．  
#### 開講番号でソート
そのままの意味です
#### タイトルでソート
学情で表示されているレポートのタイトルでソートします．

---

### 成績のソートとGPA計算
#### GPA計算
いつ更新されるのかよく分からないGPAを公開済みの成績から自動で計算し表示します．
#### ソート
![成績画面のボタン](https://github.com/koji-genba/gakujo-chan-extender/blob/Readme_images/score_firefox.png?raw=true)  
レポートのソートと同じ感じです．

---

### 連絡通知一括既読
![連絡通知一括既読](https://raw.githubusercontent.com/koji-genba/gakujo-chan-extender/Readme_images/messageReader_1.png)  
気づくとありえない量溜まってて読むのが億劫になることに定評がある連絡通知を一気に既読にします．  
使い方はまあ見てのとおりです．枠に**半角数字で**既読にしたい個数入力してボタン押すと，その分だけ上から別タブで読み込んで，開いたタブは1秒で自動で閉じて，更にボタン押して1秒後に自動で連絡通知のページをリロードする感じです．  
  
ちなみに存在する連絡通知よりも多い数を指定した時の動作は確認してません。多分存在する通知全部が読まれると思う．ついでにfirefoxでコンテナタブ使ってると上手く動かない．通知を標準のタブで開いちゃうから．~~適当プログラミングクオリティ~~  

---

### 2段階認証自動入力
学務情報システムログイン時の認証コードによる2段階認証を自動化します．  
セットアップさえすれば自動でコード入力が行われます．  
2段階認証が2段階認証としての意味を失うためセキュリティ的には良くないですが面倒なものは面倒．初期パスワードだってちゃんと乱数パスワードなのに何故2段階認証を実装したのか．~~聞いた噂だと文科省からの通達のせいだとかなんとからしいですがまさか将来の新入生の初期パスワードはp@ssw0rdになってしまうのか!?~~  

---

#### 2段階認証セットアップ方法
まだ学務情報システムで2段階認証をセットアップしてない場合は **6** から始めてください．  
既に学務情報システムで2段階認証をセットアップした人は **1** から始めてください．
#### 1
![2FA画面1](https://github.com/koji-genba/gakujo-chan-extender/blob/Readme_images/2FA_2.png?raw=true)  
学務情報システムで2段階認証をセットアップ済みの方はリセットを行う必要があります．  
「リセット」をクリックしてリセット作業を始めます．

#### 2
2,3分程度すると学籍番号のメールアドレスにsystem@mail.cc.niigata-u.ac.jpから【セキュリティキーリセット】というタイトルのメールが届いているはずです．その中のリンクをクリックします．

#### 3
![2FAリセット確認画面](https://github.com/koji-genba/gakujo-chan-extender/blob/Readme_images/2FA_3.png?raw=true)  
メールのリンクをクリックすると画像のような非常に簡素でデザイン性の欠片もない画面が表示されますのでまた「リセット」をクリックします

#### 4
![2FAリセット確認画面](https://github.com/koji-genba/gakujo-chan-extender/blob/Readme_images/2FA_4.png?raw=true)  
「リセット」をクリックするとしつこいぐらいに確認してくるので「OK」します．  
この時点で以前Authenicatorに登録したやつは使えなくなってるので削除して大丈夫です．(androidであれば長押し->右上ゴミ箱)  

#### 5
![ログイン画面2](https://github.com/koji-genba/gakujo-chan-extender/blob/Readme_images/2FA_5.png?raw=true)  
OKするといつものログイン画面に飛ばされるのでいつも通りログインします．

#### 6
![2FAセットアップ画面](https://github.com/koji-genba/gakujo-chan-extender/blob/Readme_images/2FA_7.png?raw=true)  
ログインすると2段階認証の設定画面が表示されます．1.5秒くらいで拡張機能での追加部分も表示されます．  

**まずQRコードをGoogle Authenicatorなどの認証アプリに読み込ませてください．**  

そうしないとこの拡張機能がうまく動作しなかった場合に再セットアップすることになり面倒くさくなってしまいます．

次に表示されている文字列(以下面倒くさいため鍵と呼ぶ)を下部の「拡張機能2FA鍵保存フォーム」にコピペしてください．  
またこの時に，この鍵をパスワードマネージャー等の安全な場所に保存しておくことを個人的にお勧めします．  
  
**複数のブラウザでこの拡張機能を使っている場合はすべてのブラウザに同じ鍵を入力する必要があります．**  

どれか一つのブラウザでこの作業を行い，その時に表示された鍵を全てのブラウザにコピペする必要があります．申し訳ありませんが同期機能を実装していないので複数PCを使うときは他PCのブラウザに対しても同じ鍵を入力する必要があります．だから鍵を保存しておく必要があったんですね．  
  
コピペしたら「save」をクリックしてください．あとはまあ普通に学情ログインするだけです．

#### 7
![ログイン画面](https://github.com/koji-genba/gakujo-chan-extender/blob/Readme_images/2FA_8.png?raw=true)  
「save」をクリックすると多分何ぞ文句言われてここに帰ってくるので普通にログインします．

#### 8
![2FA画面](https://github.com/koji-genba/gakujo-chan-extender/blob/Readme_images/2FA_9.png?raw=true)  
2段階認証の画面になって1.5秒位すると6桁の認証コードが自動入力されます．あとは「ログイン」をクリックすればログインできるはずです．  
認証エラー等なった場合は鍵のコピペで何か間違っていないか，この作業をした後に鍵のリセットをしていないか等を確認してください．そんでもダメなときは私に連絡ください．可能な範囲で対応したりしなかったりします．

#### ※分かる人向け
この拡張機能内で生成された6桁コードはコンソールログに吐き出しています．  
鍵の設定にミスがないのに認証エラーが出ているときはコンソールログ吐き出された6桁コードと認証アプリ側の6桁コードが一致しているか確認してください．もし不一致であればissue投げたり連絡したりしてください．

---

# 開発者向け情報

### 技術スタック
- **TypeScript 5.4** - 型安全な開発
- **WXT 0.20** - WebExtension フレームワーク
- **Vite 7.3** - 高速ビルドツール
- **Vitest 4.0** - ユニットテストフレームワーク
- **pnpm** - 高速パッケージマネージャー

### プロジェクト構成

このプロジェクトはWXTフレームワークを使用した、モダンなTypeScript製ブラウザ拡張機能です。

#### ディレクトリ構造

```
gakujo-chan-extender/
├── src/                      # ソースコード
│   ├── entrypoints/          # 🔌 WXT エントリポイント（拡張機能の起動点）
│   │   ├── background.ts     # バックグラウンドサービスワーカー（通知既読処理）
│   │   ├── login-2fa.content.ts            # 2FA自動入力ページ
│   │   ├── portal-main.content.ts          # ポータルトップ（自動延長+バージョン表示）
│   │   ├── portal-assignments.content.ts   # レポート一覧ページ
│   │   ├── portal-grades.content.ts        # 成績一覧ページ
│   │   └── portal-notifications.content.ts # 通知一覧ページ
│   │
│   ├── pages/                # 📄 ページ別メインロジック
│   │   ├── login-2fa.ts              # 2FA自動入力のUI構築とTOTP生成
│   │   ├── portal-assignments.ts     # レポートページの初期化
│   │   ├── portal-grades.ts          # 成績ページの初期化
│   │   ├── portal-main.ts            # ポータルトップの初期化
│   │   └── portal-notifications.ts   # 通知ページの初期化
│   │
│   ├── features/             # ⚙️ 機能モジュール（再利用可能な機能単位）
│   │   ├── assignments/
│   │   │   └── report-sorter.ts      # レポートソート機能（期限順/タイトル/開講番号）
│   │   ├── grades/
│   │   │   └── gpa-solver.ts         # GPA計算と成績ソート機能
│   │   ├── notifications/
│   │   │   └── message-reader.ts     # 通知一括既読機能
│   │   ├── session/
│   │   │   └── auto-extend.ts        # セッション自動延長（120分まで）
│   │   └── ui/
│   │       └── version-display.ts    # バージョン番号表示
│   │
│   └── core/                 # 🛠️ コアユーティリティ（汎用ヘルパー）
│       ├── auth/             # 認証・暗号化関連
│       │   ├── convert.ts          # Base32→Hex変換
│       │   ├── totp.ts             # TOTPトークン生成（RFC 6238準拠）
│       │   └── validation.ts       # 入力値検証
│       ├── browser/
│       │   └── api.ts              # ブラウザAPI抽象化（Chrome/Firefox互換）
│       └── dom/              # DOM操作ヘルパー
│           ├── element-factory.ts  # 要素作成ヘルパー（button, input等）
│           ├── element-query.ts    # 要素検索ヘルパー
│           ├── element-waiter.ts   # 要素出現待機ユーティリティ
│           ├── element-advanced.ts # 高度なDOM操作
│           ├── iframe-accessor.ts  # iframe内要素へのアクセス
│           └── index.ts            # 公開API
│
├── test/                     # 🧪 テストコード
│   ├── unit.test.ts          # ユニットテスト（13テスト）
│   └── setup.ts              # テスト環境セットアップ
│
├── test-fixtures/            # テスト用HTMLフィクスチャ（E2Eテスト準備中）
├── public/                   # 静的アセット
│   ├── icon48.png            # 拡張機能アイコン 48x48
│   └── icon128.png           # 拡張機能アイコン 128x128
│
├── .wxt/                     # WXTが生成する型定義（自動生成、編集不要）
├── .output/                  # ビルド成果物（自動生成）
│   ├── chrome-mv3/           # Chrome版（Manifest V3）
│   ├── firefox-mv2/          # Firefox版（Manifest V2）
│   └── *.zip                 # 配布用ZIPファイル
│
├── wxt.config.ts             # WXT設定（manifest定義、ビルド設定）
├── tsconfig.json             # TypeScript設定
├── vitest.config.ts          # Vitest設定
├── package.json              # 依存関係とスクリプト定義
└── TEST_GUIDE.md             # テストガイド
```

#### アーキテクチャ概要

**エントリポイント → ページ → 機能 → コア** の階層構造：

1. **entrypoints/** - WXTがロードする起点。URLマッチングと初期化
2. **pages/** - 各ページの統合ロジック。機能モジュールを組み合わせる
3. **features/** - 独立した機能単位。単体テスト可能
4. **core/** - 汎用ヘルパー。プロジェクト全体で再利用

**依存方向**: entrypoints → pages → features → core（逆方向の依存なし）

#### 新機能を追加するには？

**例: 新しいページに機能を追加したい場合**

1. **機能モジュール作成** - `src/features/新機能名/` に機能を実装
2. **ページロジック作成** - `src/pages/新ページ名.ts` で機能を統合
3. **エントリポイント作成** - `src/entrypoints/新ページ名.content.ts` でURLマッチング
4. **テスト作成** - `test/unit.test.ts` にユニットテスト追加

**例: 既存機能を改善したい場合**

- レポートソート機能 → `src/features/assignments/report-sorter.ts` を編集
- GPA計算 → `src/features/grades/gpa-solver.ts` を編集
- 2FA自動入力 → `src/pages/login-2fa.ts` を編集（TOTPロジックは `src/core/auth/totp.ts`）

**例: DOM操作ヘルパーを追加したい場合**

- `src/core/dom/` に新しいヘルパーを追加
- `src/core/dom/index.ts` でエクスポート

### 開発環境のセットアップ

#### 必要要件
- Node.js 18以上
- pnpm 8以上

#### インストール
```bash
# リポジトリをクローン
git clone https://github.com/yangniao23/gakujo-chan-extender.git
cd gakujo-chan-extender

# 依存関係をインストール
pnpm install
```

### ビルド方法

#### 開発モード（ホットリロード付き）
```bash
# Chrome用開発サーバー起動
pnpm dev

# Firefox用開発サーバー起動
pnpm dev:firefox
```

開発サーバーが起動すると、`.output/chrome-mv3-dev/` または `.output/firefox-mv2-dev/` にビルド成果物が生成されます。
コード変更時に自動的に再ビルドされます。

#### 本番ビルド

**Chrome版 (Manifest V3)**
```bash
# ビルドのみ
pnpm build
# または
pnpm build:chrome

# ビルド + ZIPパッケージ生成
pnpm zip
```

**Firefox版 (Manifest V2)**
```bash
# ビルドのみ
pnpm build:firefox

# ビルド + ZIPパッケージ生成
pnpm zip:firefox
```

#### ビルド成果物

**Chrome版**
- ビルドディレクトリ: `.output/chrome-mv3/`
- ZIPファイル: `.output/gakujo-chan-extender-0.64.0-chrome.zip`
  - Chrome Web Store提出用
  - サイズ: 約19KB

**Firefox版**
- ビルドディレクトリ: `.output/firefox-mv2/`
- ZIPファイル: 
  - `.output/gakujo-chan-extender-0.64.0-firefox.zip` (約19KB)
  - `.output/gakujo-chan-extender-0.64.0-sources.zip` (約264KB) - AMO審査用ソースコード

### 拡張機能の読み込み（開発時）

**Chrome / Edge**
1. `chrome://extensions/` を開く
2. 「デベロッパーモード」を有効化
3. 「パッケージ化されていない拡張機能を読み込む」をクリック
4. `.output/chrome-mv3/` ディレクトリを選択

**Firefox**
1. `about:debugging#/runtime/this-firefox` を開く
2. 「一時的なアドオンを読み込む」をクリック
3. `.output/firefox-mv2/manifest.json` を選択

### テスト

```bash
# ユニットテスト実行
pnpm test

# テストUI付きで実行
pnpm test:ui

# 1回だけ実行（CI用）
pnpm test:run

# 型チェック
pnpm type-check
```

### クリーンビルド
```bash
# ビルド成果物を削除
pnpm clean

# 完全クリーンビルド
pnpm clean && pnpm install && pnpm build
```

### コードフォーマット・品質

- TypeScript strict モード有効
- すべてのモジュールは型定義済み
- ユニットテストカバレッジ: コアロジック対象

### よくある問題

**Q: ビルドエラーが出る**
```bash
# キャッシュをクリアして再ビルド
rm -rf .wxt .output node_modules
pnpm install
pnpm build
```

**Q: 型エラーが消えない**
```bash
# TypeScript Language Serverのリロード
# VSCode: Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

**Q: 開発サーバーでホットリロードが効かない**
- 拡張機能のバックグラウンドページは手動リロードが必要
- Content scriptsは自動的に再注入される

### 貢献について
プルリクエスト歓迎です！大きな変更の場合は、先にissueで相談してください。

### ライセンス
MIT License - 詳細は[LICENSE](LICENSE)ファイルを参照
