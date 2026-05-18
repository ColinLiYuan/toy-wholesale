'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { salesOrderService, SalesOrder, OrderStatus, PaymentRecord, ShipmentRecord, FollowUpRecord } from '@/services';
import AttachmentManager from '@/components/AttachmentManager';
import { formatImageUrl } from '@/lib/api-config';

// 本地类型定义
type PaymentStatus = 'PENDING' | 'PAID' | 'PARTIAL' | 'REFUNDED' | 'FAILED';
type ShippingStatus = 'NOT_SHIPPED' | 'SHIPPING' | 'SHIPPED' | 'DELIVERED' | 'RETURNED';

// 订单状态映射
const statusMap: Record<OrderStatus, { label: string; color: string }> = {
  CREATED: { label: '已创建', color: 'bg-blue-100 text-blue-800' },
  CONFIRMED: { label: '已确认', color: 'bg-green-100 text-green-800' },
  PRODUCING: { label: '生产中', color: 'bg-yellow-100 text-yellow-800' },
  READY_TO_SHIP: { label: '待发货', color: 'bg-purple-100 text-purple-800' },
  SHIPPED: { label: '已发货', color: 'bg-indigo-100 text-indigo-800' },
  DELIVERED: { label: '已送达', color: 'bg-cyan-100 text-cyan-800' },
  COMPLETED: { label: '已完成', color: 'bg-green-100 text-green-800' },
  CANCELLED: { label: '已取消', color: 'bg-red-100 text-red-800' },
  REFUNDED: { label: '已退款', color: 'bg-orange-100 text-orange-800' },
};

// 支付状态映射
const paymentStatusMap = {
  PENDING: { label: '待支付', color: 'bg-gray-100 text-gray-800' },
  PAID: { label: '已支付', color: 'bg-green-100 text-green-800' },
  PARTIAL: { label: '部分支付', color: 'bg-yellow-100 text-yellow-800' },
  REFUNDED: { label: '已退款', color: 'bg-orange-100 text-orange-800' },
  FAILED: { label: '支付失败', color: 'bg-red-100 text-red-800' },
};

// 物流状态映射
const shippingStatusMap = {
  NOT_SHIPPED: { label: '未发货', color: 'bg-gray-100 text-gray-800' },
  SHIPPING: { label: '运输中', color: 'bg-blue-100 text-blue-800' },
  SHIPPED: { label: '已发货', color: 'bg-indigo-100 text-indigo-800' },
  DELIVERED: { label: '已送达', color: 'bg-green-100 text-green-800' },
  RETURNED: { label: '已退回', color: 'bg-red-100 text-red-800' },
};

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = Number(params.id);

  const [order, setOrder] = useState<SalesOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  // 支付记录
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentTransactionId, setPaymentTransactionId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('BANK_TRANSFER');
  const [paymentStatus, setPaymentStatus] = useState('PAID');
  const [paymentNotes, setPaymentNotes] = useState('');
  const payments: PaymentRecord[] = order?.paymentRecords || [];
  
  // 物流记录
  const [showShipmentForm, setShowShipmentForm] = useState(false);
  const [carrier, setCarrier] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shipmentNotes, setShipmentNotes] = useState('');
  const shipments: ShipmentRecord[] = order?.shipmentRecords || [];
  
  // 跟进记录
  const [showFollowUpForm, setShowFollowUpForm] = useState(false);
  const [followUpContent, setFollowUpContent] = useState('');
  const [followUpType, setFollowUpType] = useState('EMAIL');
  const [followUpResult, setFollowUpResult] = useState('');
  const followUps: FollowUpRecord[] = order?.followUpRecords || [];

  // 加载订单详情
  useEffect(() => {
    const loadOrder = async () => {
      setLoading(true);
      try {
        const data = await salesOrderService.getOrderById(orderId);
        
        // 转换items数据格式
        const orderItems = (data as any).items || (data as any).orderItems || [];
        const formattedItems = orderItems.map((item: any) => ({
          id: item.id,
          productSkuId: item.sku?.id,
          productName: item.product?.title || item.sku?.product?.title || item.sku?.sku || '未知产品',
          productSku: item.sku?.sku || '-',
          productImage: item.product?.image || item.sku?.product?.image || item.sku?.image || null,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal: item.subtotal,
          specifications: item.specifications,
        }));
        
        // 合并转换后的数据
        const formattedData = {
          ...data,
          items: formattedItems,
        };
        
        setOrder(formattedData as SalesOrder);
      } catch (error) {
        console.error('Failed to load order:', error);
        alert('加载订单失败');
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

  // 格式化日期
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('zh-CN');
  };

  // 格式化金额
  const formatAmount = (amount: number) => {
    return `$${amount?.toFixed(2) || '0.00'}`;
  };



  // 订单进度步骤定义（根据后端实际字段）
  const orderSteps = [
    { key: 'CREATED', label: '订单创建', date: order?.createdAt ? formatDate(order.createdAt).split(' ')[0] : null },
    { key: 'CONFIRMED', label: '已确认', date: null },
    { key: 'PRODUCING', label: '生产中', date: null },
    { key: 'READY_TO_SHIP', label: '待发货', date: null },
    { key: 'SHIPPED', label: '已发货', date: order?.shippedAt ? formatDate(order.shippedAt).split(' ')[0] : null },
    { key: 'DELIVERED', label: '已送达', date: order?.deliveredAt ? formatDate(order.deliveredAt).split(' ')[0] : null },
    { key: 'COMPLETED', label: '已完成', date: order?.completedAt ? formatDate(order.completedAt).split(' ')[0] : null },
  ];

  // 计算当前进度步骤索引
  const stepKeys = orderSteps.map(s => s.key);
  const currentStepIndex = stepKeys.indexOf(order?.status || 'CREATED');

  // 添加支付记录
  const handleAddPayment = async () => {
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      alert('请输入有效的支付金额');
      return;
    }

    try {
      setUpdating(true);
      await salesOrderService.addPayment(orderId, {
        amount: parseFloat(paymentAmount),
        transactionId: paymentTransactionId || undefined,
        paymentMethod,
        status: paymentStatus,
        notes: paymentNotes,
      });
      alert('支付记录添加成功');
      setShowPaymentForm(false);
      setPaymentAmount('');
      setPaymentTransactionId('');
      setPaymentStatus('PAID');
      setPaymentNotes('');
      // 重新加载订单
      const data = await salesOrderService.getOrderById(orderId);
      setOrder(data as SalesOrder);
    } catch (error: any) {
      console.error('Failed to add payment:', error);
      alert('添加支付记录失败：' + (error.userMessage || error.message));
    } finally {
      setUpdating(false);
    }
  };

  // 删除支付记录
  const handleDeletePayment = async (paymentId: number) => {
    if (!confirm('确定要删除此支付记录吗？此操作不可恢复。')) {
      return;
    }

    try {
      setUpdating(true);
      await salesOrderService.deletePayment(orderId, paymentId);
      alert('支付记录删除成功');
      // 重新加载订单
      const data = await salesOrderService.getOrderById(orderId);
      setOrder(data as SalesOrder);
    } catch (error: any) {
      console.error('Failed to delete payment:', error);
      alert('删除支付记录失败：' + (error.userMessage || error.message));
    } finally {
      setUpdating(false);
    }
  };

  // 添加物流记录
  const handleAddShipment = async () => {
    if (!carrier || !trackingNumber) {
      alert('请填写物流公司和追踪号');
      return;
    }

    try {
      setUpdating(true);
      await salesOrderService.addShipment(orderId, {
        carrier,
        trackingNumber,
        notes: shipmentNotes,
      });
      alert('物流记录添加成功');
      setShowShipmentForm(false);
      setCarrier('');
      setTrackingNumber('');
      setShipmentNotes('');
      // 重新加载订单
      const data = await salesOrderService.getOrderById(orderId);
      setOrder(data as SalesOrder);
    } catch (error: any) {
      console.error('Failed to add shipment:', error);
      alert('添加物流记录失败：' + (error.userMessage || error.message));
    } finally {
      setUpdating(false);
    }
  };

  // 删除物流记录
  const handleDeleteShipment = async (shipmentId: number) => {
    if (!confirm('确定要删除此物流记录吗？此操作不可恢复。')) {
      return;
    }

    try {
      setUpdating(true);
      await salesOrderService.deleteShipment(orderId, shipmentId);
      alert('物流记录删除成功');
      // 重新加载订单
      const data = await salesOrderService.getOrderById(orderId);
      setOrder(data as SalesOrder);
    } catch (error: any) {
      console.error('Failed to delete shipment:', error);
      alert('删除物流记录失败：' + (error.userMessage || error.message));
    } finally {
      setUpdating(false);
    }
  };

  // 更新支付状态
  const handleUpdatePaymentStatus = async (newStatus: PaymentStatus) => {
    if (!confirm(`确定要将支付状态更改为"${paymentStatusMap[newStatus]?.label}"吗？`)) {
      return;
    }

    setUpdating(true);
    try {
      // TODO: 需要后端提供更新支付状态的API
      // await salesOrderService.updatePaymentStatus(orderId, newStatus);
      alert('支付状态更新功能待后端API支持');
      // 重新加载订单
      const data = await salesOrderService.getOrderById(orderId);
      setOrder(data as SalesOrder);
    } catch (error: any) {
      console.error('Failed to update payment status:', error);
      alert('支付状态更新失败：' + (error.userMessage || error.message));
    } finally {
      setUpdating(false);
    }
  };

  // 更新物流状态
  const handleUpdateShippingStatus = async (newStatus: ShippingStatus) => {
    if (!confirm(`确定要将物流状态更改为"${shippingStatusMap[newStatus]?.label}"吗？`)) {
      return;
    }

    setUpdating(true);
    try {
      // TODO: 需要后端提供更新物流状态的API
      // await salesOrderService.updateShippingStatus(orderId, newStatus);
      alert('物流状态更新功能待后端API支持');
      // 重新加载订单
      const data = await salesOrderService.getOrderById(orderId);
      setOrder(data as SalesOrder);
    } catch (error: any) {
      console.error('Failed to update shipping status:', error);
      alert('物流状态更新失败：' + (error.userMessage || error.message));
    } finally {
      setUpdating(false);
    }
  };

  // 更新订单状态
  const handleUpdateStatus = async (newStatus: OrderStatus) => {
    if (!confirm(`确定要将订单状态更改为"${statusMap[newStatus]?.label}"吗？`)) {
      return;
    }

    setUpdating(true);
    try {
      await salesOrderService.updateOrderStatus(orderId, newStatus);
      alert('状态更新成功');
      // 重新加载订单
      const data = await salesOrderService.getOrderById(orderId);
      setOrder(data as SalesOrder);
    } catch (error: any) {
      console.error('Failed to update status:', error);
      alert('状态更新失败：' + (error.userMessage || error.message));
    } finally {
      setUpdating(false);
    }
  };

  // 取消订单
  const handleCancelOrder = async () => {
    const reason = prompt('请输入取消原因：');
    if (!reason) return;

    if (!confirm('确定要取消此订单吗？此操作不可恢复。')) {
      return;
    }

    setUpdating(true);
    try {
      await salesOrderService.updateOrderStatus(orderId, 'CANCELLED');
      // 更新取消原因（如果需要单独的API，可以在这里调用）
      alert('订单已取消');
      // 重新加载订单
      const data = await salesOrderService.getOrderById(orderId);
      setOrder(data as SalesOrder);
    } catch (error: any) {
      console.error('Failed to cancel order:', error);
      alert('取消订单失败：' + (error.userMessage || error.message));
    } finally {
      setUpdating(false);
    }
  };

  // 添加跟进记录
  const handleAddFollowUp = async () => {
    if (!followUpContent || !followUpContent.trim()) {
      alert('请输入跟进内容');
      return;
    }

    try {
      setUpdating(true);
      await salesOrderService.addFollowUp(orderId, {
        content: followUpContent,
        followUpType,
        result: followUpResult || undefined,
      });
      alert('跟进记录添加成功');
      setShowFollowUpForm(false);
      setFollowUpContent('');
      setFollowUpResult('');
      // 重新加载订单
      const data = await salesOrderService.getOrderById(orderId);
      setOrder(data as SalesOrder);
    } catch (error: any) {
      console.error('Failed to add follow-up:', error);
      alert('添加跟进记录失败：' + (error.userMessage || error.message));
    } finally {
      setUpdating(false);
    }
  };

  // 删除跟进记录
  const handleDeleteFollowUp = async (followUpId: number) => {
    if (!confirm('确定要删除此跟进记录吗？此操作不可恢复。')) {
      return;
    }

    try {
      setUpdating(true);
      await salesOrderService.deleteFollowUp(orderId, followUpId);
      alert('跟进记录删除成功');
      // 重新加载订单
      const data = await salesOrderService.getOrderById(orderId);
      setOrder(data as SalesOrder);
    } catch (error: any) {
      console.error('Failed to delete follow-up:', error);
      alert('删除跟进记录失败：' + (error.userMessage || error.message));
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/admin/orders" className="text-blue-600 hover:underline mb-2 inline-block">
              ← 返回订单列表
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">订单详情</h1>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/admin/orders" className="text-blue-600 hover:underline mb-2 inline-block">
              ← 返回订单列表
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">订单详情</h1>
          </div>
        </div>
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
          <h1 className="text-2xl font-bold text-gray-900">订单详情</h1>
          <p className="text-gray-600 mt-1">订单编号：{order.orderNumber}</p>
        </div>
        <div className="flex gap-2">
          {/* 状态更新按钮 */}
          {order.status === 'CREATED' && (
            <button
              onClick={() => handleUpdateStatus('CONFIRMED')}
              disabled={updating}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              确认订单
            </button>
          )}
          {order.status === 'CONFIRMED' && (
            <button
              onClick={() => handleUpdateStatus('PRODUCING')}
              disabled={updating}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 transition-colors"
            >
              开始生产
            </button>
          )}
          {order.status === 'PRODUCING' && (
            <button
              onClick={() => handleUpdateStatus('READY_TO_SHIP')}
              disabled={updating}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              生产完成
            </button>
          )}
          {order.status === 'READY_TO_SHIP' && (
            <button
              onClick={() => handleUpdateStatus('SHIPPED')}
              disabled={updating}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              发货
            </button>
          )}
          {order.status === 'DELIVERED' && (
            <button
              onClick={() => handleUpdateStatus('COMPLETED')}
              disabled={updating}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              完成订单
            </button>
          )}
          {order.status !== 'CANCELLED' && order.status !== 'COMPLETED' && order.status !== 'REFUNDED' && (
            <button
              onClick={() => handleCancelOrder()}
              disabled={updating}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              取消订单
            </button>
          )}
        </div>
      </div>

      {/* 基本信息 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">基本信息</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">订单状态</label>
            <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${statusMap[order.status]?.color}`}>
              {statusMap[order.status]?.label}
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">支付状态</label>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${paymentStatusMap[order.paymentStatus]?.color}`}>
                {paymentStatusMap[order.paymentStatus]?.label}
              </span>
              {order.status !== 'CANCELLED' && (
                <select
                  value={order.paymentStatus}
                  onChange={(e) => handleUpdatePaymentStatus(e.target.value as PaymentStatus)}
                  disabled={updating}
                  className="text-xs px-2 py-1 border border-gray-300 rounded disabled:opacity-50"
                >
                  <option value="PENDING">待支付</option>
                  <option value="PARTIAL">部分支付</option>
                  <option value="PAID">已支付</option>
                  <option value="REFUNDED">已退款</option>
                  <option value="FAILED">支付失败</option>
                </select>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">物流状态</label>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${shippingStatusMap[order.shippingStatus]?.color}`}>
                {shippingStatusMap[order.shippingStatus]?.label}
              </span>
              {order.status !== 'CANCELLED' && order.status !== 'COMPLETED' && (
                <select
                  value={order.shippingStatus}
                  onChange={(e) => handleUpdateShippingStatus(e.target.value as ShippingStatus)}
                  disabled={updating}
                  className="text-xs px-2 py-1 border border-gray-300 rounded disabled:opacity-50"
                >
                  <option value="NOT_SHIPPED">未发货</option>
                  <option value="SHIPPING">运输中</option>
                  <option value="SHIPPED">已发货</option>
                  <option value="DELIVERED">已送达</option>
                  <option value="RETURNED">已退回</option>
                </select>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 订单进度 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">订单进度</h2>
        <div className="relative">
          {/* 进度条背景 */}
          <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200"></div>
          {/* 进度条完成部分 */}
          <div 
            className="absolute top-6 left-0 h-1 bg-[#00F2FE] transition-all duration-500"
            style={{ width: `${((currentStepIndex + 1) / orderSteps.length) * 100}%` }}
          ></div>
          
          {/* 步骤节点 */}
          <div className="relative flex justify-between">
            {orderSteps.map((step, index) => {
              const isCompleted = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;
              
              return (
                <div key={step.key} className="flex flex-col items-center" style={{ width: `${100 / orderSteps.length}%` }}>
                  {/* 节点圆圈 */}
                  <div
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold border-4 transition-all z-10
                      ${isCompleted ? 'bg-[#00F2FE] border-[#00F2FE] text-[#050505]' : ''}
                      ${isCurrent ? 'bg-white border-[#00F2FE] text-[#00F2FE] shadow-lg' : ''}
                      ${!isCompleted && !isCurrent ? 'bg-white border-gray-300 text-gray-400' : ''}
                    `}
                  >
                    {isCompleted ? '✓' : index + 1}
                  </div>
                  {/* 步骤标签 */}
                  <div className="mt-3 text-center">
                    <p className={`text-sm font-semibold ${
                      isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      {step.label}
                    </p>
                    {step.date && (
                      <p className="text-xs text-gray-500 mt-1">
                        {step.date}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 经销商信息 */}
      {order.distributor && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">经销商信息</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">经销商名称</label>
              <p className="mt-1 text-gray-900">{order.distributor.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">经销商编码</label>
              <p className="mt-1 text-gray-900">{order.distributor.code}</p>
            </div>
          </div>
        </div>
      )}

      {/* 商品清单 */}
      {order.items && order.items.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">商品清单</h2>
          <div className="space-y-3">
            {order.items.map((item: any, index: number) => (
              <div key={item.id || `item-${index}`} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                {item.productImage && (
                  <img
                    src={formatImageUrl(item.productImage)}
                    alt={item.productName}
                    className="w-16 h-16 object-cover rounded"
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
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 金额信息 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">金额信息</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">订单总金额 (USD)</label>
            <p className="mt-1 text-2xl font-bold text-gray-900">{formatAmount(order.totalAmount)}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">已支付金额</label>
            <p className="mt-1 text-2xl font-bold text-green-600">{formatAmount(order.paidAmount)}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">待支付金额</label>
            <p className="mt-1 text-2xl font-bold text-red-600">
              {formatAmount(order.totalAmount - order.paidAmount)}
            </p>
          </div>
        </div>
      </div>

      {/* 收货信息 */}
      {(order.receiverName || order.shippingAddress) && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">收货信息</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">收货人</label>
              <p className="mt-1 text-gray-900">{order.receiverName || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">联系电话</label>
              <p className="mt-1 text-gray-900">{order.receiverPhone || '-'}</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">收货地址</label>
              <p className="mt-1 text-gray-900">
                {[order.shippingAddress, order.shippingCity, order.shippingRegion, order.shippingCountry, order.shippingZipCode]
                  .filter(Boolean)
                  .join(' ') || '-'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 物流信息 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">物流信息</h2>
          {order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && (
            <button
              onClick={() => setShowShipmentForm(!showShipmentForm)}
              className="px-4 py-2 bg-[#00F2FE] text-[#050505] rounded-lg font-semibold hover:bg-[#00C4CC] transition-colors"
            >
              {showShipmentForm ? '取消' : '添加物流'}
            </button>
          )}
        </div>
        
        {showShipmentForm && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">物流公司</label>
                <input
                  type="text"
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                  placeholder="如：DHL, FedEx, UPS"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">追踪单号</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                  placeholder="物流追踪单号"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">备注</label>
              <textarea
                value={shipmentNotes}
                onChange={(e) => setShipmentNotes(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                rows={2}
                placeholder="物流备注信息"
              />
            </div>
            <button
              onClick={handleAddShipment}
              disabled={updating}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              确认添加
            </button>
          </div>
        )}
        
        {/* 当前物流信息 */}
        {(order.carrier || order.trackingNumber) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">物流公司</label>
              <p className="mt-1 text-gray-900">{order.carrier || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">追踪号</label>
              <p className="mt-1 text-gray-900">{order.trackingNumber || '-'}</p>
            </div>
          </div>
        )}
        
        {/* 物流历史记录 */}
        {shipments.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700">物流记录</h3>
            {shipments.map((shipment: any, index: number) => (
              <div key={shipment.id || index} className="p-4 bg-gray-50 rounded-lg relative">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{shipment.carrier || '-'}</p>
                    <p className="text-sm text-gray-600 mt-1">追踪号：{shipment.trackingNumber || '-'}</p>
                    {shipment.notes && <p className="text-sm text-gray-600 mt-1">备注：{shipment.notes}</p>}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <p className="text-xs text-gray-500">
                      {shipment.createdAt ? formatDate(shipment.createdAt) : '-'}
                    </p>
                    <button
                      onClick={() => handleDeleteShipment(shipment.id)}
                      disabled={updating}
                      className="text-xs text-red-600 hover:text-red-800 disabled:opacity-50 transition-colors"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!order.carrier && !order.trackingNumber && shipments.length === 0 && (
          <p className="text-center text-gray-500 py-4">暂无物流信息</p>
        )}
      </div>

      {/* 支付记录 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">支付记录</h2>
          {order.paymentStatus !== 'PAID' && order.status !== 'CANCELLED' && (
            <button
              onClick={() => setShowPaymentForm(!showPaymentForm)}
              className="px-4 py-2 bg-[#00F2FE] text-[#050505] rounded-lg font-semibold hover:bg-[#00C4CC] transition-colors"
            >
              {showPaymentForm ? '取消' : '添加支付'}
            </button>
          )}
        </div>
        
        {showPaymentForm && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">支付金额 (USD)</label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                  placeholder="支付金额"
                  step="0.01"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">交易ID</label>
                <input
                  type="text"
                  value={paymentTransactionId}
                  onChange={(e) => setPaymentTransactionId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                  placeholder="第三方支付平台交易号（可选）"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">支付方式</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                >
                  <option value="BANK_TRANSFER">银行转账</option>
                  <option value="PAYPAL">PayPal</option>
                  <option value="CREDIT_CARD">信用卡</option>
                  <option value="WESTERN_UNION">西联汇款</option>
                  <option value="OTHER">其他</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">支付状态</label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                >
                  <option value="PAID">已支付</option>
                  <option value="PENDING">待支付</option>
                  <option value="FAILED">支付失败</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">备注</label>
              <textarea
                value={paymentNotes}
                onChange={(e) => setPaymentNotes(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                rows={2}
                placeholder="支付备注信息"
              />
            </div>
            <button
              onClick={handleAddPayment}
              disabled={updating}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              确认支付
            </button>
          </div>
        )}
        
        {/* 支付历史记录 */}
        {payments.length > 0 && (
          <div className="space-y-3">
            {payments.map((payment: any, index: number) => (
              <div key={payment.id || index} className="p-4 bg-gray-50 rounded-lg relative">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <p className="text-lg font-bold text-green-600">{formatAmount(payment.amount)}</p>
                      {payment.transactionId && (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          交易ID: {payment.transactionId}
                        </span>
                      )}
                    </div>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm text-gray-600">支付方式：{payment.paymentMethod || '-'}</p>
                      {payment.paidAt && (
                        <p className="text-sm text-gray-600">支付时间：{formatDate(payment.paidAt)}</p>
                      )}
                      {payment.notes && <p className="text-sm text-gray-600">备注：{payment.notes}</p>}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <p className="text-xs text-gray-500">
                      {payment.createdAt ? formatDate(payment.createdAt) : '-'}
                    </p>
                    <button
                      onClick={() => handleDeletePayment(payment.id)}
                      disabled={updating}
                      className="text-xs text-red-600 hover:text-red-800 disabled:opacity-50 transition-colors"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {payments.length === 0 && (
          <p className="text-center text-gray-500 py-4">暂无支付记录</p>
        )}
      </div>

      {/* 跟进记录 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">跟进记录</h2>
          {order.status !== 'COMPLETED' && order.status !== 'CANCELLED' && (
            <button
              onClick={() => setShowFollowUpForm(!showFollowUpForm)}
              className="px-4 py-2 bg-[#00F2FE] text-[#050505] rounded-lg font-semibold hover:bg-[#00C4CC] transition-colors"
            >
              {showFollowUpForm ? '取消' : '添加跟进'}
            </button>
          )}
        </div>
        
        {showFollowUpForm && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">跟进内容</label>
              <textarea
                value={followUpContent}
                onChange={(e) => setFollowUpContent(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                rows={3}
                placeholder="请输入跟进内容..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">跟进方式</label>
                <select
                  value={followUpType}
                  onChange={(e) => setFollowUpType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                >
                  <option value="EMAIL">邮件</option>
                  <option value="PHONE">电话</option>
                  <option value="WECHAT">微信</option>
                  <option value="WHATSAPP">WhatsApp</option>
                  <option value="OTHER">其他</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">跟进结果</label>
                <input
                  type="text"
                  value={followUpResult}
                  onChange={(e) => setFollowUpResult(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                  placeholder="如：客户确认订单、待付款等"
                />
              </div>
            </div>
            <button
              onClick={handleAddFollowUp}
              disabled={updating}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              保存跟进记录
            </button>
          </div>
        )}
        
        {/* 跟进记录列表 */}
        {followUps.length > 0 && (
          <div className="space-y-3">
            {followUps.map((followUp: any, index: number) => (
              <div key={followUp.id || index} className="p-4 bg-gray-50 rounded-lg relative">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 whitespace-pre-wrap">{followUp.content}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-500">方式：{followUp.followUpType || '-'}</span>
                      {followUp.result && <span className="text-xs text-gray-500">结果：{followUp.result}</span>}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 ml-4">
                    <p className="text-xs text-gray-500">
                      {followUp.createdAt ? formatDate(followUp.createdAt) : '-'}
                    </p>
                    <button
                      onClick={() => handleDeleteFollowUp(followUp.id)}
                      disabled={updating}
                      className="text-xs text-red-600 hover:text-red-800 disabled:opacity-50 transition-colors"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {followUps.length === 0 && (
          <p className="text-center text-gray-500 py-4">暂无跟进记录</p>
        )}
      </div>

      {/* 时间信息 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">时间信息</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">创建时间</label>
            <p className="mt-1 text-gray-900">{formatDate(order.createdAt)}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">更新时间</label>
            <p className="mt-1 text-gray-900">{formatDate(order.updatedAt)}</p>
          </div>
          {order.paidAt && (
            <div>
              <label className="block text-sm font-medium text-gray-700">支付时间</label>
              <p className="mt-1 text-gray-900">{formatDate(order.paidAt)}</p>
            </div>
          )}
          {order.shippedAt && (
            <div>
              <label className="block text-sm font-medium text-gray-700">发货时间</label>
              <p className="mt-1 text-gray-900">{formatDate(order.shippedAt)}</p>
            </div>
          )}
          {order.deliveredAt && (
            <div>
              <label className="block text-sm font-medium text-gray-700">送达时间</label>
              <p className="mt-1 text-gray-900">{formatDate(order.deliveredAt)}</p>
            </div>
          )}
          {order.completedAt && (
            <div>
              <label className="block text-sm font-medium text-gray-700">完成时间</label>
              <p className="mt-1 text-gray-900">{formatDate(order.completedAt)}</p>
            </div>
          )}
        </div>
      </div>

      {/* 备注信息 */}
      {(order.notes || order.internalNotes) && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">备注信息</h2>
          {order.notes && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">客户备注</label>
              <p className="mt-1 text-gray-900 whitespace-pre-wrap">{order.notes}</p>
            </div>
          )}
          {order.internalNotes && (
            <div>
              <label className="block text-sm font-medium text-gray-700">内部备注</label>
              <p className="mt-1 text-gray-900 whitespace-pre-wrap">{order.internalNotes}</p>
            </div>
          )}
        </div>
      )}

      {/* 附件管理 */}
      <AttachmentManager entityType="ORDER" entityId={orderId} />
    </div>
  );
}
