'use client';

import type { Product } from '@/types';

interface ProductSpecsTableProps {
  product: Product;
}

export default function ProductSpecsTable({ product }: ProductSpecsTableProps) {
  // 构建完整的规格列表，包含 B2B 字段
  const specs = [
    // B2B 核心字段 - 优先显示
    ...(product.sku ? [{ key: 'SKU', value: product.sku, highlight: true }] : []),
    ...(product.material ? [{ key: 'Material', value: product.material }] : []),
    ...(product.netWeight !== undefined && product.netWeight !== null 
      ? [{ key: 'Net Weight', value: `${product.netWeight} kg` }] 
      : []),
    ...(product.minOrder !== undefined && product.minOrder !== null && product.minOrder > 0
      ? [{ key: 'MOQ', value: `${product.minOrder} pcs`, important: true }]
      : []),
    
    // 供应商信息（内部使用）
    ...(product.supplierName ? [{ key: 'Supplier', value: product.supplierName }] : []),
    ...(product.brand && product.brand !== product.supplierName ? [{ key: 'Brand', value: product.brand }] : []),
    
    // 其他规格参数
    ...(product.specifications || []).map(spec => ({
      key: spec.specKey,
      value: spec.specValue,
    })),
  ];

  if (specs.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-[#0056B3] to-[#004494]">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Product Specifications
        </h2>
        <p className="text-sm text-blue-100 mt-1">
          Use Supplier SKU for wholesale inquiries via WhatsApp
        </p>
      </div>
      
      <div className="divide-y divide-gray-200">
        {specs.map((spec, index) => (
          <div
            key={index}
            className={`px-6 py-4 flex justify-between items-start hover:bg-gray-50 transition-colors ${
              spec.highlight ? 'bg-blue-50' : ''
            }`}
          >
            <span className={`text-sm font-medium ${
              spec.important ? 'text-[#0056B3]' : 'text-gray-600'
            }`}>
              {spec.key}
              {spec.important && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-[#0056B3]">
                  Important
                </span>
              )}
            </span>
            <span className={`text-sm font-semibold text-[#1A1A1A] ${
              spec.highlight ? 'font-mono text-base' : ''
            }`}>
              {spec.value}
            </span>
          </div>
        ))}
      </div>

      {/* Quick Inquiry CTA */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Need bulk pricing?</span>
            <span className="ml-1">Contact us with the Supplier SKU above</span>
          </div>
          <a
            href="https://wa.me/?text=Hi! I'm interested in your product (SKU: "
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            WhatsApp Inquiry
          </a>
        </div>
      </div>
    </div>
  );
}
