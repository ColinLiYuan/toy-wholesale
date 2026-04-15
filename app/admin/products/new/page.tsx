'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { productAdminService } from '@/services';
import type { Product } from '@/types';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  // 后端实体字段：name, title, shortDescription, slug, brand, status, image, alt, currentPrice, description, categories, colors
  const [product, setProduct] = useState<Partial<Product>>({
    name: '',
    title: '',
    sku: '',
    shortDescription: '',
    slug: '',
    brand: 'MythToy',
    image: '',
    alt: '',
    description: '',
    currentPrice: 0,
    status: 'ACTIVE',
    colors: '[]',  // JSON 字符串
    categories: '[]',  // JSON 字符串
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 调用创建 API
      console.log('发送的产品数据:', JSON.stringify(product, null, 2));
      await productAdminService.createProduct(product);
      alert('产品创建成功！');
      router.push('/admin/products');
    } catch (error) {
      console.error('Failed to create product:', error);
      alert('创建失败，请检查后端服务是否运行在 localhost:9356');
    } finally {
      setLoading(false);
    }
  };

  const addFeature = () => {
    setProduct({
      ...product,
      features: [...(product.features || []), ''],
    });
  };

  const removeFeature = (index: number) => {
    setProduct({
      ...product,
      features: product.features?.filter((_, i) => i !== index),
    });
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...(product.features || [])];
    newFeatures[index] = value;
    setProduct({ ...product, features: newFeatures });
  };

  // 图片上传处理
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);

      console.log('开始上传图片...');
      // 使用 Next.js 代理，避免 CORS 问题
      const response = await fetch('/api/v1/upload/product', {
        method: 'POST',
        body: formData,
      });

      console.log('响应状态:', response.status);
      const result = await response.json();
      console.log('响应结果:', result);
      
      if (result.code === 200 && result.data) {
        setProduct({ ...product, image: result.data });
        alert('图片上传成功！');
      } else {
        alert('图片上传失败：' + result.message);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('图片上传失败，请检查：1.后端服务是否运行 2.浏览器控制台错误');
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
                SKU *
              </label>
              <input
                type="text"
                value={product.sku}
                onChange={(e) => setProduct({ ...product, sku: e.target.value })}
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
                value={product.brand}
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
                placeholder="例如：/female-sex-toys/clit-vibrators/the-muse"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                required
              />
              <p className="text-xs text-gray-500 mt-1">用于 SEO 友好的 URL</p>
            </div>
          </div>
        </div>

        {/* 价格和库存 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">价格和库存</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                原价
              </label>
              <input
                type="number"
                step="0.01"
                value={product.originalPrice}
                onChange={(e) => setProduct({ ...product, originalPrice: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                最小起订量
              </label>
              <input
                type="number"
                value={product.minOrder}
                onChange={(e) => setProduct({ ...product, minOrder: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* 图片和描述 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">图片和描述</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                主图
              </label>
              
              {/* 图片上传区域 */}
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
                    value={product.image}
                    onChange={(e) => setProduct({ ...product, image: e.target.value })}
                    placeholder="https://cdn.example.com/image.png"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                图片 Alt 文本
              </label>
              <input
                type="text"
                value={product.alt}
                onChange={(e) => setProduct({ ...product, alt: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                产品描述
              </label>
              <textarea
                value={product.description}
                onChange={(e) => setProduct({ ...product, description: e.target.value })}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* 产品特性 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">产品特性</h2>
            <button
              type="button"
              onClick={addFeature}
              className="px-4 py-2 bg-[#00F2FE] text-[#050505] rounded-lg text-sm font-semibold hover:bg-[#00C4CC] transition-colors"
            >
              + 添加特性
            </button>
          </div>
          <div className="space-y-3">
            {(product.features || []).map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => updateFeature(index, e.target.value)}
                  placeholder={`特性 ${index + 1}`}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                >
                  删除
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 状态和标签 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">状态和标签</h2>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                徽章标签
              </label>
              <input
                type="text"
                value={product.badge || ''}
                onChange={(e) => setProduct({ ...product, badge: e.target.value || null })}
                placeholder="例如：NEW, HOT, SALE"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
              />
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
