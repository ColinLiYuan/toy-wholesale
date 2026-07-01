'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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
  const [randomCode, setRandomCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const hasParsedRef = useRef(false);
  const onSkuGeneratedRef = useRef(onSkuGenerated);
  const suppliersRef = useRef<Supplier[]>([]);
  onSkuGeneratedRef.current = onSkuGenerated;
  suppliersRef.current = suppliers;

  // 生成 3 位随机大写字母
  const generateRandomCode = useCallback(() => {
    let result = '';
    for (let i = 0; i < 3; i++) {
      result += String.fromCharCode(65 + Math.floor(Math.random() * 26));
    }
    return result;
  }, []);

  // 初始化随机码
  useEffect(() => {
    if (!randomCode) {
      setRandomCode(generateRandomCode());
    }
  }, []);
  
  // 加载供应商列表
  useEffect(() => {
    const loadSuppliers = async () => {
      try {
        const data = await supplierService.getAllSuppliers();
        setSuppliers(data);
      } catch (error) {
        console.error('API failed, using fallback suppliers:', error);
        // 强制兜底数据，确保下拉框一定有选项
        setSuppliers([
          { id: 1, name: '东莞沃色', code: 'DWS', internalCode: 'DWS', contactPerson: 'Admin', isActive: true },
          { id: 2, name: 'Premium Factory B', code: 'PF', internalCode: 'PF', contactPerson: 'Jane Smith', isActive: true },
          { id: 3, name: 'Direct Manufacturer C', code: 'DM', internalCode: 'DM', contactPerson: 'Mike Johnson', isActive: true },
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
      setSelectedSupplierId(String(currentSupplierId));
    }
  }, [currentSupplierId]);

  // 根据当前 SKU 解析出各个部分（编辑模式）
  // 仅在组件初始化时执行一次，使用 ref 锁定防止竞态
  useEffect(() => {
    if (hasParsedRef.current) return; // 已经解析过，直接跳过
    if (!currentSku || !currentSku.includes('-')) return; // SKU 未就绪
    
    const currentSuppliers = suppliersRef.current;
    if (currentSuppliers.length === 0) return; // 供应商列表未加载

    hasParsedRef.current = true;
    setIsInitialized(true);

    const parts = currentSku.split('-');
    if (parts.length >= 4) {
      const supplierPart = parts[0];
      const matched = currentSuppliers.find(s => s.code === supplierPart || s.name === supplierPart);
      if (matched) setSelectedSupplierId(String(matched.id));

      setCategory(parts[1]);
      setMaterial(parts[2]);
      setRandomCode(parts[3] || generateRandomCode());
    }
  }, [currentSku]);

  // 自动生成 SKU
  useEffect(() => {
    const currentSuppliers = suppliersRef.current;
    const selected = currentSuppliers.find(s => String(s.id) === String(selectedSupplierId));
    if (selected && category && material && randomCode) {
      const code = selected?.internalCode || 'SUP';
      const newSku = `${code}-${category}-${material}-${randomCode}`;

      if (newSku !== currentSku) {
        onSkuGeneratedRef.current(newSku);
      }
    }
  }, [selectedSupplierId, category, material, randomCode, currentSku]);

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

        {/* 随机码 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            随机码
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={randomCode}
              readOnly
              className="w-24 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-center text-lg tracking-widest"
            />
            <button
              type="button"
              onClick={() => setRandomCode(generateRandomCode())}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
              title="重新生成"
            >
              ↻
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">随机 3 位大写字母，可点击刷新</p>
        </div>
      </div>

      {/* 生成的 SKU 预览 */}
      {(selectedSupplierId && category && material) && (() => {
        const selected = suppliers.find(s => String(s.id) === String(selectedSupplierId));
        const code = selected?.internalCode || 'SUP';
        return (
          <div className="p-4 bg-brand-light border-2 border-brand rounded-lg">
            <p className="text-sm text-brand font-semibold mb-1">SKU 编码参考值：</p>
            <p className="text-2xl font-mono font-bold text-brand">
              {code}-{category}-{material}-{randomCode}
            </p>
            <p className="text-xs text-text-secondary mt-2">
              格式：供应商代码-品类-材质-随机码
            </p>
          </div>
        );
    </div>
  );
}
