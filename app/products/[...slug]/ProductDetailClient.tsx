'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Product } from '@/types';
import { inquiryCartUtils } from '@/lib/inquiry-cart';

// 本地兜底颜色码映射（字典不可用时使用）
const FALLBACK_COLOR_MAP: Record<string, string> = {
  'BK': 'Black',
  'WH': 'White',
  'RD': 'Red',
  'PK': 'Pink',
  'PU': 'Purple',
  'BL': 'Blue',
  'GN': 'Green',
  'SK': 'Skin',
  'CL': 'Clear',
};

interface ProductDetailClientProps {
  initialProduct: Product | null;
  error: string | null;
  productSlug: string;
}

export default function ProductDetailClient({ initialProduct, error, productSlug }: ProductDetailClientProps) {
  const router = useRouter();
  
  const [product, setProduct] = useState<Product | null>(initialProduct);
  const [loading, setLoading] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(product?.minOrder || 1);
  const [addingToInquiry, setAddingToInquiry] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const mainImageRef = useRef<HTMLDivElement>(null);

  // 颜色码 → 颜色名：优先取字典（商户在「字典管理」中配置），失败回退本地常量
  const [colorMap, setColorMap] = useState<Record<string, string>>(FALLBACK_COLOR_MAP);

  useEffect(() => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:9356';
    const siteId = process.env.NEXT_PUBLIC_SITE_ID || '';
    const headers: Record<string, string> = siteId ? { 'X-Site-Id': siteId } : {};
    fetch(`${apiBaseUrl}/api/v1/dicts?type=COLOR`, { headers })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('dicts fetch failed'))))
      .then((body) => {
        if (body?.code === 200 && Array.isArray(body?.data) && body.data.length > 0) {
          const map: Record<string, string> = {};
          body.data.forEach((item: { label?: string; value?: string }) => {
            if (item.value && item.label && !map[item.value]) {
              map[item.value] = item.label;
            }
          });
          setColorMap(map);
        }
      })
      .catch(() => {
        // 字典不可用时保持本地常量兜底
      });
  }, []);

  // 如果初始产品未加载，尝试重新获取
  useEffect(() => {
    if (!product && !error && productSlug) {
      fetchProductDetail();
    }
  }, [productSlug]);

  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/v1/products/${productSlug}`);
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
      } else {
        throw new Error('Failed to fetch product');
      }
    } catch (err) {
      console.error('Failed to fetch product detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '/placeholder-product.svg';
    if (imagePath.startsWith('http')) return imagePath;
    return `https://pub-e5d14c6d386c4d90979458082617517a.r2.dev/${imagePath}`;
  };

  const getPlaceholderUrl = () => {
    return typeof window !== 'undefined'
      ? new URL('/placeholder-product.svg', window.location.origin).href
      : '/placeholder-product.svg';
  };

  // 构建画廊图片列表
  // 优先使用管理后台设置的相册顺序（galleries），如果没有相册则使用主图（image）兜底
  const galleryImages = (() => {
    if (product?.galleries && product.galleries.length > 0) {
      return product.galleries.map(g => g.imageUrl);
    }
    return product?.image ? [product.image] : [];
  })();

  // 解析核心特性（从 shortDescription 中用分号分割）
  const keyFeatures = (() => {
    if (!product?.shortDescription) return [];
    return product.shortDescription.split(';').filter(f => f.trim()).slice(0, 5);
  })();

  // 内部管理标签（首页推荐/新品等），详情页不展示
  const internalTags = ['首页推荐', '新品', 'hot', 'new', 'featured'];

  // 解析Tags为数组，过滤掉内部管理标签
  const tags = (() => {
    if (!product?.tags) return [];
    let raw: string[] = [];
    if (Array.isArray(product.tags)) raw = product.tags;
    else if (typeof product.tags === 'string') {
      try {
        const parsed = JSON.parse(product.tags);
        raw = Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return raw.filter(t => !internalTags.includes(t));
  })();

  // 解析Features对象
  const featuresObj: Record<string, unknown> = (() => {
    const fp = product?.featuresParsed;
    if (fp && !Array.isArray(fp)) return fp;
    const f = product?.features;
    if (f && typeof f === 'object' && !Array.isArray(f)) return f;
    return {};
  })();

  // 鼠标悬停放大镜效果
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mainImageRef.current) return;
    
    const rect = mainImageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const handleAddToInquiryCart = async () => {
    const minOrder = product?.minOrder || 1;
    if (quantity < minOrder) {
      alert(`Minimum Order Quantity (MOQ) is ${minOrder} pcs. Please increase the quantity.`);
      return;
    }

    const sku = product?.productSkus?.[0];
    if (!sku) {
      alert('Product has no available SKU');
      return;
    }

    setAddingToInquiry(true);

    try {
      // 添加到询盘车（调用后端 API）
      await inquiryCartUtils.addItem({
        productId: product.id,
        productName: product.name,
        productImage: product.image,
        skuId: sku.id,
        skuCode: sku.sku,
        color: sku.color,
        quantity: quantity,
        specifications: featuresObj,
      });

      alert(`✅ Added to Inquiry Cart!\n\nProduct: ${product.name}\nSKU: ${sku.sku}\nQuantity: ${quantity}\n\nYou can submit inquiry from the Inquiry Cart.`);
    } catch (error) {
      console.error('Failed to add to inquiry cart:', error);
      alert('❌ Failed to add to Inquiry Cart. Please try again.');
    } finally {
      setAddingToInquiry(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gray-800 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error || 'Product not found'}</p>
          <Link
            href="/products"
            className="inline-block bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <nav>
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link href="/" className="text-gray-500 hover:text-gray-800 transition-colors">
                  Home
                </Link>
              </li>
              <li className="text-gray-400">/</li>
              <li>
                <Link href="/products" className="text-gray-500 hover:text-gray-800 transition-colors">
                  Products
                </Link>
              </li>
              <li className="text-gray-400">/</li>
              <li className="text-gray-900 font-medium truncate max-w-xs">
                {product.title}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Product Detail Grid */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* LEFT: Image Gallery */}
            <div className="p-6 lg:p-8 bg-gray-50">
              {/* Main Image with Zoom */}
              <div 
                ref={mainImageRef}
                className="relative aspect-square bg-white rounded-xl overflow-hidden border border-gray-200 mb-4 cursor-zoom-in"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
              >
                <img
                  src={getImageUrl(galleryImages[selectedImageIndex] || product.image)}
                  alt={product.alt || product.title}
                  className="w-full h-full object-cover transition-transform duration-300"
                  style={{
                    transform: isHovering ? 'scale(2)' : 'scale(1)',
                    transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = getPlaceholderUrl();
                  }}
                />
              </div>

              {/* Thumbnail Gallery */}
              {galleryImages.length > 1 && (
                <div className="relative">
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {galleryImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                          selectedImageIndex === idx
                            ? 'border-gray-800 shadow-md'
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        <img
                          src={getImageUrl(img)}
                          alt={`${product.title} - Image ${idx + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = getPlaceholderUrl();
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT: Product Info */}
            <div className="p-6 lg:p-8 flex flex-col">
              {/* Title */}
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {product.title}
              </h1>

              {/* Tags & Features Section */}
              {(tags.length > 0 || Object.keys(featuresObj).length > 0 || keyFeatures.length > 0) && (
                <div className="mb-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-4">Product Highlights</h3>
                  
                  {/* Tags */}
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Features List */}
                  {(keyFeatures.length > 0 || Object.keys(featuresObj).length > 0) && (
                    <ul className="space-y-3">
                      {keyFeatures.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700 text-sm">{feature.trim()}</span>
                        </li>
                      ))}
                      {Object.entries(featuresObj).map(([key, value], index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700 text-sm">
                            <span className="font-semibold">{key}:</span> {String(value)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* Description */}
              {product.description && (
                <div className="mb-6">
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {product.description.replace(/###|\*\*/g, '')}
                  </p>
                </div>
              )}

              {/* MOQ */}
              {product.minOrder && product.minOrder > 0 && (
                <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-sm font-semibold text-gray-900">
                    Minimum Order: <span className="text-lg text-blue-600">{product.minOrder}</span> Units
                  </p>
                </div>
              )}

              {/* SKU Options */}
              {product.productSkus && product.productSkus.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Available Options</h3>
                  <div className="space-y-2">
                    {product.productSkus.map((sku, index) => {
                      // 颜色码 → 颜色名（优先字典，见 colorMap 状态）
                      const fullColorName = sku.color ? (colorMap[sku.color] || sku.color) : '';
                      
                      return (
                        <div 
                          key={sku.id || index} 
                          className="p-3 border border-gray-300 rounded-lg bg-white"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-sm font-mono font-semibold text-gray-900">{sku.sku}</span>
                              {fullColorName && (
                                <span className="ml-2 text-xs text-gray-500">({fullColorName})</span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Selector & Add to Cart */}
              <div className="mt-auto pt-6 border-t border-gray-200 space-y-4">
                {/* Quantity */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Quantity {product.minOrder && product.minOrder > 1 && `(MOQ: ${product.minOrder})`}
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setQuantity(Math.max(product.minOrder || 1, quantity - 1))}
                      className="w-12 h-12 rounded-lg border-2 border-gray-300 flex items-center justify-center text-gray-700 hover:border-gray-800 hover:text-gray-800 transition-colors text-xl font-bold"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || product.minOrder || 1;
                        setQuantity(Math.max(product.minOrder || 1, val));
                      }}
                      min={product.minOrder || 1}
                      className="w-24 h-12 bg-white border-2 border-gray-300 rounded-lg text-center text-lg font-bold text-gray-900 focus:border-gray-800 focus:outline-none"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-12 rounded-lg border-2 border-gray-300 flex items-center justify-center text-gray-700 hover:border-gray-800 hover:text-gray-800 transition-colors text-xl font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Add to Inquiry Button */}
                <button
                  onClick={handleAddToInquiryCart}
                  disabled={addingToInquiry}
                  className="w-full bg-gray-800 text-white py-4 px-6 rounded-xl font-bold text-lg hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {addingToInquiry ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding...
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                      Add to Inquiry
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications Table (Zebra Striping) */}
        {(product.specifications && product.specifications.length > 0) || 
         product.material || product.netWeight ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
            <div className="p-6 lg:p-8">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Product Specifications</h3>
              <div className="max-w-3xl">
                <table className="min-w-full border border-gray-200">
                  <tbody>
                    {/* Material */}
                    {product.material && (
                      <tr className="bg-gray-50">
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900 w-1/3 border-r border-gray-200">Material</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{product.material}</td>
                      </tr>
                    )}
                    
                    {/* Net Weight */}
                    {product.netWeight !== undefined && product.netWeight !== null && (
                      <tr>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900 w-1/3 border-r border-gray-200">Net Weight</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{product.netWeight} g</td>
                      </tr>
                    )}

                    {/* Custom specifications */}
                    {product.specifications && product.specifications.map((spec, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900 w-1/3 border-r border-gray-200">{spec.specKey}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{spec.specValue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Floating Inquiry Cart Button (Mobile) */}
      <Link
        href="/inquiry-cart"
        data-inquiry-icon
        className="fixed bottom-6 right-6 lg:hidden bg-gray-800 text-white p-4 rounded-full shadow-lg hover:bg-gray-900 transition-all z-50"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      </Link>
    </div>
  );
}
