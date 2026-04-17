'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { categories, CategoryItem } from '@/lib/categories';

interface MultilevelSidebarProps {
  selectedCategory?: string;
  onCategorySelect?: (slug: string) => void;
}

export default function MultilevelSidebar({ selectedCategory, onCategorySelect }: MultilevelSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  
  // 从 pathname 中提取 child slug
  const pathSegments = pathname.split('/').filter(Boolean);
  const childSlug = pathSegments.length >= 3 ? pathSegments[2] : undefined;
  
  // 从 URL query 参数中获取 parent
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const parentFromUrl = searchParams?.get('parent') || undefined;
  
  // 根据当前选中的分类或 URL 参数，自动展开对应的父级分类
  const getInitialExpanded = (): Set<string> => {
    const expanded = new Set<string>();
    
    // 如果有 child slug，找到它的父级并展开
    if (childSlug) {
      for (const category of categories) {
        if (category.children?.some(child => child.slug === childSlug)) {
          expanded.add(category.slug);
          break;
        }
      }
    }
    
    // 如果有 parent 参数，也展开
    if (parentFromUrl) {
      expanded.add(parentFromUrl);
    }
    
    return expanded;
  };
  
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(getInitialExpanded);

  // 当 URL 变化时，同步更新展开状态
  useEffect(() => {
    const newExpanded = new Set<string>();
    
    // 如果有 child slug，找到它的父级并展开
    if (childSlug) {
      for (const category of categories) {
        if (category.children?.some(child => child.slug === childSlug)) {
          newExpanded.add(category.slug);
          break;
        }
      }
    }
    
    // 如果有 parent 参数，也展开
    if (parentFromUrl) {
      newExpanded.add(parentFromUrl);
    }
    
    setExpandedCategories(newExpanded);
  }, [childSlug, parentFromUrl]);

  // 切换分类展开/折叠状态
  const toggleExpand = (slug: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(slug)) {
      newExpanded.delete(slug);
    } else {
      newExpanded.add(slug);
    }
    setExpandedCategories(newExpanded);
  };

  // 判断分类是否激活
  const isActive = (slug: string) => {
    return selectedCategory === slug || pathname.includes(`/${slug}`);
  };

  // 处理分类点击（点击文字部分）- 同时展开、查询和导航
  const handleCategoryClick = (category: CategoryItem) => {
    // 如果有子分类，先展开
    if (category.children && category.children.length > 0) {
      setExpandedCategories(prev => {
        const newExpanded = new Set(prev);
        newExpanded.add(category.slug);
        return newExpanded;
      });
    }
    // 然后触发查询和导航
    onCategorySelect?.(category.slug);
    const url = category.children && category.children.length > 0 
      ? `/products?parent=${category.slug}` 
      : `/products?category=${category.slug}`;
    router.push(url);
  };

  // 处理展开/折叠图标点击 - 只展开/折叠
  const handleExpandClick = (e: React.MouseEvent, category: CategoryItem) => {
    e.stopPropagation(); // 阻止事件冒泡
    if (category.children && category.children.length > 0) {
      toggleExpand(category.slug);
    }
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-4">
        <h2 className="text-lg font-bold text-[#1A1A1A] mb-4 px-2">Categories</h2>
        
        <nav className="space-y-1">
          {categories.map((category) => (
            <div key={category.slug}>
              {/* 一级分类 */}
              <div
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
                  isActive(category.slug) && !childSlug
                    ? 'bg-[#0056B3] text-white'
                    : 'text-[#6C757D] hover:bg-[#F8F9FA] hover:text-[#1A1A1A]'
                }`}
              >
                {/* 分类名称 - 可点击区域 */}
                <span 
                  className="text-sm font-medium flex-1 cursor-pointer"
                  onClick={() => {
                    // 先确保展开状态
                    if (category.children && category.children.length > 0) {
                      setExpandedCategories(prev => {
                        const newExpanded = new Set(prev);
                        newExpanded.add(category.slug);
                        return newExpanded;
                      });
                    }
                    // 然后触发查询
                    onCategorySelect?.(category.slug);
                    // 导航（不需要延迟）
                    const url = category.children && category.children.length > 0 
                      ? `/products?parent=${category.slug}` 
                      : `/products?category=${category.slug}`;
                    router.push(url);
                  }}
                >
                  {category.name}
                </span>
                
                {/* 展开/折叠图标 - 独立点击区域 */}
                {category.children && category.children.length > 0 && (
                  <div
                    className="expand-icon p-1 rounded hover:bg-black/10 transition-colors cursor-pointer"
                    onClick={(e) => handleExpandClick(e, category)}
                  >
                    <svg
                      className={`w-4 h-4 transition-transform ${
                        expandedCategories.has(category.slug) ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                )}
              </div>

              {/* 二级分类（展开时显示） */}
              {category.children && category.children.length > 0 && expandedCategories.has(category.slug) && (
                <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 pl-2">
                  {category.children.map((child) => (
                    <Link
                      key={child.slug}
                      href={`/products?parent=${category.slug}&child=${child.slug}`}
                      onClick={() => onCategorySelect?.(child.slug)}
                      className={`block px-3 py-2 rounded-lg text-sm transition-all ${
                        isActive(child.slug)
                          ? 'bg-[#E8F0FE] text-[#0056B3] font-semibold'
                          : 'text-[#6C757D] hover:bg-[#F8F9FA] hover:text-[#1A1A1A]'
                      }`}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
