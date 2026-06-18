import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Product Catalog Download — Wholesale Price List',
  description: 'Download our latest product catalog with SKUs, images, dimensions, weight, materials and wholesale pricing. 62 products across 3 categories.',
  keywords: ['product catalog', 'wholesale price list', 'adult toys catalog', 'product specifications', 'bulk pricing'],
  openGraph: {
    title: 'Product Catalog Download — Wholesale Price List',
    description: 'Download the complete product catalog with specifications and wholesale pricing',
    type: 'website',
    images: [
      {
        url: 'https://pub-e5d14c6d386c4d90979458082617517a.r2.dev/toy/home_product.jpg',
        width: 1200,
        height: 630,
        alt: 'Silvibe - Product Catalog Download',
      },
    ],
  },
  alternates: {
    canonical: '/catalog',
  },
};

export default function ProductCatalogPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-surface border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-text-primary mb-6">
              产品目录下载
            </h1>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              下载最新产品报价单，包含完整的产品信息
            </p>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-full mb-4">
                <svg 
                  className="w-10 h-10 text-brand" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-text-primary mb-4">
                产品目录 Excel
              </h2>
              <p className="text-lg text-text-secondary mb-6">
                包含产品编号、名称、分类、尺寸、重量、材质、价格等完整信息
              </p>
            </div>

            {/* File Info */}
            <div className="bg-surface rounded-xl p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-text-secondary mb-1">文件格式</p>
                  <p className="text-lg font-semibold text-text-primary">Excel (.xlsx)</p>
                </div>
                <div>
                  <p className="text-sm text-text-secondary mb-1">产品数量</p>
                  <p className="text-lg font-semibold text-text-primary">62 个产品</p>
                </div>
                <div>
                  <p className="text-sm text-text-secondary mb-1">文件大小</p>
                  <p className="text-lg font-semibold text-text-primary">约 50 KB</p>
                </div>
              </div>
            </div>

            {/* Included Fields */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-text-primary mb-4">包含字段：</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  '产品编号',
                  '产品名称',
                  '产品分类',
                  '产品尺寸',
                  '产品重量',
                  '产品材质',
                  '产品价格',
                ].map((field) => (
                  <div 
                    key={field}
                    className="flex items-center gap-2 px-4 py-3 bg-blue-50 rounded-lg"
                  >
                    <svg 
                      className="w-5 h-5 text-brand" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                    <span className="text-sm font-medium text-text-primary">{field}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Download Button */}
            <div className="text-center">
              <a
                href="/产品目录.xlsx"
                download
                className="inline-flex items-center gap-3 px-8 py-4 bg-brand text-white rounded-xl font-semibold text-lg hover:bg-brand-hover transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <svg 
                  className="w-6 h-6" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" 
                  />
                </svg>
                立即下载产品目录
              </a>
              <p className="mt-4 text-sm text-text-secondary">
                点击按钮即可下载 Excel 文件
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 bg-surface rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
              <svg 
                className="w-5 h-5 text-brand" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path 
                  fillRule="evenodd" 
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
                  clipRule="evenodd" 
                />
              </svg>
              温馨提示
            </h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="text-brand mt-1">•</span>
                <span>产品目录包含 62 个产品，分为三个类别</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand mt-1">•</span>
                <span>产品分类包括：Electric Silicone Dildo（电动硅胶阳具）、Manual Silicone Dildo（手动硅胶阳具）、Transgender Products（人妖产品）</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand mt-1">•</span>
                <span>产品价格和库存可能随时变动，请以实际询价为准</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand mt-1">•</span>
                <span>如需批量采购或定制服务，请联系我们的销售团队</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand mt-1">•</span>
                <span>最小起订量（MOQ）请参考具体产品要求</span>
              </li>
            </ul>
          </div>

          {/* Back to Products */}
          <div className="mt-8 text-center">
            <Link 
              href="/products"
              className="inline-flex items-center gap-2 text-brand hover:text-brand-hover font-medium transition-colors"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M10 19l-7-7m0 0l7-7m-7 7h18" 
                />
              </svg>
              返回产品列表
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
