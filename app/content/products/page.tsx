'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { productService } from '@/services';
import type { Product, ProductListResponse } from '@/types';

// 成人用品分类
const productCategories = [
  { id: 'all', name: 'All Products' },
  { id: 'vibrators', name: 'Vibrators' },
  { id: 'male-masturbators', name: 'Male Masturbators' },
  { id: 'bdsm', name: 'BDSM & Bondage' },
  { id: 'couples', name: 'Couples Play' },
  { id: 'lingerie', name: 'Lingerie' },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    hasNext: false,
    hasPrevious: false,
  });

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async (page: number = 0) => {
    try {
      setLoading(true);
      console.log('Fetching products, page:', page, 'category:', selectedCategory);
      const response: ProductListResponse = await productService.getProducts(page, 12);
      
      if (!response || !response.content) {
        throw new Error('Invalid API response');
      }
      
      // 根据分类筛选
      let filteredProducts = response.content;
      if (selectedCategory !== 'all') {
        filteredProducts = response.content.filter(product => 
          product.categories && Array.isArray(product.categories) && 
          product.categories.some(cat => cat.toLowerCase().includes(selectedCategory))
        );
      }
      
      setProducts(filteredProducts);
      setPagination({
        currentPage: response.currentPage ?? 0,
        totalPages: response.totalPages ?? 0,
        totalElements: response.totalElements ?? 0,
        hasNext: response.hasNext ?? false,
        hasPrevious: response.hasPrevious ?? false,
      });
    } catch (err) {
      console.error('Fetch products error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    fetchProducts(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 获取图片完整 URL（使用 Cloudflare R2 CDN）
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '/placeholder-product.svg';
    if (imagePath.startsWith('http')) return imagePath;
    return `https://pub-e5d14c6d386c4d90979458082617517a.r2.dev/${imagePath}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#0056B3] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={() => fetchProducts()}
            className="px-6 py-2 bg-[#0056B3] text-white rounded-lg font-medium hover:bg-[#004494] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-[#F8F9FA] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-[#1A1A1A] mb-6">
              Shop Wholesale Adult Toys
            </h1>
            <p className="text-xl text-[#6C757D] max-w-3xl mx-auto">
              Browse our curated collection of premium adult wellness products. Low MOQ, competitive pricing, fast shipping.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-6 bg-white border-b border-gray-200 sticky top-20 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {productCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2.5 rounded-lg whitespace-nowrap transition-all flex-shrink-0 ${
                  selectedCategory === category.id
                    ? 'bg-[#0056B3] text-white font-semibold shadow-md'
                    : 'border border-gray-300 text-[#6C757D] hover:border-[#0056B3] hover:text-[#0056B3] hover:bg-[#F8F9FA]'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                {/* Badge */}
                {product.badge && (
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#0056B3] text-white shadow-md">
                      {product.badge}
                    </span>
                  </div>
                )}

                {/* Product Image - 占 70% 面积 */}
                <div className="relative aspect-[4/3] bg-[#F8F9FA] overflow-hidden">
                  <img
                    src={getImageUrl(product.image)}
                    alt={product.alt || product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-product.svg';
                    }}
                  />
                </div>

                {/* Product Info */}
                <div className="p-6 space-y-4">
                  {/* Title */}
                  <h3 className="text-lg font-bold text-[#1A1A1A] group-hover:text-[#0056B3] transition-colors line-clamp-2 min-h-[56px] leading-tight">
                    {product.title}
                  </h3>

                  {/* SKU */}
                  {product.sku && (
                    <div className="text-sm text-[#6C757D]">
                      SKU: <span className="font-mono text-[#1A1A1A]">{product.sku}</span>
                    </div>
                  )}

                  {/* Price & Margin */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-baseline gap-3 mb-2">
                      {product.originalPrice !== undefined && product.originalPrice !== null && product.originalPrice > product.currentPrice && (
                        <span className="text-base text-gray-400 line-through">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                      <span className="text-2xl font-bold text-[#0056B3]">
                        ${product.currentPrice.toFixed(2)}
                      </span>
                    </div>
                    
                    {/* Est. Margin */}
                    <div className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      <span className="text-green-600 font-medium">Est. Margin: 60%</span>
                    </div>

                    {/* MOQ */}
                    {product.minOrder !== undefined && product.minOrder !== null && product.minOrder > 0 && (
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100">
                        <svg className="w-4 h-4 text-[#6C757D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <p className="text-sm text-[#6C757D]">
                          MOQ: <span className="font-semibold text-[#1A1A1A]">{product.minOrder} pcs</span>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* CTA Button */}
                  <button className="w-full py-3 rounded-lg bg-[#0056B3] text-white font-semibold hover:bg-[#004494] transition-colors duration-200">
                    Request Quote
                  </button>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-16 flex items-center justify-center space-x-4">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrevious}
                className="px-6 py-3 rounded-lg border border-gray-300 text-[#1A1A1A] hover:bg-[#F8F9FA] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              <div className="flex items-center space-x-2">
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let pageNum;
                  if (pagination.totalPages <= 5) {
                    pageNum = i;
                  } else if (pagination.currentPage <= 2) {
                    pageNum = i;
                  } else if (pagination.currentPage >= pagination.totalPages - 3) {
                    pageNum = pagination.totalPages - 5 + i;
                  } else {
                    pageNum = pagination.currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                        pagination.currentPage === pageNum
                          ? 'bg-[#0056B3] text-white'
                          : 'border border-gray-300 text-[#1A1A1A] hover:bg-[#F8F9FA]'
                      }`}
                    >
                      {pageNum + 1}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNext}
                className="px-6 py-3 rounded-lg border border-gray-300 text-[#1A1A1A] hover:bg-[#F8F9FA] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}

          {/* Empty State */}
          {products.length === 0 && (
            <div className="text-center py-16">
              <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <p className="text-[#6C757D] text-lg mb-2">No products found in this category</p>
              <p className="text-gray-400 text-sm">Try selecting a different category or browse all products</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
