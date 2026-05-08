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
  };
}

export default function ProductCardClient({ product }: ProductCardClientProps) {
  const handleAddToInquiry = () => {
    const minOrder = product.minOrder || 1;
    inquiryCartUtils.addItem({
      productId: product.id,
      productName: product.title,
      productImage: product.image,
      quantity: minOrder,
    });
    alert(`✅ Added to Inquiry Cart!\n\nProduct: ${product.title}\nMOQ: ${minOrder} pcs\n\nYou can submit inquiry from the Inquiry Cart.`);
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '/placeholder-product.svg';
    if (imagePath.startsWith('http')) return imagePath;
    return `https://pub-e5d14c6d386c4d90979458082617517a.r2.dev/${imagePath}`;
  };

  return (
    <div className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      {product.badge && (
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#0056B3] text-white shadow-md">
            {product.badge}
          </span>
        </div>
      )}

      <Link href={`/products/${product.slug}`} className="block relative aspect-[4/3] bg-[#F8F9FA] overflow-hidden">
        <ProductImage
          src={getImageUrl(product.image)}
          alt={product.alt || product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
                <span className="text-green-700 font-semibold">{product.netWeight}kg</span>
              </span>
            )}
          </div>
        )}

        <div className="pt-4 border-t border-gray-100">
          {product.minOrder !== undefined && product.minOrder !== null && product.minOrder > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-4 h-4 text-[#6C757D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <p className="text-sm text-[#6C757D]">
                MOQ: <span className="font-semibold text-[#1A1A1A]">{product.minOrder} pcs</span>
              </p>
            </div>
          )}
        </div>

        <button
          onClick={handleAddToInquiry}
          className="block w-full py-3 rounded-lg bg-[#0056B3] text-white font-semibold text-center hover:bg-[#004494] transition-colors duration-200"
        >
          Add to Inquiry
        </button>
      </div>
    </div>
  );
}