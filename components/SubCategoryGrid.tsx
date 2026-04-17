'use client';

import Link from 'next/link';
import { CategoryItem } from '@/lib/categories';

interface SubCategoryGridProps {
  parentCategory: CategoryItem;
}

export default function SubCategoryGrid({ parentCategory }: SubCategoryGridProps) {
  if (!parentCategory.children || parentCategory.children.length === 0) {
    return null;
  }

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold text-[#1A1A1A] mb-6">
        Browse by Subcategory
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {parentCategory.children.map((child) => (
          <Link
            key={child.slug}
            href={`/products/${parentCategory.slug}/${child.slug}`}
            className="group flex flex-col items-center text-center"
          >
            {/* 圆形/方形缩略图容器 */}
            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-[#0056B3] transition-all duration-300 group-hover:shadow-lg mb-3 bg-[#F8F9FA]">
              {child.coverImage ? (
                <img
                  src={child.coverImage}
                  alt={child.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    // 图片加载失败时显示占位符
                    (e.target as HTMLImageElement).src = '/placeholder-product.svg';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#E8F0FE] to-[#F8F9FA]">
                  <svg className="w-12 h-12 text-[#0056B3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              
              {/* Hover 遮罩层 */}
              <div className="absolute inset-0 bg-[#0056B3]/0 group-hover:bg-[#0056B3]/10 transition-colors duration-300" />
            </div>

            {/* 类目名称 */}
            <span className="text-sm font-medium text-[#1A1A1A] group-hover:text-[#0056B3] transition-colors line-clamp-2">
              {child.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
