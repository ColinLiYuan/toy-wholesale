import type { Metadata } from 'next';

interface VerifyPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: VerifyPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  
  return {
    title: isEn 
      ? 'Product Inquiry - Request Wholesale Pricing | LuxeAdult Wholesale'
      : '产品咨询 - 获取批发报价 | LuxeAdult 批发',
    description: isEn
      ? 'Request wholesale pricing, product catalogs, and bulk quotes for premium adult wellness products. Low MOQ and fast global shipping.'
      : '申请成人健康产品批发价格、产品目录和批量报价。低起订量和快速全球发货。',
    keywords: isEn
      ? ['product inquiry', 'wholesale pricing', 'bulk quote', 'adult toys catalog', 'business partnership', 'low MOQ']
      : ['产品咨询', '批发价格', '批量报价', '成人玩具目录', '商业合作', '低起订量'],
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: `https://luxeadult.com/${locale}/verify`,
    },
  };
}
