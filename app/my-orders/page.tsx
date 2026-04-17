'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import apiClient, { UnwrappedAxiosResponse } from '@/lib/api-client';

interface InquiryOrder {
  id: number;
  inquiryNumber: string;
  status: string;  // PENDING, QUOTED, CONFIRMED, CANCELLED
  totalWeight?: number;
  totalAmount?: number;
  notes?: string;
  quoteNotes?: string;
  confirmedAt?: string;
  createdAt: string;
  updatedAt: string;
}

const STATUS_CONFIG = {
  PENDING: { color: 'bg-orange-100 text-orange-800', label: 'Pending Quote' },
  QUOTED: { color: 'bg-blue-100 text-blue-800', label: 'Quoted' },
  CONFIRMED: { color: 'bg-green-100 text-green-800', label: 'Confirmed' },
  CANCELLED: { color: 'bg-gray-100 text-gray-800', label: 'Cancelled' },
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<InquiryOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response: UnwrappedAxiosResponse<any> = await apiClient.get('/v1/inquiry-orders/my-orders', {
        params: { page, size: 20 },
      });
      
      if (response.code === 200 && response.data) {
        setOrders(response.data.content || []);
        setTotalPages(response.data.totalPages || 0);
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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Inquiries</h1>
            <p className="mt-2 text-gray-600">View your inquiry history and order status</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : orders.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No inquiries yet</h3>
              <p className="mt-2 text-gray-500">Start by adding products to your cart</p>
              <div className="mt-6">
                <Link
                  href="/products"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  Browse Products
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Orders List */}
              <div className="space-y-4">
                {orders.map((order) => {
                  const statusConfig = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.PENDING;
                  
                  return (
                    <div key={order.id} className="bg-white rounded-lg shadow overflow-hidden">
                      <div className="p-6">
                        {/* Header Row */}
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              Inquiry #{order.inquiryNumber}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              Created: {formatDate(order.createdAt)}
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.color}`}>
                            {statusConfig.label}
                          </span>
                        </div>

                        {/* Order Details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                          <div>
                            <p className="text-sm text-gray-500">Total Amount</p>
                            <p className="text-lg font-bold text-gray-900">
                              ${order.totalAmount?.toFixed(2) || '0.00'}
                            </p>
                          </div>
                          
                          <div>
                            <p className="text-sm text-gray-500">Total Weight</p>
                            <p className="text-lg font-bold text-gray-900">
                              {order.totalWeight?.toFixed(2) || '0.00'} kg
                            </p>
                            <p className="text-xs text-gray-400 mt-1">Shipping base</p>
                          </div>
                          
                          {order.confirmedAt && (
                            <div>
                              <p className="text-sm text-gray-500">Confirmed At</p>
                              <p className="text-sm font-medium text-gray-900">
                                {formatDate(order.confirmedAt)}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Notes */}
                        {order.notes && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <p className="text-sm text-gray-500 mb-1">Your Notes:</p>
                            <p className="text-sm text-gray-700">{order.notes}</p>
                          </div>
                        )}

                        {order.quoteNotes && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <p className="text-sm text-gray-500 mb-1">Quote Notes:</p>
                            <p className="text-sm text-gray-700">{order.quoteNotes}</p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end">
                          <button
                            onClick={() => alert(`View details for inquiry #${order.inquiryNumber}`)}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
                            View Details →
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-between">
                  <button
                    onClick={() => setPage(Math.max(0, page - 1))}
                    disabled={page === 0}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  <p className="text-sm text-gray-700">
                    Page {page + 1} of {totalPages}
                  </p>
                  
                  <button
                    onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                    disabled={page >= totalPages - 1}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
