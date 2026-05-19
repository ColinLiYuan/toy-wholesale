import type { Metadata } from 'next';

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';
  
  return {
    title: isEn 
      ? 'Contact Us - LuxeAdult Wholesale Adult Toys'
      : '联系我们 - LuxeAdult 成人玩具批发',
    description: isEn
      ? 'Get in touch with our sales team. Request wholesale catalogs, bulk pricing, or shipping quotes for your retail or e-commerce business.'
      : '联系我们的销售团队。获取批发目录、批量定价或运费报价。',
    keywords: isEn
      ? ['contact', 'wholesale inquiry', 'bulk pricing', 'business partnership', 'customer support', 'adult toys supplier']
      : ['联系', '批发咨询', '批量定价', '商业合作', '客户支持', '成人玩具供应商'],
    openGraph: {
      title: isEn ? 'Contact LuxeAdult Wholesale' : '联系 LuxeAdult 批发',
      description: isEn
        ? 'Connect with our wholesale specialists team'
        : '与我们的批发专业团队联系',
      type: 'website',
    },
    alternates: {
      canonical: `https://www.adult-toy-wholesale.com/contact`,
    },
  };
}
