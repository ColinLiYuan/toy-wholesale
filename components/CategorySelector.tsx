'use client';

import { useState } from 'react';
import { getSiteCategories, CategoryItem } from '@/lib/categories';
import { getSiteId } from '@/lib/api-client';

interface CategorySelectorProps {
  selectedCategories: string[];
  onChange: (categories: string[]) => void;
}

export default function CategorySelector({ selectedCategories, onChange }: CategorySelectorProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const siteCategories = getSiteCategories(typeof window !== 'undefined' ? getSiteId() : 'toy');

  const toggleExpand = (slug: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(slug)) {
      newExpanded.delete(slug);
    } else {
      newExpanded.add(slug);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleCategory = (slug: string) => {
    const newCategories = selectedCategories.includes(slug)
      ? selectedCategories.filter(c => c !== slug)
      : [...selectedCategories, slug];
    onChange(newCategories);
  };

  return (
    <div className="border border-gray-300 rounded-lg p-4 max-h-96 overflow-y-auto">
      <div className="space-y-2">
        {siteCategories.map((category) => (
          <div key={category.slug}>
            {/* 一级分类 */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`cat-${category.slug}`}
                checked={selectedCategories.includes(category.slug)}
                onChange={() => toggleCategory(category.slug)}
                className="w-4 h-4 text-[#00F2FE] border-gray-300 rounded focus:ring-[#00F2FE]"
              />
              <label htmlFor={`cat-${category.slug}`} className="flex-1 text-sm font-medium text-gray-700 cursor-pointer">
                {category.name}
              </label>
              
              {/* 展开/折叠图标 */}
              {category.children && category.children.length > 0 && (
                <button
                  type="button"
                  onClick={() => toggleExpand(category.slug)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <svg
                    className={`w-4 h-4 text-gray-500 transition-transform ${
                      expandedCategories.has(category.slug) ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}
            </div>

            {/* 二级分类（展开时显示） */}
            {category.children && category.children.length > 0 && expandedCategories.has(category.slug) && (
              <div className="ml-6 mt-2 space-y-2 border-l-2 border-gray-200 pl-3">
                {category.children.map((child) => (
                  <div key={child.slug}>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`cat-${child.slug}`}
                        checked={selectedCategories.includes(child.slug)}
                        onChange={() => toggleCategory(child.slug)}
                        className="w-4 h-4 text-[#00F2FE] border-gray-300 rounded focus:ring-[#00F2FE]"
                      />
                      <label htmlFor={`cat-${child.slug}`} className="text-sm text-gray-600 cursor-pointer">
                        {child.name}
                      </label>
                      {child.children && child.children.length > 0 && (
                        <button type="button"
                          onClick={() => toggleExpand(child.slug)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors">
                          <svg className={`w-4 h-4 text-gray-500 transition-transform ${expandedCategories.has(child.slug) ? 'rotate-180' : ''}`}
                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      )}
                    </div>
                    {/* 三级分类 */}
                    {child.children && child.children.length > 0 && expandedCategories.has(child.slug) && (
                      <div className="ml-6 mt-1 space-y-1 border-l-2 border-gray-200 pl-3">
                        {child.children.map((grandchild) => (
                          <div key={grandchild.slug} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`cat-${grandchild.slug}`}
                              checked={selectedCategories.includes(grandchild.slug)}
                              onChange={() => toggleCategory(grandchild.slug)}
                              className="w-4 h-4 text-[#00F2FE] border-gray-300 rounded focus:ring-[#00F2FE]"
                            />
                            <label htmlFor={`cat-${grandchild.slug}`} className="text-sm text-gray-500 cursor-pointer">
                              {grandchild.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {selectedCategories.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 mb-2">已选择的分类：</p>
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((slug) => {
              // 查找分类名称
              let categoryName = slug;
              for (const cat of siteCategories) {
                if (cat.slug === slug) {
                  categoryName = cat.name;
                  break;
                }
                if (cat.children) {
                  const child = cat.children.find(c => c.slug === slug);
                  if (child) {
                    categoryName = `${cat.name} > ${child.name}`;
                    break;
                  }
                  // 查三级
                  for (const child2 of cat.children) {
                    if (child2.children) {
                      const gc = child2.children.find((c: CategoryItem) => c.slug === slug);
                      if (gc) {
                        categoryName = `${cat.name} > ${child2.name} > ${gc.name}`;
                        break;
                      }
                    }
                  }
                }
              }
              
              return (
                <span
                  key={slug}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-brand-light text-brand"
                >
                  {categoryName}
                  <button
                    type="button"
                    onClick={() => toggleCategory(slug)}
                    className="ml-1 text-brand hover:text-[#003d82]"
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
