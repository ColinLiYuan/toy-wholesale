'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import type { CategoryItem } from '@/lib/categories';

interface WholesaleFilterProps {
  categories: CategoryItem[];
  selectedCategory?: string;
  onFilterChange?: (filters: WholesaleFilters) => void;
}
export interface WholesaleFilters {
  materials?: string[];
  weightRange?: string;
  minOrder?: number;
  priceRange?: { min?: number; max?: number };
}

const WEIGHT_RANGES = [
  { label: 'Under 1 kg', value: '0-1' },
  { label: '1 – 2 kg', value: '1-2' },
  { label: '2 – 5 kg', value: '2-5' },
  { label: 'Over 5 kg', value: '5+' },
];

const MATERIALS = ['TPE', 'Silicone', 'ABS', 'Glass', 'Metal', 'CyberSkin', 'PVC'];

export default function WholesaleFilter({ categories, selectedCategory, onFilterChange }: WholesaleFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<WholesaleFilters>({
    materials: [],
    weightRange: undefined,
  });

  useEffect(() => {
    const materials = searchParams.get('materials')?.split(',') || [];
    const weightRange = searchParams.get('weight') || undefined;
    setFilters({
      materials: materials.filter(m => m),
      weightRange,
    });
  }, [searchParams]);

  const updateFilters = (newFilters: Partial<WholesaleFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);

    const params = new URLSearchParams(searchParams.toString());

    if (updatedFilters.materials && updatedFilters.materials.length > 0) {
      params.set('materials', updatedFilters.materials.join(','));
    } else {
      params.delete('materials');
    }

    if (updatedFilters.weightRange) {
      params.set('weight', updatedFilters.weightRange);
    } else {
      params.delete('weight');
    }

    onFilterChange?.(updatedFilters);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const toggleMaterial = (material: string) => {
    const currentMaterials = filters.materials || [];
    const newMaterials = currentMaterials.includes(material)
      ? currentMaterials.filter(m => m !== material)
      : [...currentMaterials, material];
    updateFilters({ materials: newMaterials });
  };

  const clearFilters = () => {
    setFilters({ materials: [], weightRange: undefined });
    // 保留 category 参数，只清除 materials 和 weight
    const params = new URLSearchParams();
    const category = searchParams.get('category');
    if (category) params.set('category', category);
    const href = params.toString() ? `?${params.toString()}` : window.location.pathname;
    router.push(href, { scroll: false });
    onFilterChange?.({ materials: [], weightRange: undefined });
  };

  const hasActiveFilters = (filters.materials && filters.materials.length > 0) || filters.weightRange;
  const activeMaterialCount = filters.materials?.length || 0;

  // 构建分类链接，保留已有的 material 和 weight 筛选
  const buildCategoryHref = (categorySlug: string) => {
    const params = new URLSearchParams();
    params.set('category', categorySlug);
    const materials = searchParams.get('materials');
    const weight = searchParams.get('weight');
    if (materials) params.set('materials', materials);
    if (weight) params.set('weight', weight);
    return `/products?${params.toString()}`;
  };

  return (
    <aside className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="p-5 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
            <svg className="w-4 h-4 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
            {activeMaterialCount > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-brand text-white text-[10px] font-bold">
                {activeMaterialCount}
              </span>
            )}
          </h2>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="text-[11px] text-brand hover:text-brand-hover font-medium uppercase tracking-wide transition-colors">
              Clear All
            </button>
          )}
        </div>

        {/* 分类导航 */}
        <div>
          <h3 className="text-[11px] font-semibold text-text-secondary mb-2 uppercase tracking-widest">Categories</h3>
          <nav className="space-y-0.5">
            {/* All Products */}
            <Link
              href={(() => {
                const params = new URLSearchParams();
                const materials = searchParams.get('materials');
                const weight = searchParams.get('weight');
                if (materials) params.set('materials', materials);
                if (weight) params.set('weight', weight);
                return params.toString() ? `/products?${params.toString()}` : '/products';
              })()}
              className={`block px-3 py-2 rounded-lg text-sm transition-all ${
                !selectedCategory
                  ? 'bg-brand-light text-brand font-semibold'
                  : 'text-text-secondary hover:bg-surface hover:text-text-primary'
              }`}
            >
              All Products
            </Link>
            {categories.map((category) => (
              <div key={category.slug}>
                <Link
                  href={buildCategoryHref(category.slug)}
                  className={`block px-3 py-2 rounded-lg text-sm transition-all ${
                    selectedCategory === category.slug
                      ? 'bg-brand-light text-brand font-semibold'
                      : 'text-text-secondary hover:bg-surface hover:text-text-primary'
                  }`}
                >
                  {category.name}
                </Link>

                {category.children && category.children.length > 0 && (
                  <div className="ml-3 mt-0.5 space-y-0.5 border-l-2 border-gray-100 pl-3">
                    {category.children.map((child) => (
                      <Link
                        key={child.slug}
                        href={buildCategoryHref(child.slug)}
                        className={`block px-3 py-1.5 rounded text-[13px] transition-all ${
                          selectedCategory === child.slug
                            ? 'bg-brand-light text-brand font-medium'
                            : 'text-text-muted hover:text-text-primary hover:bg-gray-50'
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

        {/* 材质筛选 */}
        <div className="pt-4 border-t border-gray-100">
          <h3 className="text-[11px] font-semibold text-text-secondary mb-2 uppercase tracking-widest">Material</h3>
          <div className="space-y-0.5">
            {MATERIALS.map((material) => (
              <label
                key={material}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                  (filters.materials || []).includes(material)
                    ? 'bg-brand-light'
                    : 'hover:bg-surface'
                }`}
              >
                <input
                  type="checkbox"
                  checked={(filters.materials || []).includes(material)}
                  onChange={() => toggleMaterial(material)}
                  className="w-4 h-4 rounded border-gray-300 text-brand focus:ring-2 focus:ring-brand focus:ring-offset-0"
                />
                <span className={`text-sm transition-colors ${
                  (filters.materials || []).includes(material) ? 'text-brand font-medium' : 'text-text-secondary'
                }`}>
                  {material}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* 重量筛选 */}
        <div className="pt-4 border-t border-gray-100">
          <h3 className="text-[11px] font-semibold text-text-secondary mb-2 uppercase tracking-widest">Weight Range</h3>
          <div className="space-y-0.5">
            {WEIGHT_RANGES.map((range) => (
              <label
                key={range.value}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                  filters.weightRange === range.value
                    ? 'bg-brand-light'
                    : 'hover:bg-surface'
                }`}
              >
                <input
                  type="radio"
                  name="weight"
                  checked={filters.weightRange === range.value}
                  onChange={() => updateFilters({ weightRange: range.value })}
                  className="w-4 h-4 border-gray-300 text-brand focus:ring-2 focus:ring-brand focus:ring-offset-0"
                />
                <span className={`text-sm transition-colors ${
                  filters.weightRange === range.value ? 'text-brand font-medium' : 'text-text-secondary'
                }`}>
                  {range.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* 激活的筛选标签 */}
        {hasActiveFilters && (
          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-[11px] font-semibold text-text-secondary mb-2 uppercase tracking-widest">Active</h3>
            <div className="flex flex-wrap gap-1.5">
              {(filters.materials || []).map((material) => (
                <span
                  key={material}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-brand-light text-brand"
                >
                  {material}
                  <button
                    onClick={() => toggleMaterial(material)}
                    className="w-3.5 h-3.5 flex items-center justify-center rounded-full hover:bg-brand/20 transition-colors"
                  >
                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
              {filters.weightRange && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-brand-light text-brand">
                  {WEIGHT_RANGES.find(r => r.value === filters.weightRange)?.label}
                  <button
                    onClick={() => updateFilters({ weightRange: undefined })}
                    className="w-3.5 h-3.5 flex items-center justify-center rounded-full hover:bg-brand/20 transition-colors"
                  >
                    <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
