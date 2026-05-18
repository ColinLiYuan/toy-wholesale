'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { salesOrderService, distributorAdminService, productAdminService, SalesOrder, Distributor, Product, ProductSku, OrderStatus } from '@/services';
import { formatImageUrl } from '@/lib/api-config';

export default function EditOrderPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = Number(params.id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [order, setOrder] = useState<SalesOrder | null>(null);

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

  // 订单项
  const [items, setItems] = useState<any[]>([]);

  // 添加商品相关状态
  const [products, setProducts] = useState<Product[]>([]);
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

  // 加载订单和经销商列表
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // 加载订单详情
        const orderData = await salesOrderService.getOrderById(orderId);
        console.log('Order data:', orderData);
        console.log('Order distributorId:', orderData.distributorId);
        console.log('Order distributor:', orderData.distributor);
        setOrder(orderData as SalesOrder);
        
        // 兼容后端：优先使用 distributorId，如果没有则从 distributor.id 获取
        const distributorIdNum = orderData.distributorId 
          ? Number(orderData.distributorId) 
          : (orderData.distributor ? Number(orderData.distributor.id) : undefined);
        console.log('Converted distributorId:', distributorIdNum);
        
        // 兼容后端：items 可能在 orderItems 或其他字段
        const orderItems = (orderData as any).items || (orderData as any).orderItems || (orderData as any).orderItemsList || [];
        console.log('Order items from backend:', orderItems);
        
        // 转换后端items为前端格式（根据 SalesOrderDetailResponse.OrderItemInfo 结构）
        const formattedItems = orderItems.map((item: any) => ({
          id: item.id,
          productSkuId: item.sku?.id,
          productName: item.product?.title || item.sku?.product?.title || item.sku?.sku || '未知产品',
          productSku: item.sku?.sku || '-',
          productImage: item.product?.image || item.sku?.product?.image || item.sku?.image || null,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal: item.subtotal,
        }));
        console.log('Formatted items for display:', formattedItems);
        
        setFormData({
          status: orderData.status,
          paymentStatus: orderData.paymentStatus,
          shippingStatus: orderData.shippingStatus,
          totalAmount: orderData.totalAmount,
          paidAmount: orderData.paidAmount,
          distributorId: distributorIdNum,
          receiverName: orderData.receiverName || '',
          receiverPhone: orderData.receiverPhone || '',
          shippingAddress: orderData.shippingAddress || '',
          shippingCity: orderData.shippingCity || '',
          shippingRegion: orderData.shippingRegion || '',
          shippingCountry: orderData.shippingCountry || '',
          shippingZipCode: orderData.shippingZipCode || '',
          notes: orderData.notes || '',
          internalNotes: orderData.internalNotes || '',
        });
        
        // 加载订单项
        if (formattedItems && formattedItems.length > 0) {
          setItems(formattedItems);
        }

        // 加载经销商列表
        const distributorsData = await distributorAdminService.getActiveDistributors();
        console.log('Distributors:', distributorsData);
        setDistributors(distributorsData);

        // 加载产品列表
        const productsResponse = await productAdminService.getAllProducts(0, 1000);
        setProducts(productsResponse.content || []);
      } catch (error) {
        console.error('Failed to load data:', error);
        alert('加载订单失败');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [orderId]);

  // 当选择经销商时，自动带出经销商信息
  useEffect(() => {
    if (formData.distributorId && distributors.length > 0) {
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
  
    // 确保有 SKU ID
    const skuId = selectedSku?.id || selectedProduct.productSkus?.[0]?.id;
    if (!skuId) {
      alert('该产品没有可用的 SKU');
      return;
    }
  
    // 检查是否已存在相同的 SKU
    const existingItem = items.find(item => item.productSkuId === skuId);
    if (existingItem) {
      alert('该产品已存在于订单中，请直接修改数量');
      return;
    }
  
    const newItem = {
      productSkuId: skuId, // SKU 的 ID（必填）
      productName: selectedProduct.name || selectedProduct.title, // 仅用于显示
      productSku: selectedSku?.sku || selectedProduct.productSkus?.[0]?.sku || '-', // 仅用于显示
      productImage: selectedProduct.image, // 仅用于显示
      quantity: Math.max(1, quantity),
      unitPrice: Math.max(0, unitPrice),
      subtotal: Math.max(0, unitPrice) * Math.max(1, quantity), // 后端字段名是 subtotal
    };
  
    setItems([...items, newItem]);
      
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
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.distributorId) {
      alert('请选择经销商');
      return;
    }

    if (!confirm('确定要更新订单吗？')) {
      return;
    }

    setSaving(true);
    try {
      // 将 items 添加到提交数据中
      const submitData = {
        ...formData,
        items: items,
      };
      
      console.log('=== 提交订单数据 ===');
      console.log('formData:', formData);
      console.log('items:', items);
      console.log('items length:', items.length);
      console.log('submitData:', JSON.stringify(submitData, null, 2));
      console.log('==================');
      
      if (items.length === 0) {
        alert('请至少添加一个商品');
        setSaving(false);
        return;
      }
      
      await salesOrderService.updateOrder(orderId, submitData);
      alert('订单更新成功！');
      router.push(`/admin/orders`);
    } catch (error: any) {
      console.error('Failed to update order:', error);
      alert('更新订单失败：' + (error.userMessage || error.message));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <p className="text-gray-500">订单不存在</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/orders" className="text-blue-600 hover:underline mb-2 inline-block">
            ← 返回订单列表
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">编辑订单</h1>
          <p className="text-gray-600 mt-1">订单编号：{order.orderNumber}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 基本信息 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">基本信息</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                订单状态
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as OrderStatus })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="CREATED">已创建</option>
                <option value="CONFIRMED">已确认</option>
                <option value="PRODUCING">生产中</option>
                <option value="READY_TO_SHIP">待发货</option>
                <option value="SHIPPED">已发货</option>
                <option value="DELIVERED">已送达</option>
                <option value="COMPLETED">已完成</option>
                <option value="CANCELLED">已取消</option>
                <option value="REFUNDED">已退款</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                支付状态
              </label>
              <select
                value={formData.paymentStatus}
                onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="PENDING">待支付</option>
                <option value="PARTIAL">部分支付</option>
                <option value="PAID">已支付</option>
                <option value="REFUNDED">已退款</option>
                <option value="FAILED">支付失败</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                物流状态
              </label>
              <select
                value={formData.shippingStatus}
                onChange={(e) => setFormData({ ...formData, shippingStatus: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="NOT_SHIPPED">未发货</option>
                <option value="SHIPPING">运输中</option>
                <option value="SHIPPED">已发货</option>
                <option value="DELIVERED">已送达</option>
                <option value="RETURNED">已退回</option>
              </select>
            </div>

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

        {/* 商品清单 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">商品清单</h2>
          
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
            
            {/* SKU 选择 - 只在有多个SKU时显示 */}
            {selectedProduct && selectedProduct.productSkus && selectedProduct.productSkus.length > 1 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">选择 SKU</label>
                <select
                  value={selectedSku?.id || ''}
                  onChange={(e) => handleSkuChange(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {selectedProduct.productSkus.map((sku) => (
                    <option key={sku.id} value={sku.id}>
                      {sku.sku} (库存: {sku.stock})
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            {/* 单个SKU显示 */}
            {selectedProduct && selectedProduct.productSkus && selectedProduct.productSkus.length === 1 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
                <p className="text-sm text-gray-900 bg-gray-50 px-4 py-2 rounded-lg">
                  {selectedProduct.productSkus[0].sku} (库存: {selectedProduct.productSkus[0].stock})
                </p>
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
              暂无商品，请从上方选择产品并添加
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={item.id || `new-${index}`} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                  {item.productImage && (
                    <img
                      src={formatImageUrl(item.productImage)}
                      alt={item.productName}
                      className="w-16 h-16 object-cover rounded flex-shrink-0"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.productName}</p>
                    <p className="text-sm text-gray-500">SKU: {item.productSku || '-'}</p>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">数量: </span>
                    <span className="font-medium">{item.quantity}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">单价: </span>
                    <span className="font-medium">${item.unitPrice?.toFixed(2)}</span>
                  </div>
                  <div className="text-sm font-medium">
                    小计: ${(item.totalPrice || item.unitPrice * item.quantity)?.toFixed(2)}
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
        </div>

        {/* 金额信息 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">金额信息</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                订单总金额 (USD)
              </label>
              <input
                type="number"
                value={formData.totalAmount || 0}
                onChange={(e) => setFormData({ ...formData, totalAmount: Math.max(0, parseFloat(e.target.value) || 0) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                已支付金额 (USD)
              </label>
              <input
                type="number"
                value={formData.paidAmount || 0}
                onChange={(e) => setFormData({ ...formData, paidAmount: Math.max(0, parseFloat(e.target.value) || 0) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                step="0.01"
              />
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
            href={`/admin/orders/${orderId}`}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            取消
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </form>
    </div>
  );
}
