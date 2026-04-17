'use client';

import { useState, useEffect, useRef } from 'react';
import { supplierService } from '@/services';
import type { Supplier } from '@/types';

interface Category {
  slug: string;
  name: string;
  code: string; // 品类代码，如 TM (Torso Male)
}

interface Material {
  value: string;
  label: string;
  code: string; // 材质代码，如 TPE, SIL
}

interface SkuGeneratorProps {
  onSkuGenerated: (sku: string) => void;
  onSupplierChange?: (supplier: Supplier | null) => void;  // 新增：供应商变化回调
  currentSku?: string;
  currentSupplierId?: number;
}

const categories: Category[] = [
  { slug: 'realistic-life-size', name: 'Realistic Life-size', code: 'RL' },
  { slug: 'tpe-torsos', name: 'TPE Torsos', code: 'TT' },
  { slug: 'silicone-torsos', name: 'Silicone Torsos', code: 'ST' },
  { slug: 'butt-masturbators', name: 'Butt Models', code: 'BM' },
  { slug: 'realistic-dildos', name: 'Realistic Dildos', code: 'RD' },
  { slug: 'dual-density', name: 'Dual-Density', code: 'DD' },
  { slug: 'suction-cup-dildos', name: 'Suction Cup', code: 'SC' },
  { slug: 'male-masturbators', name: 'Male Masturbators', code: 'MM' },
  { slug: 'manual-strokers', name: 'Manual Strokers', code: 'MS' },
  { slug: 'automatic-cups', name: 'Automatic Cups', code: 'AC' },
  { slug: 'vibrators', name: 'Vibrators', code: 'VB' },
  { slug: 'wand-vibrators', name: 'Wand Vibrators', code: 'WV' },
];

const materials: Material[] = [
  { value: 'tpe', label: 'TPE', code: 'TPE' },
  { value: 'silicone', label: 'Silicone', code: 'SIL' },
  { value: 'abs', label: 'ABS Plastic', code: 'ABS' },
  { value: 'glass', label: 'Glass', code: 'GLS' },
  { value: 'metal', label: 'Metal', code: 'MTL' },
];

export default function SkuGenerator({ onSkuGenerated, onSupplierChange, currentSku, currentSupplierId }: SkuGeneratorProps) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>('');
  const [category, setCategory] = useState('');
  const [material, setMaterial] = useState('');
  const [sequence, setSequence] = useState('001');
  const [weight, setWeight] = useState('');
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const hasParsedRef = useRef(false); // 使用 ref 确保只解析一次
  const onSkuGeneratedRef = useRef(onSkuGenerated); // 保持回调引用稳定
  const suppliersRef = useRef<Supplier[]>([]); // 保持 suppliers 引用稳定
  onSkuGeneratedRef.current = onSkuGenerated;
  suppliersRef.current = suppliers;
  
  // 加载供应商列表
  useEffect(() => {
    const loadSuppliers = async () => {
      try {
        const data = await supplierService.getAllSuppliers();
        console.log('Suppliers loaded:', data);
        setSuppliers(data);
      } catch (error) {
        console.error('API failed, using fallback suppliers:', error);
        // 强制兜底数据，确保下拉框一定有选项
        setSuppliers([
          { id: 1, name: '东莞沃色', code: 'DWS', contactName: 'Admin', isActive: true },
          { id: 2, name: 'Premium Factory B', code: 'PF', contactName: 'Jane Smith', isActive: true },
          { id: 3, name: 'Direct Manufacturer C', code: 'DM', contactName: 'Mike Johnson', isActive: true },
        ]);
      } finally {
        setLoading(false);
      }
    };
    loadSuppliers();
  }, []);

  // 同步外部传入的 supplierId
  useEffect(() => {
    if (currentSupplierId && !selectedSupplierId) {
      setSelectedSupplierId(currentSupplierId);
    }
  }, [currentSupplierId]);

  // 根据当前 SKU 解析出各个部分（编辑模式）
  // 仅在组件初始化时执行一次，使用 ref 锁定防止竞态
  useEffect(() => {
    if (hasParsedRef.current) return; // 已经解析过，直接跳过
    if (!currentSku || !currentSku.includes('-')) return; // SKU 未就绪
    
    const currentSuppliers = suppliersRef.current;
    if (currentSuppliers.length === 0) return; // 供应商列表未加载

    hasParsedRef.current = true; // 立即锁定
    setIsInitialized(true);
    
    const parts = currentSku.split('-');
    if (parts.length >= 4) {
      // 尝试匹配供应商
      const supplierPart = parts[0];
      const matched = currentSuppliers.find(s => s.code === supplierPart || s.name === supplierPart);
      if (matched) setSelectedSupplierId(matched.id);
      
      setCategory(parts[1]);
      setMaterial(parts[2]);
      
      const lastPart = parts[parts.length - 1];
      if (lastPart.toLowerCase().endsWith('kg')) {
        setWeight(lastPart);
        setSequence(parts.slice(3, -1).join('-'));
      } else {
        setSequence(parts.slice(3).join('-'));
      }
    }
  }, [currentSku]); // 只依赖 currentSku，使用 ref 访问其他值

  // 自动生成 SKU
  useEffect(() => {
    const currentSuppliers = suppliersRef.current;
    const selected = currentSuppliers.find(s => String(s.id) === String(selectedSupplierId));
    if (selected && category && material) {
      const code = selected?.internalCode || 'SUP';
      const newSku = `${code}-${category}-${material}${sequence ? '-' + sequence : ''}${weight ? '-' + weight : ''}`;
      
      if (newSku !== currentSku) {
        onSkuGeneratedRef.current(newSku);
      }
    }
  }, [selectedSupplierId, category, material, sequence, weight, currentSku]); // 移除 suppliers 依赖，使用 ref

  const handleSupplierSelect = (id: string) => {
    setSelectedSupplierId(id);
    const selected = suppliers.find(s => String(s.id) === id) || null;
    onSupplierChange?.(selected);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 供应商选择 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            供应商 *
          </label>
          <select
            value={selectedSupplierId}
            onChange={(e) => handleSupplierSelect(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent disabled:bg-gray-100"
            required
          >
            <option value="">{loading ? '加载中...' : '选择供应商'}</option>
            {suppliers.map((s) => {
              const displayName = s.internalCode ? `${s.name} [${s.internalCode}]` : s.name;
              return (
                <option key={s.id} value={String(s.id)}>
                  {displayName}
                </option>
              );
            })}
          </select>
        </div>

        {/* 品类选择 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            品类 *
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
            required
          >
            <option value="">选择品类</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.code}>
                {c.name} ({c.code})
              </option>
            ))}
          </select>
        </div>

        {/* 材质选择 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            材质 *
          </label>
          <select
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
            required
          >
            <option value="">选择材质</option>
            {materials.map((m) => (
              <option key={m.value} value={m.code}>
                {m.label} ({m.code})
              </option>
            ))}
          </select>
        </div>

        {/* 序列号 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            序列号
          </label>
          <input
            type="text"
            value={sequence}
            onChange={(e) => setSequence(e.target.value.padStart(3, '0'))}
            placeholder="001"
            maxLength={5}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">自动补零，如：001, 002...</p>
        </div>

        {/* 重量（可选） */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            重量（可选）
          </label>
          <input
            type="text"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="例如：2kg"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">用于物流成本计算</p>
        </div>
      </div>

      {/* 生成的 SKU 预览 */}
      {(selectedSupplierId && category && material) && (() => {
        const selected = suppliers.find(s => String(s.id) === String(selectedSupplierId));
        const code = selected?.internalCode || 'SUP';
        return (
          <div className="p-4 bg-[#E8F0FE] border-2 border-[#0056B3] rounded-lg">
            <p className="text-sm text-[#0056B3] font-semibold mb-1">SKU 编码参考值：</p>
            <p className="text-2xl font-mono font-bold text-[#0056B3]">
              {code}-{category}-{material}{sequence ? '-' + sequence : ''}{weight ? '-' + weight : ''}
            </p>
            <p className="text-xs text-[#6C757D] mt-2">
              格式：供应商代码-品类-材质-序列号-重量
            </p>
          </div>
        );
      })()}
    </div>
  );
}
