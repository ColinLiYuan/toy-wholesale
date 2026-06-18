import { productService } from '@/services';
import type { Product, ProductListResponse } from '@/types';
import WholesaleBreadcrumbs from '@/components/WholesaleBreadcrumbs';
import WholesaleFilter from '@/components/WholesaleFilter';
import ProductCardClient from '@/components/ProductCardClient';
import PaginationClient from '@/components/PaginationClient';
import SortSelect from '@/components/SortSelect';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { categories, findCategoryBySlug } from '@/lib/categories';

export const metadata: Metadata = {
  title: 'Wholesale Adult Toys Catalog — Bulk Orders from Factory',
  description: 'Browse our full wholesale catalog. Medical-grade silicone adult toys, low MOQ from 20 pcs, OEM/ODM available. Direct from Dongguan factory.',
  keywords: ['wholesale adult toys', 'adult toys catalog', 'bulk sex toys', 'OEM adult products', 'wholesale silicone toys'],
  openGraph: {
    title: 'Wholesale Adult Toys Catalog | Silvibe',
    description: 'Browse our full wholesale catalog with medical-grade silicone adult toys from Dongguan factory',
    type: 'website',
    images: [
      {
        url: 'https://pub-e5d14c6d386c4d90979458082617517a.r2.dev/toy/home_product.jpg',
        width: 1200,
        height: 630,
        alt: 'Silvibe - Wholesale Adult Toys Catalog',
      },
    ],
  },
  alternates: {
    canonical: '/products',
  },
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const params = await searchParams;
  const categoryParam = params.category || 'all';
  const pageNum = parseInt(params.page || '0');

  let products: Product[] = [];
  let pagination = {
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
    hasNext: false,
    hasPrevious: false,
  };

  try {
    let response: ProductListResponse;

    if (categoryParam !== 'all' && categoryParam) {
      response = await productService.getProductsByCategory(categoryParam, pageNum, 12);
    } else {
      response = await productService.getProducts(pageNum, 12);
    }

    if (response && response.content) {
      products = response.content;
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

  const currentCategory = categoryParam !== 'all' ? findCategoryBySlug(categoryParam) : undefined;

  return (
    <div className="min-h-screen bg-surface">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: currentCategory ? `${currentCategory.name} - Wholesale Products` : 'Wholesale Product Catalog',
            description: 'Browse our full wholesale catalog of medical-grade silicone adult toys.',
            url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.adult-toy-wholesale.com'}/products${categoryParam !== 'all' ? `?category=${categoryParam}` : ''}`,
            numberOfItems: products.length,
            itemListElement: products.map((product, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              item: {
                '@type': 'Product',
                name: product.title,
                url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://www.adult-toy-wholesale.com'}/products/${product.slug}`,
                image: product.image?.startsWith('http') ? product.image : `https://pub-e5d14c6d386c4d90979458082617517a.r2.dev/${product.image}`,
                ...(product.description ? { description: product.description.replace(/###|\*\*/g, '').substring(0, 300) } : {}),
              },
            })),
          }),
        }}
      />
      {/* Top Title Bar — compact, not a huge hero */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <WholesaleBreadcrumbs currentCategory={categoryParam === 'all' ? undefined : categoryParam} />

          <div className="mt-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-text-primary">
                {currentCategory ? currentCategory.name : 'Wholesale Product Catalog'}
              </h1>
              {currentCategory?.description && (
                <p className="text-sm text-text-secondary mt-1">{currentCategory.description}</p>
              )}
              <p className="text-sm text-text-secondary mt-2">
                {pagination.totalElements > 0
                  ? `Showing ${pageNum * 12 + 1}–${Math.min((pageNum + 1) * 12, pagination.totalElements)} of ${pagination.totalElements} products`
                  : 'No products found'}
              </p>
            </div>

            {/* Sort dropdown */}
            <div className="flex items-center gap-3">
              <label className="text-sm text-text-secondary hidden sm:inline">Sort by:</label>
              <Suspense fallback={<div className="w-32 h-9 bg-gray-100 rounded-lg animate-pulse" />}>
                <SortSelect />
              </Suspense>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex gap-8">
            {/* Sidebar Filters */}
            <div className="hidden lg:block w-72 flex-shrink-0">
              <div className="sticky top-24">
                <Suspense fallback={<div className="w-72 h-96 bg-gray-100 animate-pulse rounded-xl" />}>
                  <WholesaleFilter selectedCategory={categoryParam === 'all' ? undefined : categoryParam} />
                </Suspense>
              </div>
            </div>

            {/* Product Grid */}
            <div className="flex-1 min-w-0">
              {products.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <ProductCardClient key={product.id} product={product} />
                    ))}
                  </div>

                  {pagination.totalPages > 1 && (
                    <div className="mt-12">
                      <PaginationClient
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        category={categoryParam !== 'all' ? categoryParam : undefined}
                      />
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
                  <svg className="w-16 h-16 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <p className="text-text-secondary text-lg mb-1">No products found</p>
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
