'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import apiClient, { UnwrappedAxiosResponse } from '@/lib/api-client';

interface InquiryOrder {
  id: number;
  inquiryNumber: string;
  orderNumber?: string;
  status: string;
  paymentStatus?: string;
  shippingStatus?: string;
  totalWeight?: number;
  totalAmount?: number;
  itemCount?: number;
  notes?: string;
  quoteNotes?: string;
  confirmedAt?: string;
  createdAt: string;
  updatedAt: string;
}

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  PENDING: { color: 'bg-orange-100 text-orange-700', label: 'Pending Quote' },
  QUOTED: { color: 'bg-blue-100 text-blue-700', label: 'Quoted' },
  CONFIRMED: { color: 'bg-green-100 text-green-700', label: 'Confirmed' },
  PRODUCING: { color: 'bg-purple-100 text-purple-700', label: 'Producing' },
  READY_TO_SHIP: { color: 'bg-indigo-100 text-indigo-700', label: 'Ready to Ship' },
  SHIPPED: { color: 'bg-cyan-100 text-cyan-700', label: 'Shipped' },
  DELIVERED: { color: 'bg-green-100 text-green-700', label: 'Delivered' },
  COMPLETED: { color: 'bg-emerald-100 text-emerald-700', label: 'Completed' },
  CANCELLED: { color: 'bg-gray-100 text-gray-600', label: 'Cancelled' },
  REFUNDED: { color: 'bg-red-100 text-red-600', label: 'Refunded' },
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<InquiryOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response: UnwrappedAxiosResponse<any> = await apiClient.get('/v1/inquiry-orders/my-orders', {
        params: { page, size: 20 },
      });

      if (response.code === 200 && response.data) {
        setOrders(response.data.content || []);
        setTotalPages(response.data.totalPages || 0);
        setTotalElements(response.data.totalElements || 0);
      }
    } catch (err: any) {
      console.error('Failed to fetch orders:', err);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#F8F9FA] py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#1A1A1A]">My Orders</h1>
            <p className="text-sm text-[#6C757D] mt-1">
              {totalElements > 0
                ? `${totalElements} order${totalElements > 1 ? 's' : ''} total`
                : 'Track your inquiries and orders'}
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#0056B3] border-t-transparent" />
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
              <svg className="w-16 h-16 text-gray-200 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h2 className="text-lg font-semibold text-[#1A1A1A] mb-2">No orders yet</h2>
              <p className="text-[#6C757D] text-sm mb-6">Start by adding products to your inquiry cart</p>
              <Link
                href="/products"
                className="inline-flex items-center px-6 py-2.5 rounded-lg bg-[#0056B3] text-white text-sm font-semibold hover:bg-[#004494] transition-colors"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {orders.map((order) => {
                  const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;

                  return (
                    <div key={order.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                      <div className="p-6">
                        {/* Header Row */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                          <div>
                            <div className="flex items-center gap-3">
                              <h3 className="text-lg font-semibold text-[#1A1A1A]">
                                {order.orderNumber || `Inquiry #${order.inquiryNumber}`}
                              </h3>
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                                {statusConfig.label}
                              </span>
                            </div>
                            <p className="text-sm text-[#6C757D] mt-1">
                              {formatDate(order.createdAt)}
                              {order.confirmedAt && ` · Confirmed ${formatDate(order.confirmedAt)}`}
                            </p>
                          </div>
                          <Link
                            href={`/my-orders/${order.id}`}
                            className="self-start sm:self-center inline-flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-[#0056B3] bg-[#E8F0FE] hover:bg-[#0056B3] hover:text-white transition-colors"
                          >
                            View Details
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </div>

                        {/* Summary Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                          <div>
                            <p className="text-xs text-[#6C757D] uppercase tracking-wide mb-1">Amount</p>
                            <p className="text-base font-semibold text-[#1A1A1A]">
                              {order.totalAmount != null ? `$${order.totalAmount.toFixed(2)}` : 'Pending'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-[#6C757D] uppercase tracking-wide mb-1">Weight</p>
                            <p className="text-base font-semibold text-[#1A1A1A]">
                              {order.totalWeight != null ? `${order.totalWeight.toFixed(2)} kg` : '—'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-[#6C757D] uppercase tracking-wide mb-1">Payment</p>
                            <p className="text-sm font-medium text-[#1A1A1A]">
                              {order.paymentStatus || '—'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-[#6C757D] uppercase tracking-wide mb-1">Shipping</p>
                            <p className="text-sm font-medium text-[#1A1A1A]">
                              {order.shippingStatus || '—'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-4">
                  <button
                    onClick={() => setPage(Math.max(0, page - 1))}
                    disabled={page === 0}
                    className="px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-[#1A1A1A] bg-white hover:bg-[#F8F9FA] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum: number;
                      if (totalPages <= 5) {
                        pageNum = i;
                      } else if (page <= 2) {
                        pageNum = i;
                      } else if (page >= totalPages - 3) {
                        pageNum = totalPages - 5 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                            page === pageNum
                              ? 'bg-[#0056B3] text-white'
                              : 'border border-gray-300 text-[#1A1A1A] hover:bg-[#F8F9FA]'
                          }`}
                        >
                          {pageNum + 1}
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                    disabled={page >= totalPages - 1}
                    className="px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-[#1A1A1A] bg-white hover:bg-[#F8F9FA] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
