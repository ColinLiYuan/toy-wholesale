'use client';

import { useState } from 'react';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterGroup {
  id: string;
  title: string;
  options: FilterOption[];
}

interface AttributeFilterProps {
  onFilterChange?: (filters: Record<string, string[]>) => void;
}

// B2B 关键筛选维度配置
const filterGroups: FilterGroup[] = [
  {
    id: 'weight',
    title: 'Weight (Shipping Cost)',
    options: [
      { label: 'Under 0.5 kg', value: '0-0.5' },
      { label: '0.5 - 1 kg', value: '0.5-1' },
      { label: '1 - 2 kg', value: '1-2' },
      { label: 'Over 2 kg', value: '2+' },
    ],
  },
  {
    id: 'material',
    title: 'Material',
    options: [
      { label: 'Silicone', value: 'silicone' },
      { label: 'ABS Plastic', value: 'abs' },
      { label: 'Glass', value: 'glass' },
      { label: 'Metal', value: 'metal' },
      { label: 'TPR/TPE', value: 'tpr-tpe' },
    ],
  },
  {
    id: 'function',
    title: 'Function',
    options: [
      { label: 'Vibrating', value: 'vibrating' },
      { label: 'Suction', value: 'suction' },
      { label: 'Rotating', value: 'rotating' },
      { label: 'Heating', value: 'heating' },
      { label: 'Remote Control', value: 'remote' },
      { label: 'App Control', value: 'app' },
    ],
  },
];

export default function AttributeFilter({ onFilterChange }: AttributeFilterProps) {
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});

  // 处理筛选项切换
  const handleFilterToggle = (groupId: string, value: string) => {
    const currentSelected = selectedFilters[groupId] || [];
    let newSelected: string[];

    if (currentSelected.includes(value)) {
      // 取消选择
      newSelected = currentSelected.filter((v) => v !== value);
    } else {
      // 添加选择
      newSelected = [...currentSelected, value];
    }

    const updatedFilters = {
      ...selectedFilters,
      [groupId]: newSelected,
    };

    setSelectedFilters(updatedFilters);
    onFilterChange?.(updatedFilters);
  };

  // 清除所有筛选
  const handleClearAll = () => {
    setSelectedFilters({});
    onFilterChange?.({});
  };

  // 检查是否有激活的筛选
  const hasActiveFilters = Object.values(selectedFilters).some((arr) => arr.length > 0);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
        <h3 className="text-base font-bold text-[#1A1A1A]">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={handleClearAll}
            className="text-sm text-[#0056B3] hover:text-[#004494] font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Filter Groups */}
      <div className="space-y-6">
        {filterGroups.map((group) => (
          <div key={group.id}>
            <h4 className="text-sm font-semibold text-[#1A1A1A] mb-3">{group.title}</h4>
            <div className="space-y-2">
              {group.options.map((option) => {
                const isSelected = (selectedFilters[group.id] || []).includes(option.value);
                return (
                  <label
                    key={option.value}
                    className="flex items-center cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleFilterToggle(group.id, option.value)}
                      className="w-4 h-4 text-[#0056B3] border-gray-300 rounded focus:ring-[#0056B3] cursor-pointer"
                    />
                    <span
                      className={`ml-2 text-sm transition-colors ${
                        isSelected
                          ? 'text-[#0056B3] font-medium'
                          : 'text-[#6C757D] group-hover:text-[#1A1A1A]'
                      }`}
                    >
                      {option.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="text-xs font-semibold text-[#6C757D] uppercase tracking-wider mb-2">
            Active Filters
          </h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(selectedFilters).map(([groupId, values]) =>
              values.map((value) => {
                const group = filterGroups.find((g) => g.id === groupId);
                const option = group?.options.find((o) => o.value === value);
                return (
                  <span
                    key={`${groupId}-${value}`}
                    className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-[#E8F0FE] text-[#0056B3]"
                  >
                    {option?.label || value}
                    <button
                      onClick={() => handleFilterToggle(groupId, value)}
                      className="ml-1.5 hover:text-[#004494]"
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </span>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
