import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async ({locale}) => {
  // 返回最小配置，实际翻译在 layout 中处理
  return {
    locale: locale || 'zh',
    messages: {}
  };
});