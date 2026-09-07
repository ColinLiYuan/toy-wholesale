'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { productAdminService } from '@/services';
import type { Product, ProductSku, ProductSpecification } from '@/types';
import { getSiteId } from '@/lib/api-client';
import CategorySelector from '@/components/CategorySelector';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [product, setProduct] = useState<Partial<Product>>({
    name: '',
    title: '',
    slug: '',
    brand: '',
    image: '',
    alt: '',
    description: '',
    shortDescription: '',
    currentPrice: undefined,
    status: 'ACTIVE',
    colors: [],
    tags: [],
    priority: 0,
    features: {},
    minOrder: 1,
    material: '',
    netWeight: undefined,
    supplierSku: '',
    supplierId: undefined,
  });
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [skus, setSkus] = useState<ProductSku[]>([{ sku: '', color: '', image: '', stock: 0 }]);
  const [specifications, setSpecifications] = useState<ProductSpecification[]>([]);
  const [galleries, setGalleries] = useState<Array<{ imageUrl: string; alt?: string; sortOrder: number; isPrimary: boolean }>>([]);
  
  // 特性管理
  const [featureKey, setFeatureKey] = useState('');
  const [featureValue, setFeatureValue] = useState('');

  const addFeature = () => {
    if (!featureKey.trim()) {
      alert('请输入特性名称');
      return;
    }
    
    const features: Record<string, unknown> = { ...((product.features as Record<string, unknown>) || {}) };
    features[featureKey] = featureValue;
    setProduct({ ...product, features });
    setFeatureKey('');
    setFeatureValue('');
  };

  const removeFeature = (key: string) => {
    const features: Record<string, unknown> = { ...((product.features as Record<string, unknown>) || {}) };
    delete features[key];
    setProduct({ ...product, features });
  };

  // 标签管理
  const [newTag, setNewTag] = useState('');

  const addTag = () => {
    if (!newTag.trim()) return;
    
    // 按逗号分割标签，并去除空白
    const tagsToAdd = newTag.split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    
    const currentTags = Array.isArray(product.tags) ? [...product.tags] : [];
    
    // 添加不重复的标签
    tagsToAdd.forEach(tag => {
      if (!currentTags.includes(tag)) {
        currentTags.push(tag);
      }
    });
    
    setProduct({ ...product, tags: currentTags });
    setNewTag('');
  };

  const removeTag = (index: number) => {
    const tags = Array.isArray(product.tags) ? [...product.tags] : [];
    tags.splice(index, 1);
    setProduct({ ...product, tags });
  };

  // SKU管理
  const colorOptions = [
    { value: 'BK', label: '黑色' },
    { value: 'WH', label: '白色' },
    { value: 'RD', label: '红色' },
    { value: 'PK', label: '粉色' },
    { value: 'PU', label: '紫色' },
    { value: 'BL', label: '蓝色' },
    { value: 'GN', label: '绿色' },
    { value: 'SK', label: '肤色' },
    { value: 'CL', label: '透明' },
  ];

  const addSku = () => {
    setSkus([...skus, { sku: '', color: '', image: '', stock: 0, weightWithBox: '' } as any]);
  };

  const handleColorToggle = (colorCode: string) => {
    const existing = skus.findIndex(s => (s as any).colorCode === colorCode);
    if (existing >= 0) {
      setSkus(skus.filter((_, i) => i !== existing));
    } else {
      setSkus([...skus, { sku: '', color: colorCode, image: '', stock: 0, weightWithBox: '', colorCode } as any]);
    }
  };
  const removeSku = (index: number) => {
    setSkus(skus.filter((_, i) => i !== index));
  };
  const updateSku = (index: number, field: string, value: any) => {
    const updated = [...skus];
    (updated[index] as any)[field] = value;
    setSkus(updated);
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

  // 相册管理
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setLoading(true);
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/v1/upload/product', {
          method: 'POST',
          headers: getSiteId() ? { 'X-Site-Id': getSiteId() } : {},
          body: formData,
        });

        // 检查响应状态
        if (!response.ok) {
          console.error('Upload failed with status:', response.status);
          alert(`图片上传失败 (HTTP ${response.status})`);
          continue;
        }

        // 检查响应内容类型
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          console.error('Response is not JSON:', contentType);
          const text = await response.text();
          console.error('Response text:', text);
          alert('图片上传失败：服务器返回格式错误');
          continue;
        }

        const result = await response.json();
        if (result.code === 200 && result.data) {
          setGalleries(prev => [...prev, {
            imageUrl: result.data,
            alt: '',
            sortOrder: prev.length,
            isPrimary: prev.length === 0, // 第一张设为主图
          }]);
        }
      }
      
      alert(`成功上传 ${files.length} 张图片！`);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('图片上传失败');
    } finally {
      setLoading(false);
    }
  };

  const removeGallery = (index: number) => {
    const updated = galleries.filter((_, i) => i !== index);
    // 如果删除的是主图，将第一张设为主图
    if (galleries[index].isPrimary && updated.length > 0) {
      updated[0].isPrimary = true;
    }
    setGalleries(updated);
  };

  const setAsPrimary = (index: number) => {
    const updated = galleries.map((g, i) => ({
      ...g,
      isPrimary: i === index,
    }));
    setGalleries(updated);
  };

  const moveGallery = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= galleries.length) return;
    
    const updated = [...galleries];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    
    // 更新 sortOrder
    updated.forEach((g, i) => {
      g.sortOrder = i;
    });
    
    setGalleries(updated);
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
        headers: getSiteId() ? { 'X-Site-Id': getSiteId() } : {},
        body: formData,
      });

      // 检查响应状态
      if (!response.ok) {
        console.error('Upload failed with status:', response.status);
        alert(`图片上传失败 (HTTP ${response.status})`);
        return;
      }

      // 检查响应内容类型
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Response is not JSON:', contentType);
        const text = await response.text();
        console.error('Response text:', text);
        alert('图片上传失败：服务器返回格式错误');
        return;
      }

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

    setLoading(true);

    try {
      // 构建产品数据（后端 Product 实体字段）
      const productData: any = { 
        name: product.name,
        title: product.title,
        slug: product.slug,
        brand: product.brand || null,
        status: product.status,
        image: product.image || null,
        alt: product.alt || null,
        currentPrice: product.currentPrice,
        shortDescription: product.shortDescription || null,
        description: product.description || null,
        categories: selectedCategories.length > 0 ? JSON.stringify(selectedCategories) : null,
        colors: skus.length > 0 ? JSON.stringify(skus.map(s => s.color).filter(Boolean)) : null,
        minOrder: product.minOrder,
        material: product.material || null,
        netWeight: product.netWeight,
        supplierSku: product.supplierSku || null,
        supplierId: product.supplierId,
      };
      
      // 根据选中的颜色生成 productSkus（后端需要 productSkus 数组才能自动生成 SKU 编码）
      if (skus.length > 0) {
        productData.productSkus = skus.map((s: any) => ({
          sku: s.sku || '',
          color: s.color || s.colorCode || '',
          image: s.image || '',
          stock: s.stock || 0,
          weightWithBox: s.weightWithBox || null,
        }));
      }
      
      // 处理tags（JSON数组）
      if (product.tags && Array.isArray(product.tags) && product.tags.length > 0) {
        productData.tags = JSON.stringify(product.tags);
      }
      
      // 处理features（JSON对象 -> 字符串）
      if (product.features && Object.keys(product.features).length > 0) {
        productData.features = JSON.stringify(product.features);
      }
      
      
      // 创建产品
      const createdProduct = await productAdminService.createProduct(productData);
      
      // 如果有相册，上传相册
      if (galleries.length > 0 && createdProduct.id) {
        try {
          for (const gallery of galleries) {
            await fetch(`/api/v1/products/admin/${createdProduct.id}/galleries`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(getSiteId() ? { 'X-Site-Id': getSiteId() } : {}),
              },
              body: JSON.stringify(gallery),
            });
          }
        } catch (error) {
          console.error('Failed to upload galleries:', error);
        }
      }
      
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
          <div className="flex items-center gap-4 mb-4">
            <p className="text-sm text-gray-500">选择颜色自动生成，或手动添加</p>
            <button type="button" onClick={addSku}
              className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">+ 添加SKU</button>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {colorOptions.map((c) => {
              const selected = skus.some((s: any) => (s.colorCode || s.color) === c.value);
              return (
                <button key={c.value} type="button"
                  onClick={() => handleColorToggle(c.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${selected ? 'bg-brand text-white border-brand' : 'bg-white text-gray-700 border-gray-300 hover:border-brand'}`}>
                  {c.label}
                </button>
              );
            })}
          </div>

          {skus.length > 0 && (
            <div className="space-y-2">
              {skus.map((sku: any, index: number) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="w-16 text-sm font-medium text-gray-700">
                    {colorOptions.find(c => c.value === (sku.colorCode || sku.color))?.label || sku.color || '-'}
                  </span>
                  <input type="text" value={sku.sku || ''}
                    onChange={(e) => updateSku(index, 'sku', e.target.value)}
                    placeholder="SKU编码（留空自动生成）"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                  <input type="number" value={sku.stock || 0}
                    onChange={(e) => updateSku(index, 'stock', parseInt(e.target.value) || 0)}
                    placeholder="库存"
                    className="w-16 px-2 py-2 border border-gray-300 rounded-lg text-sm" />
                  <input type="text" value={(sku as any).weightWithBox || ''}
                    onChange={(e) => updateSku(index, 'weightWithBox', e.target.value)}
                    placeholder="重量(kg)"
                    className="w-20 px-2 py-2 border border-gray-300 rounded-lg text-sm" />
                  <button type="button" onClick={() => removeSku(index)}
                    className="px-2 py-2 text-red-600 hover:text-red-900">删除</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 价格信息 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">价格信息</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                当前价格
              </label>
              <input
                type="number"
                step="0.01"
                value={product.currentPrice ?? ''}
                onChange={(e) => setProduct({ ...product, currentPrice: e.target.value ? parseFloat(e.target.value) : undefined })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                placeholder="选填"
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
                placeholder="输入标签，用逗号分隔多个标签..."
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

        {/* 排序优先级 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">排序优先级</h2>
          <p className="text-sm text-gray-500 mb-3">数值越大越靠前，用于控制首页推荐产品的展示顺序。</p>
          <input
            type="number"
            value={product.priority ?? 0}
            onChange={(e) => setProduct({ ...product, priority: parseInt(e.target.value) || 0 })}
            placeholder="0"
            className="w-48 px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
          />
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

        {/* 产品相册 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">产品相册（Gallery）</h2>
            <label className="px-4 py-2 bg-[#00F2FE] text-[#050505] rounded-lg text-sm font-semibold hover:bg-[#00C4CC] transition-colors cursor-pointer">
              + 上传图片
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryUpload}
                className="hidden"
              />
            </label>
          </div>
          
          {galleries.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleries.map((gallery, index) => (
                <div key={index} className="relative group border border-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={gallery.imageUrl.startsWith('http') ? gallery.imageUrl : `https://pub-e5d14c6d386c4d90979458082617517a.r2.dev/${gallery.imageUrl}`}
                    alt={gallery.alt || 'Product image'}
                    className="w-full h-32 object-contain bg-white"
                  />
                  
                  {gallery.isPrimary && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">
                      主图
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex space-x-2">
                      {!gallery.isPrimary && (
                        <button
                          type="button"
                          onClick={() => setAsPrimary(index)}
                          className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                        >
                          设为主图
                        </button>
                      )}
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => moveGallery(index, 'up')}
                          className="px-2 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
                        >
                          ↑
                        </button>
                      )}
                      {index < galleries.length - 1 && (
                        <button
                          type="button"
                          onClick={() => moveGallery(index, 'down')}
                          className="px-2 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
                        >
                          ↓
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeGallery(index)}
                        className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-2 bg-gray-50">
                    <input
                      type="text"
                      value={gallery.alt}
                      onChange={(e) => {
                        const updated = [...galleries];
                        updated[index].alt = e.target.value;
                        setGalleries(updated);
                      }}
                      placeholder="Alt 文本"
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500">暂无相册图片</p>
              <p className="text-xs text-gray-400 mt-1">点击上方按钮上传多张图片</p>
            </div>
          )}
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
                净重（Net Weight, g）
              </label>
              <input
                type="number"
                step="1"
                value={product.netWeight || ''}
                onChange={(e) => setProduct({ ...product, netWeight: parseFloat(e.target.value) || undefined })}
                placeholder="例如：2500"
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
