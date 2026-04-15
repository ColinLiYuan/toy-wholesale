// R2 资源库配置
export const R2_BASE_URL = 'https://pub-e5d14c6d386c4d90979458082617517a.r2.dev';

// 图片路径前缀
export const IMAGE_PATHS = {
  products: '/print',
  industry: '/industry',
  showcase: '/showcase',
};

// 获取完整图片 URL
export const getImageUrl = (path: string): string => {
  return `${R2_BASE_URL}${path}`;
};
