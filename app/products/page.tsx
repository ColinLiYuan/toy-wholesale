'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { productService } from '@/services';
import type { Product, ProductListResponse } from '@/types';
import { categories, findCategoryBySlug, getParentCategory } from '@/lib/categories';
import WholesaleFilter from '@/components/WholesaleFilter';
import WholesaleBreadcrumbs from '@/components/WholesaleBreadcrumbs';
import type { WholesaleFilters } from '@/components/WholesaleFilter';
import { useAuth } from '@/contexts/AuthContext';

export default function ProductsPage() {
  const { isAuthenticated, user } = useAuth();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || 'all');
  const [wholesaleFilters, setWholesaleFilters] = useState<WholesaleFilters>({});
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    hasNext: false,
    hasPrevious: false,
  });

  // 监听 URL 参数变化，更新选中分类
  useEffect(() => {
    const newCategory = categoryParam || 'all';
    setSelectedCategory(newCategory);
  }, [categoryParam]);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, wholesaleFilters]);

  const fetchProducts = async (page: number = 0) => {
    try {
      setLoading(true);
      console.log('Fetching products, page:', page, 'category:', selectedCategory, 'filters:', wholesaleFilters);
      
      // 调用 API 时带上 distributorId（如果已登录）
      const response: ProductListResponse = await productService.getProducts(page, 12);
      
      if (!response || !response.content) {
        throw new Error('Invalid API response');
      }
      
      // 根据分类筛选
      let filteredProducts = response.content;
      if (selectedCategory !== 'all' && selectedCategory) {
        filteredProducts = response.content.filter(product => {
          // 解析 categories（可能是 JSON 字符串）
          let cats: string[] = [];
          if (typeof product.categories === 'string') {
            try {
              cats = JSON.parse(product.categories);
            } catch {
              cats = [];
            }
          } else if (Array.isArray(product.categories)) {
            cats = product.categories;
          }
          
          // 精确匹配分类
          return cats.some(cat => cat.toLowerCase() === selectedCategory.toLowerCase());
        });
      }
      
      console.log('Filtered products count:', filteredProducts.length, 'Total:', response.content.length);
      
      // TODO: 根据 B2B 筛选条件过滤（材质、重量等）
      if (wholesaleFilters.materials && wholesaleFilters.materials.length > 0) {
        filteredProducts = filteredProducts.filter(product =>
          product.material && wholesaleFilters.materials?.includes(product.material)
        );
      }
      
      if (wholesaleFilters.weightRange) {
        filteredProducts = filteredProducts.filter(product => {
          if (!product.netWeight) return false;
          const range = wholesaleFilters.weightRange!;
          if (range === '0-1') return product.netWeight < 1;
          if (range === '1-2') return product.netWeight >= 1 && product.netWeight < 2;
          if (range === '2-5') return product.netWeight >= 2 && product.netWeight < 5;
          if (range === '5+') return product.netWeight >= 5;
          return true;
        });
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

      {/* Main Content Layout with Sidebar */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-[#F8F9FA] border border-gray-200 rounded-lg text-[#1A1A1A] font-medium"
            >
              <span>Filters & Categories</span>
              <svg
                className={`w-5 h-5 transition-transform ${isMobileSidebarOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          <div className="flex gap-8">
            {/* Left Sidebar - Desktop */}
            <div className="hidden lg:block flex-shrink-0">
              <WholesaleFilter 
                selectedCategory={selectedCategory === 'all' ? undefined : selectedCategory}
                onFilterChange={(filters) => {
                  setWholesaleFilters(filters);
                }}
              />
            </div>

            {/* Mobile Sidebar Overlay */}
            {isMobileSidebarOpen && (
              <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setIsMobileSidebarOpen(false)}>
                <div className="absolute left-0 top-0 bottom-0 w-80 bg-white overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-lg font-bold">Filters</h2>
                    <button onClick={() => setIsMobileSidebarOpen(false)}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <WholesaleFilter 
                    selectedCategory={selectedCategory === 'all' ? undefined : selectedCategory}
                    onFilterChange={(filters) => {
                      setWholesaleFilters(filters);
                      setIsMobileSidebarOpen(false);
                    }}
                  />
                </div>
              </div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 min-w-0">
              {/* Breadcrumbs */}
              <WholesaleBreadcrumbs currentCategory={selectedCategory === 'all' ? undefined : selectedCategory} />

              {/* Products Grid */}
              <div className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                      SKU: <span className="font-mono text-[#1A1A1A] font-semibold">{product.sku}</span>
                    </div>
                  )}

                  {/* Material & Weight - B2B Specs */}
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

                  {/* Price & Margin */}
                  <div className="pt-4 border-t border-gray-100">
                    {/* 未登录显示提示 */}
                    {!isAuthenticated ? (
                      <div className="mb-2 p-3 bg-[#F8F9FA] border border-gray-200 rounded-lg">
                        <p className="text-sm text-[#6C757D] text-center">
                          🔒 Price hidden,{' '}
                          <span 
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              window.location.href = '/login';
                            }}
                            className="text-[#0056B3] font-semibold hover:underline cursor-pointer"
                          >
                            Login to View
                          </span>
                        </p>
                      </div>
                    ) : (
                      <>
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
                      </>
                    )}

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
              </div>
            </div>
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
