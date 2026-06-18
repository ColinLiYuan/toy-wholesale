'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { productService } from '@/services';
import type { Product } from '@/types';
import { R2_BASE_URL } from '@/lib/r2-config';

export default function ProductDetailPage() {
  const allParams = useParams();
  const router = useRouter();
  
  // [...slug] 会捕获所有路径段，例如 ['female-sex-toys', 'wand-vibrators', 'the-slate']
  const slugArray = allParams?.slug as string[] | undefined;
  const productSlug = slugArray ? '/' + slugArray.join('/') : '';
  const productId = slugArray ? Number(slugArray[slugArray.length - 1]) : 0;
  
  // 从 router state 获取产品预览数据（从列表页跳转时携带）
  const previewProduct = (router as any).state?.product as Product | undefined;
  
  const [product, setProduct] = useState<Product | null>(previewProduct || null);
  const [loading, setLoading] = useState(!previewProduct);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (productSlug || previewProduct) {
      fetchProductDetail();
    }
  }, [productSlug]);

  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      
      // 如果有预览数据且 slug 匹配，直接显示
      if (previewProduct && previewProduct.slug === productSlug) {
        setProduct(previewProduct);
        setLoading(false);
        return;
      }
      
      const data = await productService.getProductDetail(productSlug);
      setProduct(data);
    } catch (err) {
      console.error('Failed to fetch product detail:', err);
      // API 尚未准备好，显示基础信息
      if (!product) {
        setProduct({
          id: productId,
          name: `Product #${productId}`,
          title: `Product #${productId} - Details Coming Soon`,
          sku: 'N/A',
          brand: 'MythToy',
          image: '',
          alt: 'Product image',
          slug: productSlug,
          description: 'Product details are being updated. Please contact us for more information.',
          rating: 0,
          stock: 0,
          originalPrice: 0,
          currentPrice: 0,
          minOrder: 1,
          colors: [],
          categories: [],
          features: {},
          specifications: [],
          galleries: [],
          badge: undefined,
          status: 'ACTIVE',
          reviewCount: 0,
        } as Product);
      }
    } finally {
      setLoading(false);
    }
  };

  // 获取图片完整 URL（使用 Cloudflare R2 CDN）
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '/placeholder-product.svg';
    if (imagePath.startsWith('http')) return imagePath;
    // 后端返回的路径如 print/product/xxx.webp，拼接 R2 CDN URL
    return `https://pub-e5d14c6d386c4d90979458082617517a.r2.dev/${imagePath}`;
  };

  // 获取占位图绝对 URL
  const getPlaceholderUrl = () => {
    return typeof window !== 'undefined'
      ? new URL('/placeholder-product.svg', window.location.origin).href
      : '/placeholder-product.svg';
  };

  // 构建画廊图片列表
  const galleryImages = product?.galleries && product.galleries.length > 0 
    ? product.galleries.map(g => g.imageUrl)
    : product?.image ? [product.image] : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-600 text-lg mb-4">{error || 'Product not found'}</p>
          <Link
            href="/products"
            className="inline-block bg-brand text-white px-6 py-2 rounded-lg hover:bg-brand-hover transition-colors"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-12">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link href="/" className="text-text-secondary hover:text-brand transition-colors">
                  Home
                </Link>
              </li>
              <li className="text-gray-400">/</li>
              <li>
                <Link href="/products" className="text-text-secondary hover:text-brand transition-colors">
                  Shop Wholesale
                </Link>
              </li>
              <li className="text-gray-400">/</li>
              <li className="text-text-primary font-medium">
                {product.title}
              </li>
            </ol>
          </nav>

          {/* Product Detail */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square bg-surface rounded-2xl overflow-hidden border border-gray-200">
                <img
                  src={getImageUrl(galleryImages[selectedImageIndex] || product.image)}
                  alt={product.alt || product.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-product.svg';
                  }}
                />
              </div>

              {/* Thumbnail Gallery */}
              {galleryImages.length > 1 && (
                <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === idx
                          ? 'border-brand shadow-md'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <img
                        src={getImageUrl(img)}
                        alt={`${product.title} - Image ${idx + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-product.svg';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              {/* Brand */}
              <div className="mb-4">
                <span className="text-sm font-medium text-brand uppercase tracking-wider">
                  {product.brand}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">
                {product.title}
              </h1>

              {/* Description */}
              <p className="text-text-secondary text-lg mb-8 leading-relaxed">
                {product.description ? product.description.replace(/###|\*\*/g, '') : 'No description available'}
              </p>

              {/* Price */}
              <div className="mb-8 p-6 bg-surface border border-gray-200 rounded-xl">
                <div className="flex items-baseline gap-3 mb-2">
                  {product.originalPrice !== undefined && product.originalPrice !== null && product.originalPrice > product.currentPrice && (
                    <span className="text-xl text-gray-400 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                  <span className="text-4xl font-bold text-brand">
                    ${product.currentPrice.toFixed(2)}
                  </span>
                </div>
                {product.minOrder !== undefined && product.minOrder !== null && product.minOrder > 0 && (
                  <p className="text-sm text-text-secondary">
                    Minimum Order: {product.minOrder} pcs
                  </p>
                )}
              </div>

              {/* Features */}
              {(() => {
                const featuresArray = product.features 
                  ? (Array.isArray(product.features) 
                      ? product.features 
                      : (typeof product.features === 'string' 
                          ? JSON.parse(product.features) 
                          : Object.entries(product.features).map(([key, value]) => `${key}: ${value}`)))
                  : [];
                
                return featuresArray.length > 0 ? (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-text-primary mb-4">
                      Key Features:
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {featuresArray.map((feature: any, index: number) => (
                        <span
                          key={index}
                          className="px-4 py-2 text-sm rounded-lg bg-surface text-text-primary border border-gray-200"
                        >
                          {typeof feature === 'string' ? feature : `${feature.key || ''}: ${feature.value || ''}`}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Specifications */}
              {product.specifications && product.specifications.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">
                    Specifications:
                  </h3>
                  <div className="space-y-3">
                    {product.specifications.map((spec, index) => (
                      <div key={index} className="flex justify-between py-2 border-b border-gray-200">
                        <span className="text-text-secondary">{spec.specKey}</span>
                        <span className="text-text-primary font-medium">{spec.specValue}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* MOQ (Minimum Order Quantity) */}
              {product.minOrder !== undefined && product.minOrder !== null && product.minOrder > 0 && (
                <div className="mb-8 p-4 bg-surface border border-gray-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    Minimum Order Quantity:
                  </h3>
                  <p className="text-2xl font-bold text-brand">
                    {product.minOrder} pcs
                  </p>
                </div>
              )}

              {/* Available SKUs */}
              {product.productSkus && product.productSkus.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">
                    Available Options:
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {product.productSkus.map((sku, index) => (
                      <div key={sku.id || index} className="p-4 bg-surface border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-brand">
                            {sku.sku}
                          </span>
                          {sku.color && (
                            <span className="text-xs text-text-secondary">
                              {sku.color}
                            </span>
                          )}
                        </div>
                        {sku.image && (
                          <img
                            src={getImageUrl(sku.image)}
                            alt={sku.sku}
                            className="w-12 h-12 object-cover rounded"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-auto space-y-4">
                <Link
                  href="/contact"
                  className="block w-full bg-brand text-white text-center py-4 px-6 rounded-lg font-bold text-lg hover:bg-brand-hover transition-all shadow-sm"
                >
                  Request Quote
                </Link>
                <Link
                  href="/products"
                  className="block w-full border border-gray-300 text-text-primary text-center py-4 px-6 rounded-lg font-semibold hover:bg-surface transition-colors"
                >
                  Back to Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
