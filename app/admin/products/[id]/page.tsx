'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { productAdminService, galleryAdminService } from '@/services';
import type { Product, Gallery, ProductSku, Category } from '@/types';
import { categories } from '@/lib/categories';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;
  const isEditing = productId !== 'new';

  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState<Partial<Product>>({
    name: '',
    title: '',
    brand: 'MythToy',
    image: '',
    alt: '',
    slug: '',
    description: '',
    currentPrice: 0,
    status: 'ACTIVE',
  });

  // 相册图片
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [draggedGalleryIndex, setDraggedGalleryIndex] = useState<number | null>(null);

  // SKU列表
  const [skus, setSkus] = useState<ProductSku[]>([]);

  // 分类选择状态
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

  useEffect(() => {
    if (isEditing && productId !== 'new') {
      fetchProduct();
    }
  }, [productId, isEditing]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await productAdminService.getProductById(parseInt(productId));
      setProduct(data);
      // 从产品数据中直接获取相册
      if (data.galleries) {
        setGalleries(data.galleries);
      }
      // 获取SKU列表
      if (data.productSkus) {
        setSkus(data.productSkus);
      }
      // 恢复分类选择状态
      if (data.categories) {
        const categoriesStr = Array.isArray(data.categories) ? data.categories[0] : data.categories;
        if (categoriesStr && typeof categoriesStr === 'string') {
          const parts = categoriesStr.split('/');
          if (parts.length === 2) {
            setSelectedCategory(parts[0]);
            setSelectedSubcategory(parts[1]);
          } else if (parts.length === 1) {
            setSelectedCategory(parts[0]);
            setSelectedSubcategory('');
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
      alert('获取产品详情失败');
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
    if (!product.description || product.description.trim() === '') {
      alert('请输入产品描述');
      return;
    }
    if (product.currentPrice === undefined || product.currentPrice === null || product.currentPrice <= 0) {
      alert('请输入正确的当前价格');
      return;
    }
    if (product.minOrder === undefined || product.minOrder === null || product.minOrder < 0) {
      alert('请输入正确的最小起订量（MOQ）');
      return;
    }

    setLoading(true);

    try {
      const productData = { 
        ...product,
        categories: selectedSubcategory ? `${selectedCategory}/${selectedSubcategory}` : selectedCategory,  // 保存分类路径
        productSkus: skus,  // 包含SKU数据
        galleries: galleries.map(g => ({
          id: g.id,
          productId: g.productId,
          imageUrl: g.imageUrl,
          alt: g.alt,
          sortOrder: g.sortOrder,
          isPrimary: g.isPrimary,
        }))  // 包含相册数据
      };
      
      if (isEditing) {
        await productAdminService.updateProduct(parseInt(productId), productData);
        alert('产品更新成功！');
      } else {
        await productAdminService.createProduct(productData);
        alert('产品创建成功！');
      }
      router.push('/admin/products');
    } catch (error) {
      console.error('Failed to save product:', error);
      alert('保存失败，请检查浏览器控制台错误信息');
    } finally {
      setLoading(false);
    }
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

  // 相册图片上传
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setLoading(true);
      const uploadedGalleries: Partial<Gallery>[] = [];

      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append('file', files[i]);

        // 先上传图片
        const response = await fetch('/api/v1/upload/product', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();
        if (result.code === 200 && result.data) {
          // 再创建相册记录
          uploadedGalleries.push({
            imageUrl: result.data,
            alt: product.alt || product.name || '',
            sortOrder: galleries.length + i,
            isPrimary: galleries.length === 0 && i === 0, // 第一张设为默认主图
          });
        }
      }

      if (uploadedGalleries.length > 0) {
        // 批量创建相册记录
        const createdGalleries = await galleryAdminService.batchAddGalleryImages(
          parseInt(productId),
          uploadedGalleries
        );
        setGalleries([...galleries, ...createdGalleries]);
        alert(`成功上传 ${uploadedGalleries.length} 张图片！`);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('图片上传失败');
    } finally {
      setLoading(false);
    }
  };

  const removeGalleryImage = async (gallery: Gallery) => {
    if (!gallery.id) return;
    if (!confirm('确定要删除这张图片吗？')) return;
    
    try {
      await galleryAdminService.deleteGallery(gallery.id);
      setGalleries(galleries.filter((_, i) => i !== galleries.indexOf(gallery)));
    } catch (error) {
      console.error('Failed to delete gallery:', error);
      alert('删除失败');
    }
  };

  const setAsPrimary = async (gallery: Gallery) => {
    if (!gallery.id) return;
    
    try {
      await galleryAdminService.setPrimaryImage(gallery.id);
      // 更新本地状态
      setGalleries(galleries.map((g) => ({
        ...g,
        isPrimary: g.id === gallery.id,
      })));
    } catch (error) {
      console.error('Failed to set primary image:', error);
      alert('设置主图失败');
    }
  };

  // 相册拖拽排序
  const handleGalleryDragStart = (index: number) => {
    setDraggedGalleryIndex(index);
  };

  const handleGalleryDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedGalleryIndex === null || draggedGalleryIndex === index) return;

    // 交换位置
    const updatedGalleries = [...galleries];
    const draggedGallery = updatedGalleries[draggedGalleryIndex];
    updatedGalleries.splice(draggedGalleryIndex, 1);
    updatedGalleries.splice(index, 0, draggedGallery);
    setGalleries(updatedGalleries);
  };

  const handleGalleryDragEnd = async () => {
    if (draggedGalleryIndex === null) return;
    
    // 更新所有相册的排序值
    try {
      const updatePromises = galleries.map((gallery, index) => {
        if (gallery.id) {
          return galleryAdminService.updateSortOrder(gallery.id, index);
        }
        return Promise.resolve();
      });
      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Failed to update gallery order:', error);
    }
    
    setDraggedGalleryIndex(null);
  };

  // SKU管理
  const addSku = () => {
    setSkus([...skus, { sku: '', stock: 0 }]);
  };

  const updateSku = (index: number, field: keyof ProductSku, value: any) => {
    const updatedSkus = [...skus];
    updatedSkus[index] = { ...updatedSkus[index], [field]: value };
    setSkus(updatedSkus);
  };

  const removeSku = (index: number) => {
    setSkus(skus.filter((_, i) => i !== index));
  };

  const moveSkuUp = (index: number) => {
    if (index === 0) return;
    const updatedSkus = [...skus];
    [updatedSkus[index - 1], updatedSkus[index]] = [updatedSkus[index], updatedSkus[index - 1]];
    setSkus(updatedSkus);
  };

  const moveSkuDown = (index: number) => {
    if (index === skus.length - 1) return;
    const updatedSkus = [...skus];
    [updatedSkus[index], updatedSkus[index + 1]] = [updatedSkus[index + 1], updatedSkus[index]];
    setSkus(updatedSkus);
  };

  if (loading && isEditing && !product.name) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00F2FE]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? '编辑产品' : '添加新产品'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditing ? '修改产品信息' : '创建新的产品条目'}
          </p>
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
                placeholder="例如：/female-sex-toys/clit-vibrators/the-muse"
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
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.slug} className="border border-gray-200 rounded-lg">
                {/* 一级分类 */}
                <div
                  className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
                  onClick={() => {
                    if (category.children && category.children.length > 0) {
                      setExpandedCategories(prev =>
                        prev.includes(category.slug)
                          ? prev.filter(s => s !== category.slug)
                          : [...prev, category.slug]
                      );
                    } else {
                      setSelectedCategory(category.slug);
                      setSelectedSubcategory('');
                    }
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="category"
                      value={category.slug}
                      checked={selectedCategory === category.slug && !selectedSubcategory}
                      onChange={() => {
                        setSelectedCategory(category.slug);
                        setSelectedSubcategory('');
                      }}
                      className="w-4 h-4 text-[#00F2FE] focus:ring-[#00F2FE]"
                    />
                    <span className="font-medium text-gray-900">{category.name}</span>
                  </div>
                  {category.children && category.children.length > 0 && (
                    <span className="text-gray-400">
                      {expandedCategories.includes(category.slug) ? '▼' : '▶'}
                    </span>
                  )}
                </div>

                {/* 二级分类 */}
                {category.children && category.children.length > 0 && expandedCategories.includes(category.slug) && (
                  <div className="pl-8 pr-3 pb-3 space-y-2">
                    {category.children.map((sub) => (
                      <div
                        key={sub.slug}
                        className="flex items-center space-x-2 p-2 cursor-pointer hover:bg-gray-50 rounded"
                        onClick={() => {
                          setSelectedCategory(category.slug);
                          setSelectedSubcategory(sub.slug);
                        }}
                      >
                        <input
                          type="radio"
                          name="subcategory"
                          value={sub.slug}
                          checked={selectedSubcategory === sub.slug}
                          onChange={() => {
                            setSelectedCategory(category.slug);
                            setSelectedSubcategory(sub.slug);
                          }}
                          className="w-4 h-4 text-[#00F2FE] focus:ring-[#00F2FE]"
                        />
                        <span className="text-gray-700">{sub.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          {selectedCategory && (
            <p className="text-xs text-gray-500 mt-2">
              已选择: {selectedCategory}{selectedSubcategory ? ` / ${selectedSubcategory}` : ''}
            </p>
          )}
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
                  {/* 移动按钮 */}
                  <div className="flex flex-col space-y-1">
                    <button
                      type="button"
                      onClick={() => moveSkuUp(index)}
                      disabled={index === 0}
                      className="w-8 h-6 bg-gray-200 rounded text-gray-600 hover:bg-gray-300 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveSkuDown(index)}
                      disabled={index === skus.length - 1}
                      className="w-8 h-6 bg-gray-200 rounded text-gray-600 hover:bg-gray-300 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      ↓
                    </button>
                  </div>
                  
                  {/* SKU 编码 */}
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
                  
                  {/* 颜色 */}
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
                  
                  {/* 库存 */}
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-600 mb-1">库存</label>
                    <input
                      type="number"
                      value={sku.stock}
                      onChange={(e) => updateSku(index, 'stock', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                    />
                  </div>
                  
                  {/* 删除按钮 */}
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

        {/* 价格和库存 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">价格信息</h2>
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
                    value={product.image || ''}
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
                value={product.alt || ''}
                onChange={(e) => setProduct({ ...product, alt: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                产品描述
              </label>
              <textarea
                value={product.description || ''}
                onChange={(e) => setProduct({ ...product, description: e.target.value })}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* 产品相册 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">产品相册</h2>
              <p className="text-xs text-gray-500 mt-1">拖动图片可以调整排序</p>
            </div>
            <label className="px-4 py-2 bg-[#00F2FE] text-[#050505] rounded-lg text-sm font-semibold hover:bg-[#00C4CC] transition-colors cursor-pointer">
              + 上传相册图片
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
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {galleries.map((gallery, index) => (
                <div
                  key={gallery.id || gallery.imageUrl}
                  draggable
                  onDragStart={() => handleGalleryDragStart(index)}
                  onDragOver={(e) => handleGalleryDragOver(e, index)}
                  onDragEnd={handleGalleryDragEnd}
                  className="relative group cursor-move"
                >
                  <img
                    src={gallery.imageUrl.startsWith('http') ? gallery.imageUrl : `https://pub-e5d14c6d386c4d90979458082617517a.r2.dev/${gallery.imageUrl}`}
                    alt={gallery.alt || '产品图片'}
                    className="w-full h-32 object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-product.svg';
                    }}
                  />
                  {/* 排序号 */}
                  <div className="absolute top-1 left-1 px-2 py-1 bg-gray-800 bg-opacity-70 text-white text-xs font-semibold rounded">
                    #{index + 1}
                  </div>
                  {/* 主图标记 */}
                  {gallery.isPrimary && (
                    <div className="absolute top-1 right-1 px-2 py-1 bg-[#00F2FE] text-[#050505] text-xs font-semibold rounded">
                      主图
                    </div>
                  )}
                  {/* 操作按钮 */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2 rounded-lg">
                    {!gallery.isPrimary && (
                      <button
                        type="button"
                        onClick={() => setAsPrimary(gallery)}
                        className="px-3 py-1 bg-[#00F2FE] text-[#050505] text-xs font-semibold rounded hover:bg-[#00C4CC]"
                      >
                        设为主图
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(gallery)}
                      className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded hover:bg-red-600"
                    >
                      删除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500">暂无相册图片</p>
              <p className="text-xs text-gray-400 mt-1">点击上方按钮上传图片</p>
            </div>
          )}
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
            {loading ? '保存中...' : isEditing ? '保存更改' : '创建产品'}
          </button>
        </div>
      </form>
    </div>
  );
}
