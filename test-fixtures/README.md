# テストフィクスチャ

## HTMLスナップショットの保存方法

### 1. 課題一覧ページ
```
https://gakujo.iess.niigata-u.ac.jp/campusweb/campusportal.do?tabId=en
```

1. 学情にログイン
2. 課題一覧ページへ移動
3. F12 → Console で以下を実行：

```javascript
// メインページ
const mainDoc = new XMLSerializer().serializeToString(document);
const blob1 = new Blob([mainDoc], { type: 'text/html' });
const url1 = URL.createObjectURL(blob1);
const a1 = document.createElement('a');
a1.href = url1;
a1.download = 'portal-main.html';
a1.click();

// iframe内のコンテンツ
const iframe = document.getElementById('main-frame-if');
const iframeDoc = new XMLSerializer().serializeToString(iframe.contentWindow.document);
const blob2 = new Blob([iframeDoc], { type: 'text/html' });
const url2 = URL.createObjectURL(blob2);
const a2 = document.createElement('a');
a2.href = url2;
a2.download = 'assignments-list.html';
a2.click();
```

### 2. 成績一覧ページ
```
https://gakujo.iess.niigata-u.ac.jp/campusweb/campusportal.do?tabId=si
```

同様の手順でiframe内を保存：`grades-list.html`

### 3. 通知一覧ページ
```
https://gakujo.iess.niigata-u.ac.jp/campusweb/campusportal.do?tabId=kj
```

同様の手順でiframe内を保存：`notifications-list.html`

## ファイル構造

```
test-fixtures/
├── html/
│   ├── portal-main.html          # ポータルメインページ
│   ├── assignments-list.html     # 課題一覧（iframe内）
│   ├── grades-list.html          # 成績一覧（iframe内）
│   └── notifications-list.html   # 通知一覧（iframe内）
└── README.md
```

## 注意事項

- 個人情報（学籍番号、成績など）は保存前に編集・削除すること
- HTMLをGitにコミットする場合は必ず機密情報を削除
- テスト用のダミーデータに置き換えることを推奨
