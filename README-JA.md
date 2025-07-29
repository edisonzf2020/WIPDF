# WIPDF - ランダム請求書ジェネレーター

[中文](README.md) | [English](README-EN.md) | **日本語**

WindsurfとCursorの請求書テンプレートに対応したランダムな請求書データを生成し、PDF出力機能を備えたWebアプリケーションです。

## 機能特性

- 🎲 **ランダムデータ生成**: 請求書番号、領収書番号、支払方法、請求先情報、請求日を自動生成
- 📄 **PDF出力**: 生成した請求書をPDFファイルとして保存可能  
- 🎨 **複数テンプレート**: WindsurfとCursorの2種類の請求書テンプレートに対応、オリジナルのスタイルとレイアウトを完全維持
- 📱 **レスポンシブデザイン**: 異なる画面サイズのデバイスに対応
- ⚡ **高速デプロイ**: Vercelへのワンクリックデプロイに対応
- 🔄 **タイプ切替**: インターフェースで異なる請求書タイプを簡単に切り替え可能

## ランダム生成されるデータフィールド

1. **Invoice number（請求書番号）**: 8文字の16進数-4桁の数字形式
2. **Receipt number（領収書番号）**: 4桁の数字-4桁の数字形式  
3. **Payment method（支払方法）**: ランダムなクレジットカード種類と下4桁
4. **請求先情報**: 氏名、住所、市区町村、都道府県、国を含む（メールアドレスはユーザー入力を使用）
5. **請求日**: 2025年4月17日から2025年6月16日の間でランダム生成

## 技術スタック

- **フレームワーク**: Next.js 15 with App Router
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS + カスタムCSS
- **デプロイ**: Vercel
- **パッケージ管理**: npm

## クイックスタート

### ローカル開発

1. **プロジェクトをクローン**
   ```bash
   git clone <your-repo-url>
   cd WIPDF/invoice-generator
   ```

2. **依存関係をインストール**
   ```bash
   npm install
   ```

3. **開発サーバーを起動**
   ```bash
   npm run dev
   ```

4. **アプリケーションにアクセス**
   ブラウザで [http://localhost:3000](http://localhost:3000) を開く

### 本番用ビルド

```bash
npm run build
npm start
```

## 🚀 デプロイガイド

### Vercelへのクイックデプロイ

#### ステップ1: プロジェクトをフォーク

1. **プロジェクトリポジトリにアクセス**
   - [WIPDFプロジェクトページ](https://github.com/Sirhexs/WIPDF)を開く
   - 右上の「Fork」ボタンをクリック

#### ステップ2: Vercelにデプロイ

1. **Vercelにログイン**
   - [vercel.com](https://vercel.com)にアクセス
   - GitHubアカウントでログイン

2. **プロジェクトをインポート**
   - 「New Project」をクリック
   - フォークした`WIPDF`リポジトリを選択
   - 「Import」をクリック

3. **デプロイを開始**
   - 「Deploy」ボタンをクリック
   - 1-3分でビルドが完了するまで待機
   - プロジェクトアクセスリンクを取得

## 使用方法

### 新しい請求書を生成

1. **請求書タイプを選択**: ページ上部で生成する請求書タイプを選択
   - **Windsurf Invoice**: $6.90のWindsurf Proサブスクリプション
   - **Cursor Invoice**: $20.00のCursor Proサブスクリプション  
2. メール入力欄に受取人のメールアドレスを入力（必須）
3. 「新しい請求書を生成」ボタンをクリック
4. システムが自動的にランダムデータと指定されたメールを含む新しい請求書を生成
5. 請求書が即座にページに表示され、選択されたタイプに応じてスタイルが自動調整される

**注意**: メールアドレスは必須フィールドです。未入力または形式が正しくない場合、システムはエラーメッセージを表示し、請求書生成を阻止します。

### PDFに出力

1. 請求書生成後、「印刷/PDF保存」ボタンをクリック
2. 印刷ダイアログで「PDFとして保存」を選択
3. 保存場所を選択してPDFファイルをダウンロード

## プロジェクト構造

```
WIPDF/
├── src/
│   ├── app/
│   │   ├── page.tsx          # メインページ
│   │   ├── layout.tsx        # レイアウトコンポーネント
│   │   └── globals.css       # グローバルスタイル
│   ├── components/
│   │   ├── WindsurfInvoice.tsx  # Windsurf請求書コンポーネント
│   │   └── CursorInvoice.tsx    # Cursor請求書コンポーネント
│   ├── types/
│   │   └── invoice.ts        # 型定義
│   └── utils/
│       └── invoiceGenerator.ts # 請求書データジェネレーター
├── public/
│   ├── windsurf-logo.png     # Windsurf ロゴ
│   └── cursor-logo.png       # Cursor ロゴ
├── package.json
├── next.config.js
├── vercel.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

## カスタム設定

### 日付範囲の変更

`src/utils/invoiceGenerator.ts`の`generateRandomDate`関数を変更:

```typescript
function generateRandomDate(): string {
  const startDate = new Date('2025-04-17'); // 開始日を変更
  const endDate = new Date('2025-06-16');   // 終了日を変更
  // ...
}
```

### 新しい支払方法の追加

`src/utils/invoiceGenerator.ts`の`generatePaymentMethod`関数を変更:

```typescript
function generatePaymentMethod(): string {
  const methods = [
    'American Express - 1116',
    'Visa - 4532',
    // 新しい支払方法を追加
    'PayPal - account@email.com',
  ];
  // ...
}
```

### 請求書金額の変更

`src/utils/invoiceGenerator.ts`の`generateProductInfo`関数を変更:

```typescript
function generateProductInfo(type: InvoiceType): { amount: string; description: string } {
  if (type === InvoiceType.WINDSURF) {
    return {
      amount: '$9.90', // Windsurf金額を変更
      description: 'Windsurf Pro'
    };
  } else {
    return {
      amount: '$25.00', // Cursor金額を変更
      description: 'Cursor Pro'
    };
  }
}
```

## 環境変数

このプロジェクトは現在環境変数を必要とせず、すべての設定は静的です。

## ブラウザ互換性

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## ライセンス

MIT License

## 貢献

このプロジェクトの改善のためのIssueやPull Requestを歓迎します。

## サポート

使用中に問題が発生した場合は以下をご確認ください:

1. このREADMEドキュメントを確認
2. [Next.jsドキュメント](https://nextjs.org/docs)を確認  
3. GitHubリポジトリにIssueを提出