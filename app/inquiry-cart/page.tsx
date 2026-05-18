'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { inquiryCartUtils } from '@/lib/inquiry-cart';
import { inquiryService } from '@/services';
import type { InquiryCartItem } from '@/types';

export default function InquiryCartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<InquiryCartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Customer information form
  const [customerInfo, setCustomerInfo] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    companyName: '',
    country: '',
    message: '',
  });

  // Load inquiry cart data from backend API
  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = async () => {
    try {
      setLoading(true);
      const items = await inquiryCartUtils.getCartItems();
      setCartItems(items);
    } catch (error) {
      console.error('Failed to load cart items:', error);
    } finally {
      setLoading(false);
    }
  };

  // 获取图片 URL（处理 R2 CDN）
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '/placeholder-product.svg';
    if (imagePath.startsWith('http')) return imagePath;
    return `https://pub-e5d14c6d386c4d90979458082617517a.r2.dev/${imagePath}`;
  };

  // Update quantity
  const handleQuantityChange = async (cartItemId: number, newQuantity: number) => {
    try {
      await inquiryCartUtils.updateQuantity(cartItemId, newQuantity);
      await loadCartItems(); // Reload cart items
    } catch (error) {
      console.error('Failed to update quantity:', error);
      alert('Failed to update quantity');
    }
  };

  // Remove item
  const handleRemoveItem = async (cartItemId: number) => {
    try {
      await inquiryCartUtils.removeItem(cartItemId);
      await loadCartItems(); // Reload cart items
    } catch (error) {
      console.error('Failed to remove item:', error);
      alert('Failed to remove item');
    }
  };

  // Clear inquiry cart
  const handleClearCart = async () => {
    if (confirm('Are you sure you want to clear the inquiry cart?')) {
      try {
        await inquiryCartUtils.clearCart();
        setCartItems([]);
      } catch (error) {
        console.error('Failed to clear cart:', error);
        alert('Failed to clear cart');
      }
    }
  };

  // Submit inquiry
  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('[InquiryCart] Form submitted');

    // Validate required fields
    if (!customerInfo.customerName || !customerInfo.customerEmail) {
      alert('Please fill in your name and email');
      return;
    }

    if (cartItems.length === 0) {
      alert('Inquiry cart is empty, please add products');
      return;
    }

    setSubmitting(true);

    try {
      // Build inquiry data matching backend InquiryRequest DTO
      const inquiryData = {
        name: customerInfo.customerName,
        email: customerInfo.customerEmail,
        phone: customerInfo.customerPhone || undefined,
        company: customerInfo.companyName || undefined,
        country: customerInfo.country || undefined,
        message: customerInfo.message || undefined,
        source: 'WEBSITE_FORM',
        items: cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          notes: item.notes || undefined,
        })),
      };

      console.log('[InquiryCart] Submitting inquiry data:', inquiryData);

      // Submit inquiry
      const result = await inquiryService.submitInquiry(inquiryData as any);

      console.log('[InquiryCart] Inquiry submitted successfully:', result);

      // Clear inquiry cart
      await inquiryCartUtils.clearCart();
      setCartItems([]);

      alert(`Inquiry Submitted Successfully!\nInquiry Number: ${result.inquiryNumber}\n\nWe will contact you via WhatsApp/Email soon.`);

      // Redirect to homepage
      router.push('/');
    } catch (error) {
      console.error('[InquiryCart] Failed to submit inquiry:', error);
      alert('Submission failed, please try again later');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0056B3] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Inquiry Cart</h1>
          <p className="mt-2 text-gray-600">
            Review your selected products and submit your inquiry request
          </p>
        </div>

        {cartItems.length === 0 ? (
          // Empty inquiry cart
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-6xl mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Your Inquiry Cart is Empty
            </h2>
            <p className="text-gray-600 mb-6">
              Browse our products and add items to your inquiry cart
            </p>
            <Link
              href="/products"
              className="inline-block bg-[#0056B3] text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Product List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Product List ({cartItems.length})
                  </h2>
                  <button
                    onClick={handleClearCart}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Clear Cart
                  </button>
                </div>

                <div className="divide-y divide-gray-200">
                  {cartItems.map((item, index) => (
                    <div key={`${item.productId}-${item.skuId || 'no-sku'}-${index}`} className="p-6 flex gap-4">
                      {/* Product Image */}
                      <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={getImageUrl(item.productImage)}
                          alt={item.productName}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {item.productName}
                        </h3>
                        
                        {/* SKU and Color */}
                        <div className="text-sm text-gray-600 mb-2">
                          {item.skuCode && (
                            <span className="text-xs text-gray-500 font-mono">{item.skuCode}</span>
                          )}
                          {item.skuCode && item.color && <span className="mx-2">|</span>}
                          {item.color && (
                            <span className="text-xs text-gray-500">{item.color}</span>
                          )}
                        </div>

                        {/* Quantity Control */}
                        <div className="flex items-center gap-3 mt-3">
                          <label className="text-sm text-gray-600">Qty:</label>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(
                                item.id!,
                                parseInt(e.target.value) || 1
                              )
                            }
                            className="w-20 px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0056B3] focus:border-transparent"
                          />
                          <button
                            onClick={() => handleRemoveItem(item.id!)}
                            className="text-sm text-red-600 hover:text-red-700 ml-auto"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Customer Information Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Contact Information
                </h2>

                <form onSubmit={handleSubmitInquiry} className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={customerInfo.customerName}
                      onChange={(e) =>
                        setCustomerInfo({
                          ...customerInfo,
                          customerName: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0056B3] focus:border-transparent"
                      placeholder="Your Name"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={customerInfo.customerEmail}
                      onChange={(e) =>
                        setCustomerInfo({
                          ...customerInfo,
                          customerEmail: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0056B3] focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>

                  {/* Phone/WhatsApp */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone/WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={customerInfo.customerPhone}
                      onChange={(e) =>
                        setCustomerInfo({
                          ...customerInfo,
                          customerPhone: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0056B3] focus:border-transparent"
                      placeholder="+86 138 0000 0000"
                    />
                  </div>

                  {/* Company Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={customerInfo.companyName}
                      onChange={(e) =>
                        setCustomerInfo({
                          ...customerInfo,
                          companyName: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0056B3] focus:border-transparent"
                      placeholder="Your Company (Optional)"
                    />
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      value={customerInfo.country}
                      onChange={(e) =>
                        setCustomerInfo({
                          ...customerInfo,
                          country: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0056B3] focus:border-transparent"
                      placeholder="China"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      value={customerInfo.message}
                      onChange={(e) =>
                        setCustomerInfo({
                          ...customerInfo,
                          message: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0056B3] focus:border-transparent"
                      placeholder="Please tell us your specific requirements..."
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#0056B3] text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                  >
                    {submitting ? 'Submitting...' : 'Submit Inquiry'}
                  </button>

                  <p className="text-xs text-gray-500 text-center">
                    After submission, our sales team will contact you via WhatsApp/Email
                  </p>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
