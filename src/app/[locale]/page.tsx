/**
 * 主页面组件
 * 提供Invoice生成功能，支持多语言界面
 */

'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import WindsurfInvoice from '@/components/WindsurfInvoice';
import CursorInvoice from '@/components/CursorInvoice';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { generateRandomInvoice } from '@/utils/invoiceGenerator';
import { InvoiceData, InvoiceType } from '@/types/invoice';

export default function Home() {
  const t = useTranslations();
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [invoiceType, setInvoiceType] = useState<InvoiceType>(InvoiceType.WINDSURF);

  /**
   * 验证邮箱格式
   */
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * 处理生成Invoice
   */
  const handleGenerateInvoice = () => {
    setEmailError('');

    if (!email.trim()) {
      setEmailError(t('errors.emailRequired'));
      return;
    }

    if (!validateEmail(email.trim())) {
      setEmailError(t('errors.emailInvalid'));
      return;
    }

    const newInvoice = generateRandomInvoice(email.trim(), invoiceType);
    setInvoiceData(newInvoice);
  };

  /**
   * 处理打印PDF
   */
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 控制面板 */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4 print:hidden">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
              <p className="text-gray-600">{t('subtitle')}</p>
            </div>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
              {invoiceData && (
                <button
                  onClick={handlePrint}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  {t('printButton')}
                </button>
              )}
            </div>
          </div>

          {/* Invoice类型选择器 */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              {t('invoiceType')}
            </label>
            <div className="flex gap-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="invoiceType"
                  value={InvoiceType.WINDSURF}
                  checked={invoiceType === InvoiceType.WINDSURF}
                  onChange={(e) => setInvoiceType(e.target.value as InvoiceType)}
                  className="mr-2 text-blue-600"
                />
                <span className="text-sm text-gray-700">{t('windsurfInvoice')}</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="invoiceType"
                  value={InvoiceType.CURSOR}
                  checked={invoiceType === InvoiceType.CURSOR}
                  onChange={(e) => setInvoiceType(e.target.value as InvoiceType)}
                  className="mr-2 text-blue-600"
                />
                <span className="text-sm text-gray-700">{t('cursorInvoice')}</span>
              </label>
            </div>
          </div>

          {/* 邮箱输入区域 */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
            <div className="flex-1 max-w-md">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                {t('emailLabel')} <span className="text-red-500">{t('emailRequired')}</span>
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('emailPlaceholder')}
                className={`w-full px-3 py-2 border rounded-lg text-gray-900 placeholder-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  emailError ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {emailError && (
                <p className="mt-1 text-sm text-red-600">{emailError}</p>
              )}
            </div>
            <button
              onClick={handleGenerateInvoice}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors whitespace-nowrap"
            >
              {t('generateButton')}
            </button>
          </div>
        </div>
      </div>

      {/* Invoice显示区域 */}
      <div className="py-2">
        {invoiceData ? (
          invoiceData.type === InvoiceType.CURSOR ? (
            <CursorInvoice data={invoiceData} />
          ) : (
            <WindsurfInvoice data={invoiceData} />
          )
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-center max-w-md">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">{t('noInvoiceTitle')}</h3>
              <p className="mt-1 text-sm text-gray-500">
                {t('noInvoiceDesc')}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 功能说明 */}
      <div className="bg-white border-t border-gray-200 p-6 print:hidden">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('featuresTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">{t('randomDataTitle')}</h3>
              <p className="text-sm text-gray-600">
                {t('randomDataDesc')}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">{t('pdfExportTitle')}</h3>
              <p className="text-sm text-gray-600">
                {t('pdfExportDesc')}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">{t('templatesTitle')}</h3>
              <p className="text-sm text-gray-600">
                {t('templatesDesc')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}