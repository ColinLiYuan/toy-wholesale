'use client';

import { inquiryCartUtils } from '@/lib/inquiry-cart';
import ProductImage from './ProductImage';
import Link from 'next/link';

interface ProductCardClientProps {
  product: {
    id: number;
    title: string;
    slug: string;
    image: string;
    alt?: string;
    badge?: string;
    sku?: string;
    material?: string;
    netWeight?: number;
    minOrder?: number;
    features?: any;
    featuresParsed?: any;
    shortDescription?: string;
    productSkus?: Array<{ id?: number; sku: string; color?: string }>;
  };
}

export default function ProductCardClient({ product }: ProductCardClientProps) {
  // 获取第一个 SKU ID
  const firstSkuId = product.productSkus?.[0]?.id;

  const handleAddToInquiry = () => {
    const minOrder = product.minOrder || 1;
    inquiryCartUtils.addItem({
      productId: product.id,
      productName: product.title,
      productImage: product.image,
      quantity: minOrder,
      skuId: firstSkuId,
      skuCode: product.sku || product.productSkus?.[0]?.sku,
      color: product.productSkus?.[0]?.color,
    });
    alert(`✅ Added to Inquiry Cart!\n\nProduct: ${product.title}\nMOQ: ${minOrder} pcs\n\nYou can submit inquiry from the Inquiry Cart.`);
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '/placeholder-product.svg';
    if (imagePath.startsWith('http')) return imagePath;
    return `https://pub-e5d14c6d386c4d90979458082617517a.r2.dev/${imagePath}`;
  };

  // 解析产品特点
  const featuresObj = product.featuresParsed || product.features;
  let features: [string, string][] = [];

  if (featuresObj) {
    // 如果是数组，转换为键值对格式
    if (Array.isArray(featuresObj)) {
      features = featuresObj
        .filter((item: any) => item !== null && item !== undefined && item !== '')
        .map((item: any, index: number): [string, string] => [`Feature ${index + 1}`, String(item)])
        .slice(0, 3);
    } 
    // 如果是对象，提取键值对
    else if (typeof featuresObj === 'object') {
      const featureEntries = Object.entries(featuresObj).filter(([_, v]) => v);
      features = featureEntries.slice(0, 3).map(([k, v]): [string, string] => [String(k), String(v)]);
    }
  }

  // 从短描述解析特点（备选方案）
  const shortFeatures = product.shortDescription 
    ? product.shortDescription.split(';').filter(f => f.trim()).slice(0, 3)
    : [];

  return (
    <div className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {product.badge && (
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#0056B3] text-white shadow-md">
            {product.badge}
          </span>
        </div>
      )}

      <Link href={`/products/${product.slug}`} className="block relative aspect-square bg-[#F8F9FA] overflow-hidden">
        <ProductImage
          src={getImageUrl(product.image)}
          alt={product.alt || product.title}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      <div className="p-6 space-y-4">
        <Link href={`/products/${product.slug}`} className="block">
          <h3 className="text-lg font-bold text-[#1A1A1A] group-hover:text-[#0056B3] transition-colors leading-tight">
            {product.title}
          </h3>
        </Link>

        {product.sku && (
          <div className="text-sm text-[#6C757D]">
            SKU: <span className="font-mono text-[#1A1A1A] font-semibold">{product.sku}</span>
          </div>
        )}

        {(product.material || product.netWeight !== undefined) && (
          <div className="flex flex-wrap gap-2 text-xs">
            {product.material && (
              <span className="inline-flex items-center px-2 py-1 bg-blue-50 rounded">
                <span className="text-[#6C757D] mr-1">Material:</span>
                <span className="text-[#0056B3] font-semibold">{product.material}</span>
              </span>
            )}
            {product.netWeight !== undefined && product.netWeight !== null && (
              <span className="inline-flex items-center px-2 py-1 bg-green-50 rounded">
                <span className="text-[#6C757D] mr-1">Weight:</span>
                <span className="text-green-700 font-semibold">{product.netWeight}g</span>
              </span>
            )}
          </div>
        )}

        {/* 产品特点 */}
        {(features.length > 0 || shortFeatures.length > 0) && (
          <div className="pt-3 border-t border-gray-100">
            <ul className="space-y-1.5">
              {features.map(([key, value], index) => (
                <li key={index} className="text-xs" style={{ color: '#666666', fontSize: '14px', lineHeight: '1.5' }}>
                  <span className="font-semibold">{key}:</span> {String(value)}
                </li>
              ))}
              {features.length === 0 && shortFeatures.map((feature, index) => (
                <li key={index} className="text-xs" style={{ color: '#666666', fontSize: '14px', lineHeight: '1.5' }}>
                  {feature.trim()}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="pt-4 border-t border-gray-100">
          {product.minOrder !== undefined && product.minOrder !== null && product.minOrder > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-4 h-4 text-[#6C757D]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <p className="text-sm text-[#6C757D]">
                MOQ: <span className="font-semibold text-[#1A1A1A]">{product.minOrder} pcs</span>
              </p>
            </div>
          )}
        </div>

        <button
          onClick={handleAddToInquiry}
          className="block w-full py-3 text-white font-semibold text-center transition-colors duration-200"
          style={{ 
            backgroundColor: '#6C5CE7',
            borderRadius: '6px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#5B4BC4';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#6C5CE7';
          }}
        >
          Add to Inquiry
        </button>
      </div>
    </div>
  );
}