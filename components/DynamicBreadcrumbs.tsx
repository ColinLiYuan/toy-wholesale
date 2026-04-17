'use client';

import Link from 'next/link';
import { findCategoryBySlug, getParentCategory } from '@/lib/categories';

interface BreadcrumbsProps {
  parentSlug?: string;
  childSlug?: string;
}

export default function DynamicBreadcrumbs({ parentSlug, childSlug }: BreadcrumbsProps) {
  // 构建面包屑路径
  const breadcrumbs = [
    { label: 'Home', href: '/' },
  ];

  if (parentSlug) {
    const parentCategory = findCategoryBySlug(parentSlug);
    if (parentCategory) {
      breadcrumbs.push({
        label: parentCategory.name,
        href: `/products/${parentSlug}`,
      });
    }
  }

  if (childSlug && parentSlug) {
    const childCategory = findCategoryBySlug(childSlug);
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
                <span className="text-[#1A1A1A] font-medium">
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="text-[#6C757D] hover:text-[#0056B3] transition-colors"
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
