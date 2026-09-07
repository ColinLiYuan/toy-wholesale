import Link from 'next/link';
import { findCategoryBySlug, getParentCategory, CategoryItem } from '@/lib/categories';

interface WholesaleBreadcrumbsProps {
  categories: CategoryItem[];
  currentCategory?: string;
}

export default function WholesaleBreadcrumbs({ categories, currentCategory }: WholesaleBreadcrumbsProps) {
  if (!currentCategory) {
    return (
      <nav className="flex items-center space-x-2 text-sm">
        <Link href="/products" className="text-gray-500 hover:text-brand transition-colors">
          Shop
        </Link>
      </nav>
    );
  }

  // 查找当前分类
  const category = findCategoryBySlug(currentCategory, categories);

  if (!category) {
    return null;
  }

  // 查找父级分类
  const parent = getParentCategory(currentCategory, categories);

  return (
    <nav className="flex items-center space-x-2 text-sm" aria-label="Breadcrumb">
      {/* Home / Shop */}
      <Link href="/products" className="text-gray-500 hover:text-brand transition-colors">
        Shop
      </Link>
      
      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>

      {/* 父级分类（如果有） */}
      {parent ? (
        <>
          <Link
            href={`/products?parent=${parent.slug}`}
            className="text-gray-500 hover:text-brand transition-colors"
          >
            {parent.nameEn}
          </Link>
          
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </>
      ) : null}

      {/* 当前分类 */}
      <span className="text-text-primary font-semibold">
        {category.nameEn}
      </span>
    </nav>
  );
}
