'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import apiClient, { UnwrappedAxiosResponse } from '@/lib/api-client';
import type { ShoppingCart, CartItem, ProductSku } from '@/types';

export default function CartPage() {
  const { user } = useAuth();
  const [cart, setCart] = useState<ShoppingCart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 获取购物车数据
  const fetchCart = async () => {
    try {
      setLoading(true);
      const response: UnwrappedAxiosResponse<any> = await apiClient.get('/v1/cart');
      if (response.code === 200) {
        setCart(response.data);
      }
    } catch (err: any) {
      console.error('Failed to fetch cart:', err);
      setError('Failed to load cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);

  // 更新商品数量
  const updateQuantity = async (itemId: number, quantity: number) => {
    try {
      const response: UnwrappedAxiosResponse<any> = await apiClient.put(`/v1/cart/items/${itemId}`, { quantity });
      if (response.code === 200) {
        fetchCart(); // 重新获取购物车
      }
    } catch (err: any) {
      console.error('Failed to update quantity:', err);
      alert('Failed to update quantity');
    }
  };

  // 删除商品
  const removeItem = async (itemId: number) => {
    try {
      const response: UnwrappedAxiosResponse<any> = await apiClient.delete(`/v1/cart/items/${itemId}`);
      if (response.code === 200) {
        fetchCart();
      }
    } catch (err: any) {
      console.error('Failed to remove item:', err);
      alert('Failed to remove item');
    }
  };

  // 清空购物车
  const clearCart = async () => {
    if (!confirm('Are you sure you want to clear the cart?')) return;
    
    try {
      const response: UnwrappedAxiosResponse<any> = await apiClient.delete('/v1/cart/clear');
      if (response.code === 200) {
        setCart(null);
      }
    } catch (err: any) {
      console.error('Failed to clear cart:', err);
      alert('Failed to clear cart');
    }
  };

  // 提交询价
  const submitInquiry = async () => {
    if (!cart || !cart.items || cart.items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    try {
      setSubmitting(true);
      const response: UnwrappedAxiosResponse<any> = await apiClient.post('/v1/cart/submit');
      
      if (response.code === 200) {
        // 显示成功消息
        alert(
          '✅ Inquiry Submitted!\n\n' +
          'Our team will contact you via WhatsApp for the shipping quote.\n\n' +
          `Inquiry Number: ${response.data.inquiryNumber}\n` +
          `Total Amount: $${response.data.totalAmount?.toFixed(2)}\n` +
          `Total Weight: ${response.data.totalWeight?.toFixed(2)} kg`
        );
        
        // 清空本地购物车状态
        setCart(null);
      } else {
        throw new Error(response.message || 'Failed to submit inquiry');
      }
    } catch (err: any) {
      console.error('Failed to submit inquiry:', err);
      alert(err.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your cart...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="mt-2 text-gray-600">Review your items and submit inquiry</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {!cart || !cart.items || cart.items.length === 0 ? (
            /* Empty Cart */
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
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Your cart is empty</h3>
              <p className="mt-2 text-gray-500">Start adding products to your cart</p>
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
            /* Cart Items */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items List */}
              <div className="lg:col-span-2 space-y-4">
                {cart.items.map((item: CartItem) => (
                  <div key={item.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center space-x-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
                        {item.productImage ? (
                          <img
                            src={item.productImage.startsWith('http') 
                              ? item.productImage 
                              : `https://pub-e5d14c6d386c4d90979458082617517a.r2.dev/${item.productImage}`}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {item.productName}
                        </h3>
                        <p className="text-sm text-gray-500">SKU: {item.sku?.sku}</p>
                        {item.sku?.color && (
                          <p className="text-sm text-gray-500">Color: {item.sku.color}</p>
                        )}
                        <p className="text-sm font-medium text-blue-600 mt-1">
                          ${item.priceAtAdd?.toFixed(2)} / unit
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>

                      {/* Subtotal */}
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          ${(item.priceAtAdd * item.quantity).toFixed(2)}
                        </p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-sm text-red-600 hover:text-red-700 mt-2"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Clear Cart Button */}
                <div className="flex justify-end">
                  <button
                    onClick={clearCart}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow p-6 sticky top-24">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                  
                  <div className="space-y-3 pb-4 border-b border-gray-200">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Items:</span>
                      <span className="font-medium">{cart.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">
                        ${cart.items.reduce((sum, item) => sum + (item.priceAtAdd * item.quantity), 0).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 space-y-4">
                    <button
                      onClick={submitInquiry}
                      disabled={submitting}
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {submitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        'Submit Inquiry'
                      )}
                    </button>

                    <p className="text-xs text-gray-500 text-center">
                      After submission, our team will contact you via WhatsApp with shipping quote
                    </p>

                    <Link
                      href="/products"
                      className="block w-full text-center py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
