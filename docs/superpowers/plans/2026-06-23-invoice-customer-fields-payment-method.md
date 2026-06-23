# Implementation Plan

## Goal

在发票生成表单中新增可选的姓名、地址、邮编、Payment method 字段，用户填写则使用用户输入，为空则沿用随机生成逻辑。

## Architecture

- 表单新增 4 个可选输入（name, address, zipCode, paymentMethod）传入 `generateRandomInvoice`。
- `generateRandomInvoice` 接受一个可选 options 对象覆盖随机值。
- `BillToInfo` 增加 `zipCode?: string`。
- 两个模板组件在地址区域渲染 zipCode（有值时显示）。
- i18n 3 个语言文件增加新字段 label/placeholder。

## Tasks

### 1. 扩展类型定义

- **File**: `src/types/invoice.ts`
- **Changes**: `BillToInfo` 接口添加 `zipCode?: string`
- **Acceptance**: `npm run build` 无类型错误

### 2. 定义生成器 options 接口并修改签名

- **File**: `src/utils/invoiceGenerator.ts`
- **Changes**:
  - 新增 `InvoiceGeneratorOptions` 接口（或内联类型）：`{ name?: string; address?: string; zipCode?: string; paymentMethod?: string }`
  - `generateRandomInvoice` 第三个参数 `options?: InvoiceGeneratorOptions`
  - `generateBillToInfo` 接受 options，当 `options.name` 非空时用它替代随机 name；`options.address` 非空时用它替代随机 address1（address2/city/state/country 仍随机）；设置 `billTo.zipCode = options.zipCode || undefined`
  - `generatePaymentMethod` 接受可选 `paymentMethodOverride?: string`，非空时返回 `${paymentMethodOverride} - ${randomLast4}`（跳过随机卡类型选择）
- **Acceptance**: `npm run build` 通过；现有调用无需修改（参数可选）

### 3. 写最小自检脚本

- **File**: `scripts/check-generator.ts`（新建）
- **Changes**:
  - 用 `tsx` (已在 devDeps 或用 `npx tsx`) 直接运行
  - import `generateRandomInvoice`，调用 3 种情况：无 options、有 name/address/zipCode、有 paymentMethod = 'Visa'
  - 用 `console.assert` 验证：返回值 name 匹配输入、zipCode 存在、paymentMethod 以 'Visa' 开头
  - 无参数调用仍产出合法 InvoiceData（name 非空、paymentMethod 非空）
- **Acceptance**: `npx tsx scripts/check-generator.ts` 零断言失败、exit 0
- **Note**: 需先完成任务 1、2

### 4. i18n 增加新字段文案

- **Files**: `messages/en.json`, `messages/zh.json`, `messages/ja.json`
- **Changes**: 在顶层增加以下 key：

  ```
  "nameLabel": "Name (optional)"
  "namePlaceholder": "Leave blank for random"
  "addressLabel": "Address (optional)"
  "addressPlaceholder": "Leave blank for random"
  "zipCodeLabel": "Zip Code (optional)"
  "zipCodePlaceholder": "Leave blank for random"
  "paymentMethodLabel": "Payment Method (optional)"
  "paymentMethodPlaceholder": "Random"
  "paymentMethodCustom": "Custom"
  "paymentMethodCustomPlaceholder": "Enter custom payment method"
  ```

  中文/日文做对应翻译。
- **Acceptance**: `npm run build` 通过（next-intl 编译期检查）

### 5. 表单 UI 增加可选字段

- **File**: `src/app/[locale]/page.tsx`
- **Changes**:
  - 新增 state：`customerName`, `customerAddress`, `customerZipCode`, `paymentMethodSelection`（''/Visa/MasterCard/American Express/Discover/custom）, `customPaymentMethod`
  - 在 Invoice 类型选择器下方、邮箱输入上方，增加一行可选输入（name + address + zipCode），使用 Tailwind grid/flex
  - 邮箱输入下方增加 Payment method 下拉（`<select>`），选项：空（随机）、Visa、MasterCard、American Express、Discover、Custom
  - 当选 Custom 时显示文本输入框
  - `handleGenerateInvoice` 中组装 options 传入 `generateRandomInvoice`：
    - `name`: customerName.trim() || undefined
    - `address`: customerAddress.trim() || undefined
    - `zipCode`: customerZipCode.trim() || undefined
    - `paymentMethod`: selection === 'custom' ? (customPaymentMethod.trim() || undefined) : (selection || undefined)
- **Acceptance**: `npm run build` 通过；`npm run dev` 页面正常渲染，填入值后生成的发票使用用户输入

### 6. 模板渲染 zipCode

- **Files**: `src/components/WindsurfInvoice.tsx`, `src/components/CursorInvoice.tsx`
- **Changes**: 在 `data.billTo.address2` 行之后、`data.billTo.city` 行之前，条件渲染 `{data.billTo.zipCode && <p>{data.billTo.zipCode}</p>}`
- **Acceptance**: `npm run build` 通过；生成带 zipCode 的发票时在地址区域正确显示

### 7. 全局验证

- `npm run lint` 通过
- `npm run build` 通过
- `npx tsx scripts/check-generator.ts` 通过
- 手动 `npm run dev` 确认：空表单→随机、填部分→使用输入、Payment method 各选项正常

## Files to Modify

- `src/types/invoice.ts` — 增加 `zipCode?: string`
- `src/utils/invoiceGenerator.ts` — 增加 options 参数，覆盖随机逻辑
- `src/app/[locale]/page.tsx` — 表单增加 4 个可选输入 + 传参
- `src/components/WindsurfInvoice.tsx` — 渲染 zipCode
- `src/components/CursorInvoice.tsx` — 渲染 zipCode
- `messages/en.json` — 新增 i18n key
- `messages/zh.json` — 新增 i18n key
- `messages/ja.json` — 新增 i18n key

## New Files

- `scripts/check-generator.ts` — 最小 assert 自检脚本，验证 generator 逻辑
- `docs/superpowers/plans/2026-06-23-invoice-customer-fields-payment-method.md` — 本计划

## Dependencies

- Task 3 depends on Task 1 + 2
- Task 5 depends on Task 2 + 4
- Task 6 depends on Task 1
- Task 7 depends on all above
- Tasks 1, 2, 4 可并行
- Task 6 可与 Task 5 并行（仅依赖 Task 1）

## Risks

1. **`npx tsx` 可用性**: 项目未必安装 `tsx`。回退方案：用 `npx tsx` (npx 自动下载) 或改为 `.mjs` + 相对路径 import（需 tsconfig paths 解析）。建议先 `npx tsx --version` 确认可运行。
2. **next-intl 严格模式**: 若启用了 key 完整性检查，漏加任何语言的 key 会导致 build 失败。确保三个文件 key 一致。
3. **PaymentMethod 自定义值格式**: 当前 `generatePaymentMethod` 返回格式为 `CardType - 1234`。若用户选了具体卡类型（如 Visa），生成器应输出 `Visa - XXXX`（保留随机后四位）。若用户选了 Custom 并输入完整字符串（如 `PayPal`），应直接使用该字符串不追加后四位。实现时需区分这两种情况。
4. **不提交 Git**: 计划明确不包含 git commit 步骤。
