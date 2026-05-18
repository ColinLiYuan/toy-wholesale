'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { salesOrderService, Distributor, distributorAdminService, SalesOrder, Product, ProductSku, productAdminService } from '@/services';
import { formatImageUrl } from '@/lib/api-config';

export default function NewOrderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // 表单数据
  const [formData, setFormData] = useState<Partial<SalesOrder>>({
    status: 'CREATED',
    paymentStatus: 'PENDING',
    shippingStatus: 'NOT_SHIPPED',
    totalAmount: 0,
    paidAmount: 0,
    distributorId: undefined,
    receiverName: '',
    receiverPhone: '',
    shippingAddress: '',
    shippingCity: '',
    shippingRegion: '',
    shippingCountry: '',
    shippingZipCode: '',
    notes: '',
    internalNotes: '',
  });

  // 经销商列表
  const [distributors, setDistributors] = useState<Distributor[]>([]);

  // 产品列表
  const [products, setProducts] = useState<Product[]>([]);

  // 订单项
  const [items, setItems] = useState<Array<{
    productId: number;
    productName: string;
    skuId?: number;
    sku: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }>>([]);

  // 选中的产品
  // 产品选择相关状态
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSku, setSelectedSku] = useState<ProductSku | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 过滤产品列表
  const filteredProducts = products.filter(product => {
    if (!productSearchTerm) return true;
    const searchLower = productSearchTerm.toLowerCase();
    return (
      (product.name || product.title || '').toLowerCase().includes(searchLower) ||
      (product.sku || '').toLowerCase().includes(searchLower)
    );
  });

  // 加载经销商和产品列表
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // 加载经销商
        const distributorsData = await distributorAdminService.getActiveDistributors();
        setDistributors(distributorsData);

        // 加载产品列表
        const productsResponse = await productAdminService.getAllProducts(0, 1000);
        const loadedProducts = productsResponse.content || [];
        console.log('Loaded products:', loadedProducts.slice(0, 2)); // 调试：查看前2个产品的数据结构
        setProducts(loadedProducts);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 点击外部关闭下拉框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProductDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 当选择经销商时，自动带出经销商信息到订单表单
  useEffect(() => {
    if (formData.distributorId) {
      const selectedDistributor = distributors.find(d => d.id === formData.distributorId);
      if (selectedDistributor) {
        setFormData(prev => ({
          ...prev,
          receiverName: selectedDistributor.contactPerson || prev.receiverName,
          receiverPhone: selectedDistributor.phone || prev.receiverPhone,
          shippingAddress: selectedDistributor.address || prev.shippingAddress,
          shippingCity: selectedDistributor.city || prev.shippingCity,
          shippingRegion: selectedDistributor.region || prev.shippingRegion,
          shippingCountry: selectedDistributor.country || prev.shippingCountry,
          shippingZipCode: selectedDistributor.zipCode || prev.shippingZipCode,
        }));
      }
    }
  }, [formData.distributorId, distributors]);

  // 产品选择变化
  const handleProductChange = (productId: number) => {
    const product = products.find(p => p.id === productId);
    setSelectedProduct(product || null);
    setSelectedSku(null);
    setUnitPrice(product?.currentPrice || 0);
  };

  // SKU 选择变化
  const handleSkuChange = (skuId: number) => {
    if (!selectedProduct) return;
    const sku = selectedProduct.productSkus?.find(s => s.id === skuId);
    setSelectedSku(sku || null);
  };

  // 添加订单项
  const handleAddItem = () => {
    if (!selectedProduct) {
      alert('请选择产品');
      return;
    }

    const newItem = {
      productId: selectedProduct.id,
      productName: selectedProduct.name || selectedProduct.title,
      skuId: selectedSku?.id,
      sku: selectedSku?.sku || selectedProduct.sku || '-',
      quantity: Math.max(1, quantity),
      unitPrice: Math.max(0, unitPrice),
      subtotal: Math.max(0, unitPrice) * Math.max(1, quantity),
    };

    setItems([...items, newItem]);
    calculateTotal();
    
    // 重置选择
    setSelectedProduct(null);
    setSelectedSku(null);
    setQuantity(1);
    setUnitPrice(0);
  };

  // 删除订单项
  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    calculateTotal();
  };

  // 计算总金额
  const calculateTotal = () => {
    const total = items.reduce((sum, item) => sum + item.subtotal, 0);
    setFormData({ ...formData, totalAmount: total });
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.distributorId) {
      alert('请选择经销商');
      return;
    }

    if (items.length === 0) {
      alert('请至少添加一个产品');
      return;
    }

    if (!confirm('确定要创建订单吗？')) {
      return;
    }

    setSaving(true);
    try {
      const orderData: Partial<SalesOrder> = {
        ...formData,
        // 注意：后端会自动生成 orderNumber
        // items 需要在后端创建后单独添加
      };

      const createdOrder = await salesOrderService.createOrder(orderData);
      alert(`订单创建成功！订单编号：${createdOrder.orderNumber}`);
      router.push(`/admin/orders/${createdOrder.id}`);
    } catch (error: any) {
      console.error('Failed to create order:', error);
      alert('创建订单失败：' + (error.userMessage || error.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/orders" className="text-blue-600 hover:underline mb-2 inline-block">
            ← 返回订单列表
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">新建订单</h1>
          <p className="text-gray-600 mt-1">创建新的销售订单</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 基本信息 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">基本信息</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                经销商 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.distributorId || ''}
                onChange={(e) => setFormData({ ...formData, distributorId: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">请选择经销商</option>
                {distributors.map((distributor) => (
                  <option key={distributor.id} value={distributor.id}>
                    {distributor.name} ({distributor.code})
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                💡 选择经销商后，将自动带出联系人、电话和地址信息到收货信息栏
              </p>
            </div>
          </div>
        </div>

        {/* 收货信息 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">收货信息</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">收货人</label>
              <input
                type="text"
                value={formData.receiverName || ''}
                onChange={(e) => setFormData({ ...formData, receiverName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="收货人姓名"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">联系电话</label>
              <input
                type="text"
                value={formData.receiverPhone || ''}
                onChange={(e) => setFormData({ ...formData, receiverPhone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="联系电话"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">收货地址</label>
              <input
                type="text"
                value={formData.shippingAddress || ''}
                onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="详细地址"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">城市</label>
              <input
                type="text"
                value={formData.shippingCity || ''}
                onChange={(e) => setFormData({ ...formData, shippingCity: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="城市"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">省份/州</label>
              <input
                type="text"
                value={formData.shippingRegion || ''}
                onChange={(e) => setFormData({ ...formData, shippingRegion: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="省份/州"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">国家</label>
              <input
                type="text"
                value={formData.shippingCountry || ''}
                onChange={(e) => setFormData({ ...formData, shippingCountry: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="国家"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">邮编</label>
              <input
                type="text"
                value={formData.shippingZipCode || ''}
                onChange={(e) => setFormData({ ...formData, shippingZipCode: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="邮编"
              />
            </div>
          </div>
        </div>

        {/* 产品清单 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">产品清单</h2>
          
          {/* 产品选择区域 */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
            {/* 产品选择下拉框 */}
            <div className="relative" ref={dropdownRef}>
              <label className="block text-sm font-medium text-gray-700 mb-2">选择产品</label>
              
              {/* 选中显示 / 触发下拉 */}
              <div
                onClick={() => setShowProductDropdown(!showProductDropdown)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white cursor-pointer flex items-center justify-between hover:border-blue-500 transition-colors"
              >
                {selectedProduct ? (
                  <div className="flex items-center gap-3">
                    {selectedProduct.image && (
                      <img
                        src={formatImageUrl(selectedProduct.image)}
                        alt={selectedProduct.name || selectedProduct.title}
                        className="w-10 h-10 object-cover rounded"
                      />
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{selectedProduct.name || selectedProduct.title}</p>
                      <p className="text-xs text-gray-500">SKU: {selectedProduct.sku || (selectedProduct.productSkus?.[0]?.sku) || '-'}</p>
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-400">请选择产品</span>
                )}
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showProductDropdown ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'} />
                </svg>
              </div>

              {/* 下拉选项 */}
              {showProductDropdown && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-hidden">
                  {/* 搜索框 */}
                  <div className="p-2 border-b border-gray-200">
                    <input
                      type="text"
                      value={productSearchTerm}
                      onChange={(e) => setProductSearchTerm(e.target.value)}
                      placeholder="搜索产品名称或 SKU..."
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  
                  {/* 产品列表 */}
                  <div className="overflow-y-auto max-h-72">
                    {filteredProducts.length === 0 ? (
                      <div className="px-4 py-8 text-center text-gray-500 text-sm">
                        没有找到匹配的产品
                      </div>
                    ) : (
                      filteredProducts.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => {
                            handleProductChange(product.id);
                            setShowProductDropdown(false);
                            setProductSearchTerm('');
                          }}
                          className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-blue-50 transition-colors ${
                            selectedProduct?.id === product.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                          }`}
                        >
                          {product.image ? (
                            <img
                              src={formatImageUrl(product.image)}
                              alt={product.name || product.title}
                              className="w-12 h-12 object-cover rounded flex-shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{product.name || product.title}</p>
                            <p className="text-xs text-gray-500">SKU: {product.sku || (product.productSkus?.[0]?.sku) || '-'}</p>
                            {product.currentPrice && (
                              <p className="text-xs text-blue-600 font-semibold">${product.currentPrice.toFixed(2)}</p>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* SKU 选择 */}
            {selectedProduct && selectedProduct.productSkus && selectedProduct.productSkus.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">选择 SKU</label>
                <select
                  value={selectedSku?.id || ''}
                  onChange={(e) => handleSkuChange(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">默认 SKU</option>
                  {selectedProduct.productSkus.map((sku) => (
                    <option key={sku.id} value={sku.id}>
                      {sku.sku} (库存: {sku.stock})
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            {/* 数量和单价 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">数量</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">单价 (USD)</label>
                <input
                  type="number"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleAddItem}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                + 添加到订单
              </button>
            </div>
          </div>

          {/* 已添加的产品列表 */}
          {items.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              暂无产品，请从上方选择产品并添加
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.productName}</p>
                    <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">数量: </span>
                    <span className="font-medium">{item.quantity}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">单价: </span>
                    <span className="font-medium">${item.unitPrice.toFixed(2)}</span>
                  </div>
                  <div className="text-sm font-medium">
                    小计: ${item.subtotal.toFixed(2)}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="px-3 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    删除
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 总金额 */}
          {items.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">订单总金额 (USD)</label>
                  <input
                    type="number"
                    value={formData.totalAmount || 0}
                    onChange={(e) => setFormData({ ...formData, totalAmount: Math.max(0, parseFloat(e.target.value) || 0) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    step="0.01"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    💡 系统会自动计算总额，您也可以手动修改（如添加运费、折扣等）
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-600">自动计算:</span>
                  <p className="text-xl font-bold text-green-600">
                    ${items.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 备注信息 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">备注信息</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">客户备注</label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="客户留言或特殊要求..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">内部备注</label>
              <textarea
                value={formData.internalNotes || ''}
                onChange={(e) => setFormData({ ...formData, internalNotes: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="运营人员内部备注..."
              />
            </div>
          </div>
        </div>

        {/* 提交按钮 */}
        <div className="flex justify-end gap-4">
          <Link
            href="/admin/orders"
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            取消
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? '创建中...' : '创建订单'}
          </button>
        </div>
      </form>
    </div>
  );
}
