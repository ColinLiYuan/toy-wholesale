'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { productAdminService } from '@/services';
import type { Product, ProductSku, ProductSpecification } from '@/types';
import CategorySelector from '@/components/CategorySelector';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [product, setProduct] = useState<Partial<Product>>({
    name: '',
    title: '',
    slug: '',
    brand: 'MythToy',
    image: '',
    alt: '',
    description: '',
    shortDescription: '',
    currentPrice: 0,
    status: 'ACTIVE',
    colors: [],
    tags: [],
    features: {},
    minOrder: 1,
    material: '',
    netWeight: undefined,
    supplierSku: '',
    supplierId: undefined,
  });
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [skus, setSkus] = useState<ProductSku[]>([]);
  const [specifications, setSpecifications] = useState<ProductSpecification[]>([]);
  
  // 特性管理
  const [featureKey, setFeatureKey] = useState('');
  const [featureValue, setFeatureValue] = useState('');

  const addFeature = () => {
    if (!featureKey.trim()) {
      alert('请输入特性名称');
      return;
    }
    
    const features = { ...(product.features || {}) };
    features[featureKey] = featureValue;
    setProduct({ ...product, features });
    setFeatureKey('');
    setFeatureValue('');
  };

  const removeFeature = (key: string) => {
    const features = { ...(product.features || {}) };
    delete features[key];
    setProduct({ ...product, features });
  };

  // 标签管理
  const [newTag, setNewTag] = useState('');

  const addTag = () => {
    if (!newTag.trim()) return;
    
    const tags = Array.isArray(product.tags) ? [...product.tags] : [];
    if (!tags.includes(newTag.trim())) {
      tags.push(newTag.trim());
      setProduct({ ...product, tags });
    }
    setNewTag('');
  };

  const removeTag = (index: number) => {
    const tags = Array.isArray(product.tags) ? [...product.tags] : [];
    tags.splice(index, 1);
    setProduct({ ...product, tags });
  };

  // SKU管理
  const addSku = () => {
    setSkus([...skus, { sku: '', color: '', stock: 0 }]);
  };

  const updateSku = (index: number, field: keyof ProductSku, value: any) => {
    const updatedSkus = [...skus];
    updatedSkus[index] = { ...updatedSkus[index], [field]: value };
    setSkus(updatedSkus);
  };

  const removeSku = (index: number) => {
    setSkus(skus.filter((_, i) => i !== index));
  };

  // 规格管理
  const addSpecification = () => {
    setSpecifications([...specifications, { id: 0, specKey: '', specValue: '' }]);
  };

  const updateSpecification = (index: number, field: keyof ProductSpecification, value: any) => {
    const updatedSpecs = [...specifications];
    updatedSpecs[index] = { ...updatedSpecs[index], [field]: value };
    setSpecifications(updatedSpecs);
  };

  const removeSpecification = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  // 图片上传处理
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/v1/upload/product', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (result.code === 200 && result.data) {
        setProduct({ ...product, image: result.data });
        alert('图片上传成功！');
      } else {
        alert('图片上传失败：' + result.message);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('图片上传失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 表单验证
    if (!product.name || product.name.trim() === '') {
      alert('请输入产品名称');
      return;
    }
    if (!product.title || product.title.trim() === '') {
      alert('请输入产品标题');
      return;
    }
    if (!product.slug || product.slug.trim() === '') {
      alert('请输入产品 Slug');
      return;
    }
    if (product.currentPrice === undefined || product.currentPrice === null || product.currentPrice <= 0) {
      alert('请输入正确的当前价格');
      return;
    }

    setLoading(true);

    try {
      const productData: any = { 
        name: product.name,
        title: product.title,
        slug: product.slug,
        brand: product.brand,
        status: product.status,
        image: product.image,
        alt: product.alt,
        currentPrice: product.currentPrice,
        shortDescription: product.shortDescription,
        description: product.description,
        categories: JSON.stringify(selectedCategories),
        colors: typeof product.colors === 'string' ? product.colors : JSON.stringify(product.colors || []),
        minOrder: product.minOrder,
        material: product.material,
        netWeight: product.netWeight,
        supplierSku: product.supplierSku,
        supplierId: product.supplierId,
      };
      
      // 处理tags（JSON数组）
      if (product.tags && Array.isArray(product.tags) && product.tags.length > 0) {
        productData.tags = JSON.stringify(product.tags);
      }
      
      // 处理features（JSON对象）
      if (product.features && Object.keys(product.features).length > 0) {
        productData.features = JSON.stringify(product.features);
      }
      
      console.log('Submitting product data:', JSON.stringify(productData, null, 2));
      
      await productAdminService.createProduct(productData);
      alert('产品创建成功！');
      router.push('/admin/products');
    } catch (error) {
      console.error('Failed to create product:', error);
      alert('创建失败，请检查浏览器控制台错误信息');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">添加新产品</h1>
          <p className="text-gray-600 mt-1">创建新的产品条目</p>
        </div>
        <Link
          href="/admin/products"
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          ← 返回列表
        </Link>
      </div>

      {/* 表单 */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 基本信息 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">基本信息</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                产品名称 *
              </label>
              <input
                type="text"
                value={product.name}
                onChange={(e) => setProduct({ ...product, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                产品标题 *
              </label>
              <input
                type="text"
                value={product.title}
                onChange={(e) => setProduct({ ...product, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                品牌
              </label>
              <input
                type="text"
                value={product.brand || ''}
                onChange={(e) => setProduct({ ...product, brand: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug (URL路径) *
              </label>
              <input
                type="text"
                value={product.slug}
                onChange={(e) => setProduct({ ...product, slug: e.target.value })}
                placeholder="例如：realistic-tpe-torso-ws-tm-t101-2kg"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                required
              />
              <p className="text-xs text-gray-500 mt-1">用于 SEO 友好的 URL</p>
            </div>
          </div>
        </div>

        {/* 产品分类 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">产品分类</h2>
          <p className="text-sm text-gray-600 mb-4">选择产品所属的分类（可多选）</p>
          <CategorySelector
            selectedCategories={selectedCategories}
            onChange={setSelectedCategories}
          />
        </div>

        {/* SKU 管理 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">SKU 管理</h2>
            <button
              type="button"
              onClick={addSku}
              className="px-4 py-2 bg-[#00F2FE] text-[#050505] rounded-lg text-sm font-semibold hover:bg-[#00C4CC] transition-colors"
            >
              + 添加 SKU
            </button>
          </div>
          
          {skus.length > 0 ? (
            <div className="space-y-4">
              {skus.map((sku, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-600 mb-1">SKU 编码</label>
                    <input
                      type="text"
                      value={sku.sku}
                      onChange={(e) => updateSku(index, 'sku', e.target.value)}
                      placeholder="例如：SKU-001"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-600 mb-1">颜色</label>
                    <input
                      type="text"
                      value={sku.color || ''}
                      onChange={(e) => updateSku(index, 'color', e.target.value)}
                      placeholder="例如：Black"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-600 mb-1">库存</label>
                    <input
                      type="number"
                      value={sku.stock}
                      onChange={(e) => updateSku(index, 'stock', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                    />
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => removeSku(index)}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    删除
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500">暂无 SKU</p>
              <p className="text-xs text-gray-400 mt-1">点击上方按钮添加 SKU</p>
            </div>
          )}
        </div>

        {/* 价格信息 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">价格信息</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                当前价格 *
              </label>
              <input
                type="number"
                step="0.01"
                value={product.currentPrice}
                onChange={(e) => setProduct({ ...product, currentPrice: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                最小起订量 (MOQ)
              </label>
              <input
                type="number"
                min="1"
                value={product.minOrder ?? 1}
                onChange={(e) => setProduct({ ...product, minOrder: parseInt(e.target.value) || 1 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* 描述信息 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">描述信息</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                短描述（Short Description）
              </label>
              <textarea
                value={product.shortDescription || ''}
                onChange={(e) => setProduct({ ...product, shortDescription: e.target.value })}
                rows={3}
                placeholder="产品简短描述，显示在产品列表中..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                详细描述（Description）
              </label>
              <textarea
                value={product.description || ''}
                onChange={(e) => setProduct({ ...product, description: e.target.value })}
                rows={6}
                placeholder="产品详细描述..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* 标签管理 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">标签</h2>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="输入标签后回车..."
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-1.5 bg-[#00F2FE] text-[#050505] rounded-lg text-sm font-semibold hover:bg-[#00C4CC] transition-colors"
              >
                + 添加
              </button>
            </div>
          </div>
          {product.tags && Array.isArray(product.tags) && product.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="ml-2 text-blue-400 hover:text-red-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">暂无标签</p>
          )}
        </div>

        {/* 主图 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">主图</h2>
          <div className="flex items-start space-x-4">
            {product.image && (
              <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-300">
                <img
                  src={product.image.startsWith('http') ? product.image : `https://pub-e5d14c6d386c4d90979458082617517a.r2.dev/${product.image}`}
                  alt="预览"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-product.svg';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setProduct({ ...product, image: '' })}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            )}
            
            <div className="flex-1 space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#00F2FE] file:text-[#050505] hover:file:bg-[#00C4CC]"
              />
              <p className="text-xs text-gray-500">或输入图片 URL</p>
              <input
                type="text"
                value={product.image || ''}
                onChange={(e) => setProduct({ ...product, image: e.target.value })}
                placeholder="https://cdn.example.com/image.png"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  图片 Alt 文本
                </label>
                <input
                  type="text"
                  value={product.alt || ''}
                  onChange={(e) => setProduct({ ...product, alt: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 产品特性（JSON对象格式） */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">产品特性（Features）</h2>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={featureKey}
                onChange={(e) => setFeatureKey(e.target.value)}
                placeholder="特性名"
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent w-28"
              />
              <input
                type="text"
                value={featureValue}
                onChange={(e) => setFeatureValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                placeholder="值"
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent w-28"
              />
              <button
                type="button"
                onClick={addFeature}
                className="px-4 py-1.5 bg-[#00F2FE] text-[#050505] rounded-lg text-sm font-semibold hover:bg-[#00C4CC] transition-colors"
              >
                + 添加
              </button>
            </div>
          </div>
          {product.features && Object.keys(product.features).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(product.features).map(([key, value]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-700">{key}:</span>
                    <span className="ml-2 text-sm text-gray-600">{String(value)}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFeature(key)}
                    className="ml-3 px-2 py-1 bg-red-100 text-red-600 rounded text-xs hover:bg-red-200 transition-colors"
                  >
                    删除
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">暂无特性</p>
          )}
        </div>

        {/* B2B 外贸属性 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">B2B 外贸属性</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                材质（Material）
              </label>
              <input
                type="text"
                value={product.material || ''}
                onChange={(e) => setProduct({ ...product, material: e.target.value })}
                placeholder="例如：TPE"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                净重（Net Weight, kg）
              </label>
              <input
                type="number"
                step="0.001"
                value={product.netWeight || ''}
                onChange={(e) => setProduct({ ...product, netWeight: parseFloat(e.target.value) || undefined })}
                placeholder="例如：2.5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                厂家货号（Supplier SKU）
              </label>
              <input
                type="text"
                value={product.supplierSku || ''}
                onChange={(e) => setProduct({ ...product, supplierSku: e.target.value })}
                placeholder="例如：S116001"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* 规格（独立表） */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">规格（Specifications）</h2>
            <button
              type="button"
              onClick={addSpecification}
              className="px-4 py-2 bg-[#00F2FE] text-[#050505] rounded-lg text-sm font-semibold hover:bg-[#00C4CC] transition-colors"
            >
              + 添加规格
            </button>
          </div>
          {specifications.length > 0 ? (
            <div className="space-y-3">
              {specifications.map((spec, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-600 mb-1">规格名称</label>
                    <input
                      type="text"
                      value={spec.specKey}
                      onChange={(e) => updateSpecification(index, 'specKey', e.target.value)}
                      placeholder="例如：尺寸"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-600 mb-1">规格值</label>
                    <input
                      type="text"
                      value={spec.specValue}
                      onChange={(e) => updateSpecification(index, 'specValue', e.target.value)}
                      placeholder="例如：20cm"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSpecification(index)}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    删除
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500">暂无规格</p>
              <p className="text-xs text-gray-400 mt-1">点击上方按钮添加产品规格</p>
            </div>
          )}
        </div>

        {/* 状态选择 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">状态选择</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                状态
              </label>
              <select
                value={product.status}
                onChange={(e) => setProduct({ ...product, status: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
              >
                <option value="DRAFT">草稿</option>
                <option value="ACTIVE">活跃</option>
                <option value="INACTIVE">停用</option>
              </select>
            </div>
          </div>
        </div>

        {/* 提交按钮 */}
        <div className="flex items-center justify-end space-x-4">
          <Link
            href="/admin/products"
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            取消
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-[#00F2FE] text-[#050505] rounded-lg font-semibold hover:bg-[#00C4CC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '创建中...' : '创建产品'}
          </button>
        </div>
      </form>
    </div>
  );
}
