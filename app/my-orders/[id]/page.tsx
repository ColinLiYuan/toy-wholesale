'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import apiClient, { UnwrappedAxiosResponse } from '@/lib/api-client';
import { formatImageUrl } from '@/lib/api-config';

interface OrderItem {
  id?: number;
  productId?: number;
  productName?: string;
  productSku?: string;
  productImage?: string;
  quantity: number;
  unitPrice?: number;
  totalPrice?: number;
  weightWithBox?: number;
  notes?: string;
}

interface PaymentRecord {
  id: number;
  transactionId?: string;
  amount: number;
  paymentMethod?: string;
  status?: string;
  paidAt?: string;
  notes?: string;
  createdAt: string;
}

interface ShipmentRecord {
  id: number;
  carrier: string;
  trackingNumber: string;
  status?: string;
  shippedAt?: string;
  estimatedDeliveryAt?: string;
  deliveredAt?: string;
  notes?: string;
  createdAt: string;
}

interface OrderDetail {
  id: number;
  orderNumber: string;
  inquiryNumber?: string;
  status: string;
  paymentStatus?: string;
  shippingStatus?: string;
  totalAmount?: number;
  paidAmount?: number;
  totalWeight?: number;
  receiverName?: string;
  receiverPhone?: string;
  shippingAddress?: string;
  shippingCity?: string;
  shippingRegion?: string;
  shippingCountry?: string;
  carrier?: string;
  trackingNumber?: string;
  estimatedShipDate?: string;
  shippedAt?: string;
  deliveredAt?: string;
  notes?: string;
  internalNotes?: string;
  items?: OrderItem[];
  paymentRecords?: PaymentRecord[];
  shipmentRecords?: ShipmentRecord[];
  createdAt: string;
  updatedAt: string;
}

const STATUS_FLOW = ['CREATED', 'CONFIRMED', 'PRODUCING', 'READY_TO_SHIP', 'SHIPPED', 'DELIVERED', 'COMPLETED'];

const STATUS_LABELS: Record<string, string> = {
  CREATED: 'Created',
  CONFIRMED: 'Confirmed',
  PRODUCING: 'Producing',
  READY_TO_SHIP: 'Ready to Ship',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  REFUNDED: 'Refunded',
};

const PAYMENT_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Pending', color: 'bg-orange-100 text-orange-700' },
  PAID: { label: 'Paid', color: 'bg-green-100 text-green-700' },
  PARTIAL: { label: 'Partial', color: 'bg-blue-100 text-blue-700' },
  REFUNDED: { label: 'Refunded', color: 'bg-gray-100 text-gray-700' },
  FAILED: { label: 'Failed', color: 'bg-red-100 text-red-700' },
};

const SHIPPING_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  NOT_SHIPPED: { label: 'Not Shipped', color: 'bg-gray-100 text-gray-600' },
  SHIPPING: { label: 'In Transit', color: 'bg-blue-100 text-blue-700' },
  SHIPPED: { label: 'Shipped', color: 'bg-green-100 text-green-700' },
  DELIVERED: { label: 'Delivered', color: 'bg-green-100 text-green-700' },
  RETURNED: { label: 'Returned', color: 'bg-red-100 text-red-700' },
};

export default function OrderDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) fetchOrderDetail();
  }, [id]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      const response: UnwrappedAxiosResponse<OrderDetail> = await apiClient.get(`/v1/inquiry-orders/${id}`);
      if (response.code === 200 && response.data) {
        setOrder(response.data);
      } else {
        throw new Error('Order not found');
      }
    } catch (err: any) {
      console.error('Failed to fetch order:', err);
      setError(err.response?.data?.message || 'Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const currentStepIndex = order ? STATUS_FLOW.indexOf(order.status) : -1;

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-surface flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-brand border-t-transparent" />
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !order) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-surface py-16">
          <div className="max-w-xl mx-auto text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2 className="text-xl font-bold text-text-primary mb-2">{error || 'Order not found'}</h2>
            <Link href="/my-orders" className="text-brand hover:underline text-sm font-medium">Back to My Orders</Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-surface py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link href="/my-orders" className="text-sm text-brand hover:underline font-medium">
              ← Back to My Orders
            </Link>
          </div>

          {/* Order Header */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold text-text-primary">
                  Order #{order.orderNumber}
                </h1>
                {order.inquiryNumber && (
                  <p className="text-sm text-text-secondary mt-1">Inquiry: {order.inquiryNumber}</p>
                )}
                <p className="text-sm text-text-secondary mt-1">Created: {formatDate(order.createdAt)}</p>
              </div>
              <span className={`self-start px-4 py-1.5 rounded-full text-sm font-semibold ${
                order.status === 'CANCELLED' || order.status === 'REFUNDED'
                  ? 'bg-red-100 text-red-700'
                  : order.status === 'COMPLETED' || order.status === 'DELIVERED'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-blue-100 text-brand'
              }`}>
                {STATUS_LABELS[order.status] || order.status}
              </span>
            </div>
          </div>

          {/* Order Progress */}
          {order.status !== 'CANCELLED' && order.status !== 'REFUNDED' && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
              <h2 className="text-sm font-semibold text-text-primary mb-4 uppercase tracking-wide">Order Progress</h2>
              <div className="flex items-center gap-2 flex-wrap">
                {STATUS_FLOW.map((step, index) => (
                  <div key={step} className="flex items-center gap-2">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      index <= currentStepIndex
                        ? 'bg-brand-light text-brand'
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        index <= currentStepIndex ? 'bg-brand text-white' : 'bg-gray-300 text-white'
                      }`}>
                        {index + 1}
                      </span>
                      {STATUS_LABELS[step]}
                    </div>
                    {index < STATUS_FLOW.length - 1 && (
                      <div className={`w-6 h-0.5 ${index < currentStepIndex ? 'bg-brand' : 'bg-gray-200'}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Items */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
            <h2 className="text-sm font-semibold text-text-primary mb-4 uppercase tracking-wide">Order Items</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-text-secondary text-xs uppercase tracking-wider">
                    <th className="text-left py-3 font-medium">Product</th>
                    <th className="text-left py-3 font-medium">SKU</th>
                    <th className="text-right py-3 font-medium">Unit Price</th>
                    <th className="text-center py-3 font-medium">Qty</th>
                    <th className="text-right py-3 font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items?.map((item, idx) => (
                    <tr key={item.id || idx} className="border-b border-gray-100 last:border-0">
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                            {item.productImage ? (
                              <img src={formatImageUrl(item.productImage)} alt={item.productName || ''} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No img</div>
                            )}
                          </div>
                          <span className="font-medium text-text-primary">{item.productName}</span>
                        </div>
                      </td>
                      <td className="py-3 font-mono text-text-secondary">{item.productSku || '—'}</td>
                      <td className="py-3 text-right">${(item.unitPrice || 0).toFixed(2)}</td>
                      <td className="py-3 text-center font-medium">{item.quantity}</td>
                      <td className="py-3 text-right font-semibold text-text-primary">${(item.totalPrice || (item.unitPrice || 0) * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-200">
                    <td colSpan={4} className="py-3 text-right font-semibold text-text-primary">Total Amount</td>
                    <td className="py-3 text-right font-bold text-lg text-brand">${(order.totalAmount || 0).toFixed(2)}</td>
                  </tr>
                  {order.totalWeight !== undefined && order.totalWeight !== null && (
                    <tr>
                      <td colSpan={4} className="py-1 text-right text-sm text-text-secondary">Total Weight</td>
                      <td className="py-1 text-right text-sm text-text-secondary">{order.totalWeight} kg</td>
                    </tr>
                  )}
                </tfoot>
              </table>
            </div>
          </div>

          {/* Payment & Shipping */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Payment Info */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-sm font-semibold text-text-primary mb-4 uppercase tracking-wide">Payment</h2>
              {order.paymentStatus && (
                <div className="mb-3">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${PAYMENT_STATUS_LABELS[order.paymentStatus]?.color || 'bg-gray-100 text-gray-600'}`}>
                    {PAYMENT_STATUS_LABELS[order.paymentStatus]?.label || order.paymentStatus}
                  </span>
                </div>
              )}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Total Amount</span>
                  <span className="font-semibold text-text-primary">${(order.totalAmount || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Paid</span>
                  <span className="font-semibold text-green-600">${(order.paidAmount || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-gray-100 pt-2">
                  <span className="text-text-secondary">Balance</span>
                  <span className="font-semibold text-red-600">${((order.totalAmount || 0) - (order.paidAmount || 0)).toFixed(2)}</span>
                </div>
              </div>
              {order.paymentRecords && order.paymentRecords.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h3 className="text-xs font-semibold text-text-secondary mb-2 uppercase">Payment History</h3>
                  <div className="space-y-2">
                    {order.paymentRecords.map((pr) => (
                      <div key={pr.id} className="text-xs text-text-secondary flex justify-between">
                        <span>{pr.paymentMethod || 'Payment'} {pr.transactionId && `(#${pr.transactionId})`}</span>
                        <span className="font-medium text-text-primary">${pr.amount.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Shipping Info */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-sm font-semibold text-text-primary mb-4 uppercase tracking-wide">Shipping</h2>
              {order.shippingStatus && (
                <div className="mb-3">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${SHIPPING_STATUS_LABELS[order.shippingStatus]?.color || 'bg-gray-100 text-gray-600'}`}>
                    {SHIPPING_STATUS_LABELS[order.shippingStatus]?.label || order.shippingStatus}
                  </span>
                </div>
              )}
              {order.shippingAddress ? (
                <div className="space-y-1.5 text-sm mb-4">
                  <p className="font-medium text-text-primary">{order.receiverName}</p>
                  <p className="text-text-secondary">{order.receiverPhone}</p>
                  <p className="text-text-secondary">
                    {[order.shippingAddress, order.shippingCity, order.shippingRegion, order.shippingCountry].filter(Boolean).join(', ')}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-text-secondary mb-4">Shipping details will be updated once your order is processed.</p>
              )}
              {order.carrier && (
                <div className="flex justify-between text-sm py-2 border-t border-gray-100">
                  <span className="text-text-secondary">Carrier</span>
                  <span className="font-medium text-text-primary">{order.carrier}</span>
                </div>
              )}
              {order.trackingNumber && (
                <div className="flex justify-between text-sm py-2 border-t border-gray-100">
                  <span className="text-text-secondary">Tracking No.</span>
                  <span className="font-mono font-medium text-text-primary">{order.trackingNumber}</span>
                </div>
              )}
              {order.estimatedShipDate && (
                <div className="flex justify-between text-sm py-2 border-t border-gray-100">
                  <span className="text-text-secondary">Est. Ship Date</span>
                  <span className="font-medium text-text-primary">{formatDate(order.estimatedShipDate)}</span>
                </div>
              )}
              {order.shipmentRecords && order.shipmentRecords.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h3 className="text-xs font-semibold text-text-secondary mb-2 uppercase">Shipment History</h3>
                  <div className="space-y-2">
                    {order.shipmentRecords.map((sr) => (
                      <div key={sr.id} className="text-xs text-text-secondary">
                        <div className="flex justify-between">
                          <span>{sr.carrier} — {sr.trackingNumber}</span>
                          <span className="font-medium">{SHIPPING_STATUS_LABELS[sr.status || '']?.label || sr.status}</span>
                        </div>
                        {sr.shippedAt && <p>Shipped: {formatDate(sr.shippedAt)}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
              <h2 className="text-sm font-semibold text-text-primary mb-2 uppercase tracking-wide">Your Notes</h2>
              <p className="text-sm text-text-secondary">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
