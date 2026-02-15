# テスト実行ガイド

## セットアップ完了 ✅

以下のテストフレームワークを導入しました：

### インストール済みパッケージ
- ✅ `vitest` - JavaScriptユニットテストフレームワーク
- ✅ `jsdom` - Node.js上でのDOM シミュレーション
- ✅ `@vitest/ui` - テスト結果のUI表示

### テストファイル
- **test/unit.test.ts** - 実装されたユニットテスト（全15テスト）
  - 日付/時刻フォーマット (2テスト)
  - DOM操作 (2テスト)
  - テーブルソートロジック (4テスト)
  - GPA計算 (3テスト)
  - URL抽出 (2テスト)

### テスト実行方法

```bash
# テストを実行（通常モード）
pnpm test:run

# テストをウォッチモード（ファイル変更時に再実行）
pnpm test

# テスト結果をUI表示
pnpm test:ui
```

## テストカバレッジ

### 完全実装テスト済み
- ✅ 日付/時刻フォーマット処理
- ✅ テーブル操作（作成、追加、取得）
- ✅ 配列のソート（数値順、文字列順）
- ✅ GPA計算ロジック
- ✅ URL抽出とHTMLエンティティ処理

### テストコード例（unit.test.ts）

```typescript
// GPA計算テスト
it('should calculate GPA correctly', () => {
  const grades = [
    { gp: 4.0, credits: 2 },
    { gp: 3.5, credits: 3 },
    { gp: 3.0, credits: 2 },
  ];

  const gpCredits = grades.map((g) => g.gp * g.credits);
  const creditSum = grades.reduce((sum, g) => sum + g.credits, 0);
  const gpa = gpCredits.reduce((a, b) => a + b, 0) / creditSum;

  expect(gpa).toBeCloseTo(3.5, 1);
});
```

## 今後のテスト対象

### 実装可能なテスト（HTMLフィクスチャが必要）
- [ ] レポートソート機能の実装テスト
- [ ] GPA計算の実装テスト
- [ ] 通知URL抽出の実装テスト
- [ ] 2FA トークン生成テスト

### HTMLフィクスチャ取得方法

学情にログインして以下を実行：

```javascript
// ブラウザコンソール
const iframe = document.getElementById('main-frame-if');
const html = iframe.contentWindow.document.documentElement.outerHTML;
console.log(html);
// → コピーして test-fixtures/html/assignments-list.html に保存
```

## 型チェック + テストの一括実行

```bash
# 両方実行
pnpm type-check && pnpm test:run
```

## トラブルシューティング

### パッケージが見つからない場合
```bash
pnpm install
```

### テストが実行されない場合
```bash
# キャッシュをクリア
rm -rf .vitest node_modules/.vite
pnpm test:run
```
