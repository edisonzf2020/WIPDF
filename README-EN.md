# WIPDF - Random Invoice Generator

[中文](README.md) | **English** | [日本語](README-JA.md)

A web application that supports generating random invoice data for Windsurf and Cursor invoice templates with PDF export functionality.

## Features

- 🎲 **Random Data Generation**: Automatically generates invoice numbers, receipt numbers, payment methods, billing information, and billing dates
- 📄 **PDF Export**: Supports saving generated invoices as PDF files
- 🎨 **Multiple Templates**: Supports both Windsurf and Cursor invoice templates, maintaining original styles and layouts
- 📱 **Responsive Design**: Adapts to different screen sizes
- ⚡ **Quick Deploy**: Supports one-click deployment to Vercel
- 🔄 **Type Switching**: Easy switching between different invoice types in the interface
- 🌐 **Internationalization**: Supports Chinese, English, and Japanese interface languages

## Randomly Generated Data Fields

1. **Invoice number**: 8-character hex + 4-digit number format
2. **Receipt number**: 4-digit + 4-digit number format
3. **Payment method**: Random credit card type and last four digits
4. **Billing information**: Including name, address, city, state/province, country (email uses user input)
5. **Billing date**: Random generation between April 17, 2025, and June 16, 2025

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom CSS
- **Internationalization**: next-intl
- **Deployment**: Vercel
- **Package Manager**: npm

## Quick Start

### Local Development

1. **Clone the project**
   ```bash
   git clone <your-repo-url>
   cd WIPDF/invoice-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   Open your browser and visit [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 🚀 Deployment Guide

### Quick Deploy to Vercel

#### Step 1: Fork the Project

1. **Visit the project repository**
   - Go to [WIPDF project page](https://github.com/Sirhexs/WIPDF)
   - Click the "Fork" button in the top right corner

#### Step 2: Deploy to Vercel

1. **Login to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Login with your GitHub account

2. **Import project**
   - Click "New Project"
   - Select your forked `WIPDF` repository
   - Click "Import"

3. **Start deployment**
   - Click the "Deploy" button
   - Wait 1-3 minutes for the build to complete
   - Get your project access link

## Usage Instructions

### Generate New Invoice

1. **Select invoice type**: Choose the invoice type to generate at the top of the page
   - **Windsurf Invoice**: $6.90 Windsurf Pro subscription
   - **Cursor Invoice**: $20.00 Cursor Pro subscription
2. Enter the recipient's email address in the email input field (required)
3. Click the "Generate New Invoice" button
4. The system will automatically generate a new invoice with random data and the specified email
5. The invoice will be displayed immediately on the page, with styles automatically adjusting based on the selected type

**Note**: Email address is a required field. If not entered or in incorrect format, the system will display an error message and prevent invoice generation.

### Export PDF

1. After generating an invoice, click the "Print/Save PDF" button
2. In the print dialog, select "Save as PDF"
3. Choose a save location to download the PDF file

## Project Structure

```
WIPDF/
├── src/
│   ├── app/
│   │   ├── [locale]/           # Internationalized routing
│   │   │   ├── page.tsx        # Multi-language main page
│   │   │   └── layout.tsx      # Multi-language layout component
│   │   ├── page.tsx            # Root page redirect
│   │   ├── layout.tsx          # Root layout component
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── WindsurfInvoice.tsx # Windsurf invoice component
│   │   ├── CursorInvoice.tsx   # Cursor invoice component
│   │   └── LanguageSwitcher.tsx # Language switcher component
│   ├── i18n/
│   │   ├── routing.ts          # Internationalization routing config
│   │   └── request.ts          # Internationalization request config
│   ├── types/
│   │   └── invoice.ts          # TypeScript type definitions
│   └── utils/
│       └── invoiceGenerator.ts # Invoice data generator
├── messages/                   # Internationalization translation files
│   ├── zh.json                 # Chinese translations
│   ├── en.json                 # English translations
│   └── ja.json                 # Japanese translations
├── public/
│   ├── windsurf-logo.png       # Windsurf Logo
│   └── cursor-logo.png         # Cursor Logo
├── middleware.ts               # Next.js middleware
├── package.json
├── next.config.ts
├── vercel.json
├── tailwind.config.ts
├── tsconfig.json
├── README.md                   # Chinese documentation
├── README-EN.md                # English documentation
└── README-JA.md                # Japanese documentation
```

## Custom Configuration

### Modify Date Range

Modify the `generateRandomDate` function in `src/utils/invoiceGenerator.ts`:

```typescript
function generateRandomDate(): string {
  const startDate = new Date('2025-04-17'); // Modify start date
  const endDate = new Date('2025-06-16');   // Modify end date
  // ...
}
```

### Add New Payment Methods

Modify the `generatePaymentMethod` function in `src/utils/invoiceGenerator.ts`:

```typescript
function generatePaymentMethod(): string {
  const methods = [
    'American Express - 1116',
    'Visa - 4532',
    // Add new payment methods
    'PayPal - account@email.com',
  ];
  // ...
}
```

### Modify Invoice Amounts

Modify the `generateProductInfo` function in `src/utils/invoiceGenerator.ts`:

```typescript
function generateProductInfo(type: InvoiceType): { amount: string; description: string } {
  if (type === InvoiceType.WINDSURF) {
    return {
      amount: '$9.90', // Modify Windsurf amount
      description: 'Windsurf Pro'
    };
  } else {
    return {
      amount: '$25.00', // Modify Cursor amount
      description: 'Cursor Pro'
    };
  }
}
```

## Environment Variables

The project currently doesn't require any environment variables, all configurations are static.

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT License

## Contributing

Issues and Pull Requests are welcome to improve this project.

## Support

If you encounter any issues while using this project, please:

1. Check this README documentation
2. Review [Next.js documentation](https://nextjs.org/docs)
3. Submit an Issue to the GitHub repository