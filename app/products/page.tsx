import { productService } from '@/services';
import type { Product, ProductListResponse } from '@/types';
import { categories, findCategoryBySlug, getParentCategory } from '@/lib/categories';
import WholesaleBreadcrumbs from '@/components/WholesaleBreadcrumbs';
import WholesaleFilter from '@/components/WholesaleFilter';
import ProductCardClient from '@/components/ProductCardClient';
import PaginationClient from '@/components/PaginationClient';
import Link from 'next/link';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Wholesale Sex Toys Products | Adult Toys Wholesale Catalog',
  description: 'Browse wholesale sex toys and adult toys wholesale collection. Premium wholesale adult toys at luxury prices. Low MOQ, fast global shipping.',
  keywords: ['wholesale sex toys', 'adult toys wholesale', 'wholesale adult toys', 'sex toys catalog', 'luxury sex toys wholesale', 'adult wellness products'],
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; page?: string };
}) {
  const categoryParam = searchParams.category || 'all';
  const pageNum = parseInt(searchParams.page || '0');

  let products: Product[] = [];
  let pagination = {
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    hasNext: false,
    hasPrevious: false,
  };

  try {
    const response: ProductListResponse = await productService.getProducts(pageNum, 12);
    
    if (response && response.content) {
      let filteredProducts = response.content;
      
      if (categoryParam !== 'all' && categoryParam) {
        filteredProducts = response.content.filter(product => {
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
          return cats.some(cat => cat.toLowerCase() === categoryParam.toLowerCase());
        });
      }
      
      products = filteredProducts;
      pagination = {
        currentPage: response.currentPage ?? 0,
        totalPages: response.totalPages ?? 0,
        totalElements: response.totalElements ?? 0,
        hasNext: response.hasNext ?? false,
        hasPrevious: response.hasPrevious ?? false,
      };
    }
  } catch (error) {
    console.error('Failed to fetch products:', error);
  }

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '/placeholder-product.svg';
    if (imagePath.startsWith('http')) return imagePath;
    return `https://pub-e5d14c6d386c4d90979458082617517a.r2.dev/${imagePath}`;
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="relative py-20 bg-[#F8F9FA] border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-[#1A1A1A] mb-6">
              Wholesale Sex Toys & Adult Toys Catalog
            </h1>
            <p className="text-xl text-[#6C757D] max-w-3xl mx-auto">
              Browse premium wholesale adult toys collection. Luxury sex toys wholesale prices, low MOQ, competitive pricing, fast worldwide shipping.
            </p>
          </div>
        </div>
      </section>

      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <WholesaleBreadcrumbs currentCategory={categoryParam === 'all' ? undefined : categoryParam} />

          <div className="mt-6 flex gap-8">
            {/* Left Sidebar: Filters */}
            <div className="hidden lg:block w-72 flex-shrink-0">
              <Suspense fallback={<div className="w-72 h-96 bg-gray-100 animate-pulse rounded-lg"></div>}>
                <WholesaleFilter selectedCategory={categoryParam === 'all' ? undefined : categoryParam} />
              </Suspense>
            </div>

            {/* Right: Product Grid */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <ProductCardClient key={product.id} product={product} />
                ))}
              </div>

              {pagination.totalPages > 1 && (
                <PaginationClient 
                  currentPage={pagination.currentPage} 
                  totalPages={pagination.totalPages}
                  category={categoryParam !== 'all' ? categoryParam : undefined}
                />
              )}

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
          </div>
        </div>
      </section>
    </div>
  );
}
