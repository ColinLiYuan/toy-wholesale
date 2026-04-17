'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { categories } from '@/lib/categories';

interface WholesaleFilterProps {
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
  { label: '< 1 kg (Light)', value: '0-1', icon: '🪶' },
  { label: '1 - 2 kg (Medium)', value: '1-2', icon: '⚖️' },
  { label: '2 - 5 kg (Heavy)', value: '2-5', icon: '📦' },
  { label: '> 5 kg (Extra Heavy)', value: '5+', icon: '🏋️' },
];

export default function WholesaleFilter({ selectedCategory, onFilterChange }: WholesaleFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [filters, setFilters] = useState<WholesaleFilters>({
    materials: [],
    weightRange: undefined,
  });

  // 从 URL 恢复筛选状态
  useEffect(() => {
    const materials = searchParams.get('materials')?.split(',') || [];
    const weightRange = searchParams.get('weight') || undefined;
    setFilters({
      materials: materials.filter(m => m),
      weightRange,
    });
  }, [searchParams]);

  // 更新筛选条件并同步到 URL
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
    router.push(window.location.pathname, { scroll: false });
    onFilterChange?.({ materials: [], weightRange: undefined });
  };

  const hasActiveFilters = (filters.materials && filters.materials.length > 0) || filters.weightRange;

  return (
    <aside className="w-72 bg-white border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#1A1A1A]">🔍 Wholesale Filters</h2>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="text-xs text-[#0056B3] hover:underline font-medium">
              Clear All
            </button>
          )}
        </div>

        {/* 分类导航 */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Categories</h3>
          <nav className="space-y-1">
            {categories.map((category) => (
              <div key={category.slug}>
                {/* 一级分类 */}
                <Link
                  href={`/products?category=${category.slug}`}
                  className={`block px-3 py-2 rounded-lg text-sm transition-all ${
                    selectedCategory === category.slug
                      ? 'bg-[#E8F0FE] text-[#0056B3] font-semibold'
                      : 'text-[#6C757D] hover:bg-[#F8F9FA] hover:text-[#1A1A1A]'
                  }`}
                >
                  {category.name}
                </Link>

                {/* 二级分类 */}
                {category.children && category.children.length > 0 && (
                  <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 pl-3">
                    {category.children.map((child) => (
                      <Link
                        key={child.slug}
                        href={`/products?category=${child.slug}`}
                        className={`block px-3 py-1.5 rounded text-sm transition-all ${
                          selectedCategory === child.slug
                            ? 'bg-[#E8F0FE] text-[#0056B3] font-medium'
                            : 'text-gray-600 hover:bg-gray-50'
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
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Material</h3>
          <div className="space-y-2">
            {['TPE', 'Silicone', 'ABS', 'Glass', 'Metal', 'CyberSkin', 'PVC'].map((material) => (
              <label key={material} className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={(filters.materials || []).includes(material)}
                  onChange={() => toggleMaterial(material)}
                  className="w-4 h-4 text-[#0056B3] border-gray-300 rounded focus:ring-[#0056B3]"
                />
                <span className="text-sm text-gray-700 group-hover:text-[#1A1A1A] transition-colors">
                  {material}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* 重量筛选 */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Weight Range</h3>
          <div className="space-y-2">
            {WEIGHT_RANGES.map((range) => (
              <label key={range.value} className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="radio"
                  name="weight"
                  checked={filters.weightRange === range.value}
                  onChange={() => updateFilters({ weightRange: range.value })}
                  className="w-4 h-4 text-[#0056B3] border-gray-300 focus:ring-[#0056B3]"
                />
                <span className="text-sm text-gray-700 group-hover:text-[#1A1A1A] transition-colors">
                  {range.icon} {range.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* 激活的筛选标签 */}
        {hasActiveFilters && (
          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-xs font-semibold text-gray-500 mb-2 uppercase">Active Filters</h3>
            <div className="flex flex-wrap gap-2">
              {(filters.materials || []).map((material) => (
                <span
                  key={material}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#E8F0FE] text-[#0056B3]"
                >
                  {material}
                  <button onClick={() => toggleMaterial(material)} className="ml-1 text-[#0056B3] hover:text-[#003d82]">
                    ×
                  </button>
                </span>
              ))}
              {filters.weightRange && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#E8F0FE] text-[#0056B3]">
                  {WEIGHT_RANGES.find(r => r.value === filters.weightRange)?.label}
                  <button onClick={() => updateFilters({ weightRange: undefined })} className="ml-1 text-[#0056B3] hover:text-[#003d82]">
                    ×
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
