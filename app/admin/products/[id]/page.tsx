'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { productAdminService, galleryAdminService, supplierService, skuPurchasePriceService } from '@/services';
import type { Product, Gallery, ProductSku, ProductSpecification, Supplier } from '@/types';
import CategorySelector from '@/components/CategorySelector';

// 解析分类数据（支持 JSON 数组和斜杠分隔格式）
const parseCategories = (categoriesData: string | string[]): string[] => {
  try {
    if (Array.isArray(categoriesData)) {
      return categoriesData;
    }
    
    if (typeof categoriesData === 'string') {
      // 尝试解析 JSON 数组
      try {
        const jsonParsed = JSON.parse(categoriesData);
        if (Array.isArray(jsonParsed)) {
          return jsonParsed;
        }
      } catch {
        // 如果不是 JSON，尝试斜杠分隔格式 "category/subcategory"
        const parts = categoriesData.split('/').filter(Boolean);
        if (parts.length > 0) {
          return parts;
        }
      }
    }
    
    return [];
  } catch (error) {
    console.error('Failed to parse categories:', error);
    return [];
  }
};

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

  // 分类选择状态（多选）
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // 供应商列表（用于进价管理）
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  // SKU 进价管理
  const [purchasePrices, setPurchasePrices] = useState<Record<number, any[]>>({});
  const [expandedSkuId, setExpandedSkuId] = useState<number | null>(null);
  const [showAddPriceForm, setShowAddPriceForm] = useState<number | null>(null);
  const [editingPriceId, setEditingPriceId] = useState<number | null>(null);
  const [selectedSkuIds, setSelectedSkuIds] = useState<Set<number>>(new Set());
  const [batchForm, setBatchForm] = useState({
    supplierId: 0,
    purchasePrice: 0,
    currency: 'CNY',
    moq: 1,
    notes: '',
  });
  const [newPriceForm, setNewPriceForm] = useState({
    supplierId: 0,
    purchasePrice: 0,
    currency: 'CNY',
    moq: 1,
    notes: '',
  });

  useEffect(() => {
    if (isEditing && productId !== 'new') {
      fetchProduct();
    }
  }, [productId, isEditing]);

  // 加载供应商列表
  useEffect(() => {
    supplierService.getAllSuppliers().then(setSuppliers).catch(console.error);
  }, []);

  const loadSkuPurchasePrices = async (skuId: number) => {
    try {
      const prices = await skuPurchasePriceService.getBySkuId(skuId);
      setPurchasePrices(prev => ({ ...prev, [skuId]: prices }));
    } catch (error) {
      console.error('Failed to load purchase prices for sku', skuId, error);
    }
  };

  // 当 SKU 列表变化时，加载每个已保存 SKU 的进价
  useEffect(() => {
    if (skus.length > 0) {
      skus.forEach((sku) => {
        if (sku.id) {
          loadSkuPurchasePrices(sku.id);
        }
      });
    }
  }, [skus]);

  // 通过 ?tab=prices 参数自动展开所有SKU进价
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('tab') === 'prices') {
      setTimeout(() => {
        skus.forEach((sku) => { if (sku.id) setExpandedSkuId(sku.id); });
        document.getElementById('purchase-prices')?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  }, [skus]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const data = await productAdminService.getProductById(parseInt(productId));
      
      // 解析features（JSON字符串 -> 对象）
      if (data.features && typeof data.features === 'string') {
        try {
          data.features = JSON.parse(data.features);
        } catch (e) {
          console.error('Failed to parse features:', e);
          data.features = {};
        }
      }
      
      // 解析tags（JSON字符串 -> 数组）
      if (data.tags && typeof data.tags === 'string') {
        try {
          data.tags = JSON.parse(data.tags);
        } catch (e) {
          console.error('Failed to parse tags:', e);
          data.tags = [];
        }
      }
      
      // 处理数值字段
      // 价格改为可选，0、null、空字符串、负数都视为未填写
      if (data.currentPrice === null || data.currentPrice === undefined || data.currentPrice === 0) {
        (data as any).currentPrice = undefined;
      } else if (typeof data.currentPrice === 'number' && data.currentPrice <= 0) {
        // 如果是负数或 0，也清空
        (data as any).currentPrice = undefined;
      }
      data.minOrder = data.minOrder ?? 1;
      data.netWeight = data.netWeight ?? undefined;
      data.supplierId = data.supplierId ?? undefined;
      
      setProduct(data);
      // 从产品数据中直接获取相册
      if (data.galleries) {
        setGalleries(data.galleries);
      }
      // 获取SKU列表
      if (data.productSkus) {
        setSkus(data.productSkus);
      }
      // 获取规格列表（独立表）
      if (data.specifications) {
        setSpecifications(data.specifications);
      }
      // 恢复分类选择状态（支持多种数据格式）
      if (data.categories) {
        const parsedCategories = parseCategories(data.categories);
        if (parsedCategories.length > 0) {
          setSelectedCategories(parsedCategories);
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
    if (product.minOrder === undefined || product.minOrder === null || product.minOrder < 0) {
      alert('请输入正确的最小起订量（MOQ）');
      return;
    }

    setLoading(true);

    try {
      // 只发送后端实体中存在的字段
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
        colors: typeof product.colors === 'string' ? product.colors : (Array.isArray(product.colors) && product.colors.length > 0 ? JSON.stringify(product.colors) : null),
        minOrder: product.minOrder,
        material: product.material || null,
        netWeight: product.netWeight,
        supplierSku: product.supplierSku || null,
        supplierId: product.supplierId,
      };
      
      // 处理tags（JSON数组）
      if (product.tags) {
        productData.tags = typeof product.tags === 'string' ? product.tags : JSON.stringify(product.tags);
      }
      
      // 处理features（JSON对象 -> 字符串）
      // 无论是否有内容都传递，确保能清空 features
      if (product.features && typeof product.features === 'object' && Object.keys(product.features).length > 0) {
        productData.features = JSON.stringify(product.features);
      } else {
        productData.features = ''; // 空字符串，后端会清空
      }
      
      // 处理规格（独立表）
      if (specifications && specifications.length > 0) {
        productData.specifications = specifications.map(spec => ({
          specKey: spec.specKey,
          specValue: spec.specValue,
        }));
      }
      
      // 处理SKU列表（包含库存信息）
      if (skus && skus.length > 0) {
        productData.productSkus = skus;
      }
      
      
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
        headers: {
          'X-Site-Id': 'toy',
        },
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
          headers: {
            'X-Site-Id': 'toy',
          },
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

  const moveGallery = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= galleries.length) return;

    const current = galleries[index];
    const target = galleries[targetIndex];
    if (!current.id || !target.id) return;

    const currentOrder = current.sortOrder;
    const targetOrder = target.sortOrder;

    try {
      await Promise.all([
        galleryAdminService.updateSortOrder(current.id, targetOrder),
        galleryAdminService.updateSortOrder(target.id, currentOrder),
      ]);
      const newGalleries = [...galleries];
      [newGalleries[index], newGalleries[targetIndex]] = [newGalleries[targetIndex], newGalleries[index]];
      newGalleries[index].sortOrder = targetOrder;
      newGalleries[targetIndex].sortOrder = currentOrder;
      setGalleries(newGalleries);
    } catch (error) {
      console.error('Failed to reorder gallery:', error);
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

  // SKU管理（可编辑，支持进价管理）

  const addSku = () => {
    setSkus([...skus, { sku: '', color: '', stock: 0 }]);
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

  // 进价管理辅助函数
  const handleSavePrice = async (skuId: number) => {
    if (!newPriceForm.supplierId || !newPriceForm.purchasePrice) {
      alert('请填写供应商和采购价格');
      return;
    }
    try {
      if (editingPriceId) {
        await skuPurchasePriceService.update(editingPriceId, {
          purchasePrice: newPriceForm.purchasePrice,
          currency: newPriceForm.currency,
          moq: newPriceForm.moq,
          notes: newPriceForm.notes || undefined,
        });
      } else {
        await skuPurchasePriceService.create({
          skuId,
          supplierId: newPriceForm.supplierId,
          purchasePrice: newPriceForm.purchasePrice,
          currency: newPriceForm.currency,
          moq: newPriceForm.moq,
          notes: newPriceForm.notes || undefined,
        });
      }
      setShowAddPriceForm(null);
                                  setEditingPriceId(null);
      setEditingPriceId(null);
      setNewPriceForm({ supplierId: 0, purchasePrice: 0, currency: 'CNY', moq: 1, notes: '' });
      await loadSkuPurchasePrices(skuId);
    } catch (error) {
      console.error('Failed to save purchase price:', error);
      alert('保存进价失败');
    }
  };

  const handleDeletePrice = async (priceId: number, skuId: number) => {
    try {
      await skuPurchasePriceService.delete(priceId);
      await loadSkuPurchasePrices(skuId);
    } catch (error) {
      console.error('Failed to delete purchase price:', error);
      alert('删除进价失败');
    }
  };

  // 产品特性管理（JSON对象格式）
  const [featureKey, setFeatureKey] = useState('');
  const [featureValue, setFeatureValue] = useState('');
  
  // 获取解析后的features对象
  const getFeaturesObject = (): Record<string, any> => {
    if (!product.features) return {};
    
    // 如果已经是对象，直接返回
    if (typeof product.features === 'object' && !Array.isArray(product.features)) {
      return product.features;
    }
    
    // 如果是字符串，尝试解析
    if (typeof product.features === 'string') {
      try {
        const parsed = JSON.parse(product.features);
        return typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
      } catch (e) {
        console.error('Failed to parse features:', e);
        return {};
      }
    }
    
    return {};
  };

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

  // 标签管理（数组格式）
  const [newTag, setNewTag] = useState('');

  const addTag = () => {
    if (!newTag.trim()) return;
    
    // 按逗号分割标签，并去除空白
    const tagsToAdd = newTag.split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    
    const currentTags = Array.isArray(product.tags) ? [...product.tags] : (product.tags ? JSON.parse(product.tags) : []);
    
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
    const tags = Array.isArray(product.tags) ? [...product.tags] : (product.tags ? JSON.parse(product.tags) : []);
    tags.splice(index, 1);
    setProduct({ ...product, tags });
  };

  // 规格管理（独立表）
  const [specifications, setSpecifications] = useState<ProductSpecification[]>([]);

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

        {/* SKU 管理（可编辑） */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">SKU 管理</h2>
              <p className="text-sm text-gray-500 mt-1">编辑 SKU 编码、颜色和库存，或留空 SKU 编码让后端自动生成</p>
            </div>
            <button
              type="button"
              onClick={() => setSkus([...skus, { sku: '', color: '', stock: 0 }])}
              className="px-4 py-2 bg-[#00F2FE] text-[#050505] rounded-lg text-sm font-semibold hover:bg-[#00C4CC] transition-colors"
            >
              + 添加 SKU
            </button>
          </div>

          {skus.length > 0 ? (
            <div className="space-y-3">
              {skus.map((sku, index) => (
                <div key={index} className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  {/* SKU 编码 */}
                  <div className="flex-1 min-w-0">
                    <label className="block text-xs font-medium text-gray-600 mb-1">SKU 编码</label>
                    <input
                      type="text"
                      value={sku.sku}
                      onChange={(e) => {
                        const updated = [...skus];
                        updated[index] = { ...updated[index], sku: e.target.value };
                        setSkus(updated);
                      }}
                      placeholder="留空自动生成"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                    />
                  </div>
                  {/* 颜色 */}
                  <div className="w-28 flex-shrink-0">
                    <label className="block text-xs font-medium text-gray-600 mb-1">颜色</label>
                    <input
                      type="text"
                      value={sku.color || ''}
                      onChange={(e) => {
                        const updated = [...skus];
                        updated[index] = { ...updated[index], color: e.target.value };
                        setSkus(updated);
                      }}
                      placeholder="可选"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                    />
                  </div>
                  {/* 库存 */}
                  <div className="w-24 flex-shrink-0">
                    <label className="block text-xs font-medium text-gray-600 mb-1">库存</label>
                    <input
                      type="number"
                      min="0"
                      value={sku.stock}
                      onChange={(e) => {
                        const updated = [...skus];
                        updated[index] = { ...updated[index], stock: parseInt(e.target.value) || 0 };
                        setSkus(updated);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                    />
                  </div>
                  {/* 排序按钮 */}
                  <div className="flex flex-col gap-1 mt-5">
                    <button
                      type="button"
                      onClick={() => moveSkuUp(index)}
                      disabled={index === 0}
                      className="px-2 py-0.5 text-xs bg-gray-200 text-gray-600 rounded hover:bg-gray-300 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="上移"
                    >↑</button>
                    <button
                      type="button"
                      onClick={() => moveSkuDown(index)}
                      disabled={index === skus.length - 1}
                      className="px-2 py-0.5 text-xs bg-gray-200 text-gray-600 rounded hover:bg-gray-300 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="下移"
                    >↓</button>
                  </div>
                  {/* 删除按钮 */}
                  <button
                    type="button"
                    onClick={() => removeSku(index)}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors mt-5 text-sm"
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

        {/* SKU 进价管理 */}
        {skus.length > 0 && (
          <div id="purchase-prices" className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">进价管理</h2>
            <p className="text-sm text-gray-500 mb-4">为每个 SKU 设置不同供应商的采购价格</p>

            {/* 批量修改 */}
            {selectedSkuIds.size > 0 && (
              <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <span className="text-sm font-semibold text-yellow-800 mr-3">已选 {selectedSkuIds.size} 个 SKU</span>
                <div className="inline-flex items-center gap-2 flex-wrap mt-2">
                  <select value={batchForm.supplierId}
                    onChange={(e) => setBatchForm({...batchForm, supplierId: parseInt(e.target.value) || 0})}
                    className="px-2 py-1.5 border border-gray-300 rounded text-sm w-32">
                    <option value={0}>供应商</option>
                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                  <input type="number" step="0.01" value={batchForm.purchasePrice || ''}
                    onChange={(e) => setBatchForm({...batchForm, purchasePrice: parseFloat(e.target.value) || 0})}
                    placeholder="价格" className="px-2 py-1.5 border border-gray-300 rounded text-sm w-20" />
                  <select value={batchForm.currency}
                    onChange={(e) => setBatchForm({...batchForm, currency: e.target.value})}
                    className="px-2 py-1.5 border border-gray-300 rounded text-sm">
                    <option value="CNY">CNY</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                  <input type="number" value={batchForm.moq || ''}
                    onChange={(e) => setBatchForm({...batchForm, moq: parseInt(e.target.value) || 1})}
                    placeholder="MOQ" className="px-2 py-1.5 border border-gray-300 rounded text-sm w-16" />
                  <button type="button"
                    onClick={async () => {
                      if (!batchForm.supplierId || !batchForm.purchasePrice) { alert('请选供应商和输入价格'); return; }
                      try {
                        await skuPurchasePriceService.batchUpdate({
                          skuIds: Array.from(selectedSkuIds),
                          supplierId: batchForm.supplierId,
                          purchasePrice: batchForm.purchasePrice,
                          currency: batchForm.currency,
                          moq: batchForm.moq,
                          notes: batchForm.notes,
                        });
                        alert(`已更新 ${selectedSkuIds.size} 个 SKU`);
                        setSelectedSkuIds(new Set());
                        Array.from(selectedSkuIds).forEach(sid => loadSkuPurchasePrices(sid));
                      } catch(e: any) { alert('批量更新失败: ' + e.message); }
                    }}
                    className="px-3 py-1.5 bg-yellow-600 text-white rounded text-sm font-semibold hover:bg-yellow-700">应用</button>
                  <button type="button"
                    onClick={() => setSelectedSkuIds(new Set())}
                    className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-600">取消</button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {skus.map((sku, index) => {
                const skuId = sku.id;
                const isExpanded = expandedSkuId === skuId;
                const prices = skuId ? (purchasePrices[skuId] || []) : [];

                return (
                  <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                    {/* SKU 标题栏 */}
                    <div
                      className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => {
                        if (skuId) {
                          setExpandedSkuId(isExpanded ? null : skuId);
                          setShowAddPriceForm(null);
                                  setEditingPriceId(null);
                        }
                      }}
                    >
                      <input type="checkbox"
                        checked={skuId ? selectedSkuIds.has(skuId) : false}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          if (!skuId) return;
                          const next = new Set(selectedSkuIds);
                          if (e.target.checked) next.add(skuId); else next.delete(skuId);
                          setSelectedSkuIds(next);
                        }}
                        className="w-4 h-4 mr-2" />
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-gray-900">
                          {sku.sku || `SKU #${index + 1}`}
                        </span>
                        {sku.color && (
                          <span className="text-xs text-gray-500">颜色: {sku.color}</span>
                        )}
                        <span className="text-xs text-gray-400">库存: {sku.stock}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {skuId && prices.length > 0 && (
                          <span className="text-xs text-gray-500">{prices.length} 条进价记录</span>
                        )}
                        <span className="text-gray-400 text-sm">{isExpanded ? '▲' : '▼'}</span>
                      </div>
                    </div>

                    {/* 展开内容 */}
                    {isExpanded && skuId && (
                      <div className="p-4">
                        {/* 现有进价记录 */}
                        {prices.length > 0 ? (
                          <div className="overflow-x-auto mb-4">
                            <table className="w-full text-sm border border-gray-200 rounded-lg">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="text-left px-3 py-2 text-xs font-semibold text-gray-600">供应商</th>
                                  <th className="text-right px-3 py-2 text-xs font-semibold text-gray-600">采购价</th>
                                  <th className="text-center px-3 py-2 text-xs font-semibold text-gray-600">币种</th>
                                  <th className="text-right px-3 py-2 text-xs font-semibold text-gray-600">MOQ</th>
                                  <th className="text-left px-3 py-2 text-xs font-semibold text-gray-600">备注</th>
                                  <th className="text-center px-3 py-2 text-xs font-semibold text-gray-600">状态</th>
                                  <th className="text-center px-3 py-2 text-xs font-semibold text-gray-600">操作</th>
                                </tr>
                              </thead>
                              <tbody>
                                {prices.map((price: any) => (
                                  <tr key={price.id} className="border-t border-gray-200 hover:bg-gray-50">
                                    <td className="px-3 py-2 text-gray-700">
                                      {price.supplier?.name || (suppliers.find(s => s.id === (price.supplier?.id || price.supplierId))?.name) || '-'}
                                    </td>
                                    <td className="px-3 py-2 text-right text-gray-900 font-medium">
                                      {price.purchasePrice?.toFixed(2)}
                                    </td>
                                    <td className="px-3 py-2 text-center text-gray-600">
                                      {price.currency || 'CNY'}
                                    </td>
                                    <td className="px-3 py-2 text-right text-gray-600">
                                      {price.moq || '-'}
                                    </td>
                                    <td className="px-3 py-2 text-gray-500 text-xs max-w-[150px] truncate">
                                      {price.notes || '-'}
                                    </td>
                                    <td className="px-3 py-2 text-center">
                                      {price.isActive !== false ? (
                                        <span className="inline-block px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">启用</span>
                                      ) : (
                                        <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">停用</span>
                                      )}
                                    </td>
                                    <td className="px-3 py-2 text-center space-x-1">
                                      <button type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setNewPriceForm({
                                            supplierId: price.supplier?.id || price.supplierId || 0,
                                            purchasePrice: price.purchasePrice || 0,
                                            currency: price.currency || 'CNY',
                                            moq: price.moq || 1,
                                            notes: price.notes || '',
                                          });
                                          setEditingPriceId(price.id);
                                          setShowAddPriceForm(skuId);
                                        }}
                                        className="text-blue-500 hover:text-blue-700 text-xs font-medium">编辑</button>
                                      <button type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (confirm('确定要删除这条进价记录吗？')) handleDeletePrice(price.id, skuId);
                                        }}
                                        className="text-red-500 hover:text-red-700 text-xs font-medium">删除</button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-400 mb-4">暂无进价记录</p>
                        )}

                        {/* 添加进价表单 */}
                        {showAddPriceForm === skuId ? (
                          <div className="p-4 border border-[#00F2FE] rounded-lg bg-gray-50">
                            <h4 className="text-sm font-semibold text-gray-900 mb-3">添加进价记录</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">供应商 *</label>
                                <select
                                  value={newPriceForm.supplierId}
                                  onChange={(e) => setNewPriceForm({ ...newPriceForm, supplierId: parseInt(e.target.value) || 0 })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                                >
                                  <option value={0}>请选择供应商</option>
                                  {suppliers.map((s) => (
                                    <option key={s.id} value={s.id}>{s.name}</option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">采购价 *</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  value={newPriceForm.purchasePrice || ''}
                                  onChange={(e) => setNewPriceForm({ ...newPriceForm, purchasePrice: parseFloat(e.target.value) || 0 })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                                  placeholder="0.00"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">币种</label>
                                <select
                                  value={newPriceForm.currency}
                                  onChange={(e) => setNewPriceForm({ ...newPriceForm, currency: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                                >
                                  <option value="USD">USD</option>
                                  <option value="CNY">CNY</option>
                                  <option value="EUR">EUR</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1">MOQ</label>
                                <input
                                  type="number"
                                  min="1"
                                  value={newPriceForm.moq || ''}
                                  onChange={(e) => setNewPriceForm({ ...newPriceForm, moq: parseInt(e.target.value) || 1 })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <label className="block text-xs font-medium text-gray-600 mb-1">备注</label>
                                <input
                                  type="text"
                                  value={newPriceForm.notes}
                                  onChange={(e) => setNewPriceForm({ ...newPriceForm, notes: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                                  placeholder="可选备注"
                                />
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleSavePrice(skuId)}
                                disabled={!newPriceForm.supplierId || !newPriceForm.purchasePrice}
                                className="px-4 py-1.5 bg-[#00F2FE] text-[#050505] rounded-lg text-sm font-semibold hover:bg-[#00C4CC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                保存
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setShowAddPriceForm(null);
                                  setEditingPriceId(null);
                                  setNewPriceForm({ supplierId: 0, purchasePrice: 0, currency: 'CNY', moq: 1, notes: '' }); setEditingPriceId(null);
                                }}
                                className="px-4 py-1.5 border border-gray-300 rounded-lg text-gray-700 text-sm hover:bg-gray-50 transition-colors"
                              >
                                取消
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setShowAddPriceForm(skuId);
                              setNewPriceForm({ supplierId: 0, purchasePrice: 0, currency: 'CNY', moq: 1, notes: '' }); setEditingPriceId(null);
                            }}
                            className="px-4 py-1.5 bg-[#00F2FE] text-[#050505] rounded-lg text-sm font-semibold hover:bg-[#00C4CC] transition-colors"
                          >
                            + 添加进价
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

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
          {product.tags && (() => {
            const tagList = Array.isArray(product.tags) ? product.tags : (typeof product.tags === 'string' ? JSON.parse(product.tags) : []);
            return tagList.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {tagList.map((tag: string, index: number) => (
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
            );
          })()}
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
          {(() => {
            const featuresObj = getFeaturesObject();
            const featureEntries = Object.entries(featuresObj);
            
            return featureEntries.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {featureEntries.map(([key, value]) => (
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
            );
          })()}
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
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors mt-5"
                  >
                    删除
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500">暂无规格</p>
              <p className="text-xs text-gray-400 mt-1">点击上方按钮添加规格</p>
            </div>
          )}
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
                    className="w-full h-32 object-contain rounded-lg bg-white"
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
                  {/* 排序按钮（始终可见） */}
                  {index > 0 && (
                    <button type="button" onClick={() => moveGallery(index, 'up')}
                      className="absolute top-1 left-1 px-2 py-0.5 bg-gray-800 text-white text-xs rounded opacity-60 hover:opacity-100">↑</button>
                  )}
                  {index < galleries.length - 1 && (
                    <button type="button" onClick={() => moveGallery(index, 'down')}
                      className="absolute bottom-1 left-1 px-2 py-0.5 bg-gray-800 text-white text-xs rounded opacity-60 hover:opacity-100">↓</button>
                  )}
                  {/* 操作按钮 */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2 rounded-lg">
                    <button
                      type="button"
                      onClick={() => moveGallery(index, 'up')}
                      disabled={index === 0}
                      className="px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-500 disabled:opacity-30 disabled:cursor-not-allowed"
                    >↑</button>
                    <button
                      type="button"
                      onClick={() => moveGallery(index, 'down')}
                      disabled={index === galleries.length - 1}
                      className="px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-500 disabled:opacity-30 disabled:cursor-not-allowed"
                    >↓</button>
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

        {/* 状态 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">状态</h2>
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
