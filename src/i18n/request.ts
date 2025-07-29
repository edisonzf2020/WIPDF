import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';

// Can be imported from a shared config
const locales = ['zh', 'en', 'ja'] as const;

export default getRequestConfig(async ({locale}) => {
  // Ensure locale is defined and valid
  if (!locale || !locales.includes(locale as 'zh' | 'en' | 'ja')) {
    notFound();
  }

  // Now TypeScript knows locale is defined and valid
  const validLocale = locale as 'zh' | 'en' | 'ja';

  return {
    locale: validLocale,
    messages: (await import(`../../messages/${validLocale}.json`)).default
  };
});