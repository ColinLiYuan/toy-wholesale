import Link from 'next/link';
import { categories, findCategoryBySlug, getParentCategory } from '@/lib/categories';

interface WholesaleBreadcrumbsProps {
  currentCategory?: string;
}

export default function WholesaleBreadcrumbs({ currentCategory }: WholesaleBreadcrumbsProps) {
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
  const category = findCategoryBySlug(currentCategory);
  
  if (!category) {
    return null;
  }

  // 查找父级分类
  const parent = getParentCategory(currentCategory);

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
            {parent.name}
          </Link>
          
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </>
      ) : null}

      {/* 当前分类 */}
      <span className="text-text-primary font-semibold">
        {category.name}
      </span>
    </nav>
  );
}
