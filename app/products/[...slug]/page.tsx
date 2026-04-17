'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { productService } from '@/services';
import type { Product } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import apiClient from '@/lib/api-client';
import Head from 'next/head';

export default function ProductDetailPage() {
  const { isAuthenticated } = useAuth();
  const allParams = useParams();
  const router = useRouter();
  
  const slugArray = allParams?.slug as string[] | undefined;
  const productSlug = slugArray ? '/' + slugArray.join('/') : '';
  const productId = slugArray ? Number(slugArray[slugArray.length - 1]) : 0;
  
  const previewProduct = (router as any).state?.product as Product | undefined;
  
  const [product, setProduct] = useState<Product | null>(previewProduct || null);
  const [loading, setLoading] = useState(!previewProduct);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const mainImageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (productSlug || previewProduct) {
      fetchProductDetail();
    }
  }, [productSlug]);

  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      
      if (previewProduct && previewProduct.slug === productSlug) {
        console.log('Using preview product:', previewProduct);
        setProduct(previewProduct);
        setLoading(false);
        return;
      }
      
      console.log('Fetching product detail for slug:', productSlug);
      const data = await productService.getProductDetail(productSlug);
      console.log('Raw product data from API:', data);
      console.log('Specifications type:', typeof data.specifications, 'Value:', data.specifications);
      
      // 解析tags（JSON字符串 -> 数组）
      if (data.tags && typeof data.tags === 'string') {
        try {
          data.tags = JSON.parse(data.tags);
        } catch (e) {
          console.error('Failed to parse tags:', e);
          data.tags = [];
        }
      }
      
      // 解析features（JSON字符串 -> 对象）
      if (data.features && typeof data.features === 'string') {
        try {
          const parsed = JSON.parse(data.features);
          if (typeof parsed === 'object' && !Array.isArray(parsed)) {
            data.featuresParsed = parsed;
          } else {
            data.featuresParsed = {};
          }
        } catch (e) {
          console.error('Failed to parse features:', e);
          data.featuresParsed = {};
        }
      }
      
      // 解析specifications（JSON字符串 -> 数组）
      if (data.specifications && typeof data.specifications === 'string') {
        console.log('Parsing specifications from JSON string...');
        try {
          data.specifications = JSON.parse(data.specifications);
          console.log('Parsed specifications:', data.specifications);
        } catch (e) {
          console.error('Failed to parse specifications:', e);
          data.specifications = [];
        }
      } else if (Array.isArray(data.specifications)) {
        console.log('Specifications already an array:', data.specifications);
      } else {
        console.log('No specifications found');
      }
      
      setProduct(data);
      console.log('Final product state:', data);
    } catch (err) {
      console.error('Failed to fetch product detail:', err);
      if (!product) {
        setProduct({
          id: productId,
          name: `Product #${productId}`,
          title: `Product #${productId}`,
          slug: productSlug,
          brand: 'MythToy',
          image: '',
          alt: 'Product image',
          description: 'Product details are being updated.',
          currentPrice: 0,
          minOrder: 1,
          status: 'ACTIVE',
        } as Product);
      }
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
  const galleryImages = (() => {
    const images: string[] = [];
    if (product?.image) {
      images.push(product.image);
    }
    if (product?.galleries && product.galleries.length > 0) {
      images.push(...product.galleries.map(g => g.imageUrl));
    }
    return images;
  })();

  // 解析核心特性（从 shortDescription 中用分号分割）
  const keyFeatures = (() => {
    if (!product?.shortDescription) return [];
    return product.shortDescription.split(';').filter(f => f.trim()).slice(0, 5);
  })();

  // 解析Tags为数组
  const tags = (() => {
    if (!product?.tags) return [];
    if (Array.isArray(product.tags)) return product.tags;
    if (typeof product.tags === 'string') {
      try {
        const parsed = JSON.parse(product.tags);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  })();

  // 解析Features对象
  const featuresObj = (() => {
    if (product?.featuresParsed) return product.featuresParsed;
    if (product?.features && typeof product.features === 'object' && !Array.isArray(product.features)) {
      return product.features;
    }
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

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      router.push('/login');
      return;
    }

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

    try {
      setAddingToCart(true);
      const response = await apiClient.post('/v1/cart/add', {
        skuId: sku.id,
        quantity: quantity,
      });

      if (response.code === 200) {
        alert(`✅ Added ${quantity} pcs to cart!\n\nSKU: ${sku.sku}\nQuantity: ${quantity}`);
      } else {
        throw new Error(response.message || 'Failed to add to cart');
      }
    } catch (err: any) {
      console.error('Failed to add to cart:', err);
      alert(err.message || 'Failed to add to cart. Please try again.');
    } finally {
      setAddingToCart(false);
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
      {/* SEO Meta Tags - 隐藏元数据 */}
      <Head>
        {product.seoTitle && <title>{product.seoTitle}</title>}
        {product.seoDescription && <meta name="description" content={product.seoDescription} />}
        {product.seoKeywords && <meta name="keywords" content={product.seoKeywords} />}
      </Head>

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
                <div className="grid grid-cols-5 gap-3">
                  {galleryImages.slice(0, 5).map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
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
              )}
            </div>

            {/* RIGHT: Product Info */}
            <div className="p-6 lg:p-8 flex flex-col">
              {/* Title */}
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                {product.title}
              </h1>

              {/* Tags Badges */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Key Features (Bullet Points with Green Checkmark) */}
              {(keyFeatures.length > 0 || Object.keys(featuresObj).length > 0) && (
                <div className="mb-6 space-y-2">
                  {keyFeatures.length > 0 ? (
                    keyFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700 text-sm">{feature.trim()}</span>
                      </div>
                    ))
                  ) : (
                    Object.entries(featuresObj).slice(0, 5).map(([key, value], index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700 text-sm">
                          <span className="font-semibold">{key}:</span> {String(value)}
                        </span>
                      </div>
                    ))
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
                    {product.productSkus.map((sku, index) => (
                      <div 
                        key={sku.id || index} 
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          sku.stock === 0 
                            ? 'bg-gray-100 border-gray-200 opacity-50' 
                            : 'bg-white border-gray-300 hover:border-gray-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-sm font-mono font-semibold text-gray-900">{sku.sku}</span>
                            {sku.color && (
                              <span className="ml-2 text-xs text-gray-500">({sku.color})</span>
                            )}
                          </div>
                          {sku.stock === 0 && (
                            <span className="text-xs text-red-600 font-semibold">Out of Stock</span>
                          )}
                        </div>
                      </div>
                    ))}
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

                {/* Add to Cart Button */}
                {isAuthenticated ? (
                  <button
                    data-cart-button
                    onClick={handleAddToCart}
                    disabled={addingToCart || (product.productSkus?.[0]?.stock === 0)}
                    className="w-full bg-gray-800 text-white py-4 px-6 rounded-xl font-bold text-lg hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {addingToCart ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Adding to Cart...
                      </>
                    ) : product.productSkus?.[0]?.stock === 0 ? (
                      'Out of Stock'
                    ) : (
                      <>
                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Add to Inquiry Cart
                      </>
                    )}
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="block w-full bg-gray-800 text-white text-center py-4 px-6 rounded-xl font-bold text-lg hover:bg-gray-900 transition-all"
                  >
                    Login to Add to Cart
                  </Link>
                )}
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
                        <td className="px-4 py-3 text-sm text-gray-600">{product.netWeight} kg</td>
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

      {/* Floating Cart Button (Mobile) */}
      {isAuthenticated && (
        <Link
          href="/cart"
          data-cart-icon
          className="fixed bottom-6 right-6 lg:hidden bg-gray-800 text-white p-4 rounded-full shadow-lg hover:bg-gray-900 transition-all z-50"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </Link>
      )}
    </div>
  );
}
