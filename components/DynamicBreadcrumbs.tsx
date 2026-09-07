'use client';

import Link from 'next/link';
import { findCategoryBySlug, CategoryItem } from '@/lib/categories';

interface BreadcrumbsProps {
  categories: CategoryItem[];
  parentSlug?: string;
  childSlug?: string;
}

export default function DynamicBreadcrumbs({ categories, parentSlug, childSlug }: BreadcrumbsProps) {
  // 构建面包屑路径
  const breadcrumbs = [
    { label: 'Home', href: '/' },
  ];

  if (parentSlug) {
    const parentCategory = findCategoryBySlug(parentSlug, categories);
    if (parentCategory) {
      breadcrumbs.push({
        label: parentCategory.name,
        href: `/products/${parentSlug}`,
      });
    }
  }

  if (childSlug && parentSlug) {
    const childCategory = findCategoryBySlug(childSlug, categories);
    if (childCategory) {
      breadcrumbs.push({
        label: childCategory.name,
        href: `/products/${parentSlug}/${childSlug}`,
      });
    }
  }

  return (
    <nav className="mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm flex-wrap">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          
          return (
            <li key={crumb.href} className="flex items-center">
              {index > 0 && (
                <span className="mx-2 text-gray-400">/</span>
              )}
              
              {isLast ? (
                <span className="text-text-primary font-medium">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-text-secondary hover:text-brand transition-colors"
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
