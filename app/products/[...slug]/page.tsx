import { productService } from '@/services';
import type { Product } from '@/types';
import ProductDetailClient from './ProductDetailClient';
import { Metadata } from 'next';

// 生成元数据
export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  const productSlug = slug ? slug.join('/') : '';
  
  try {
    const product = await productService.getProductDetail(productSlug);
    return {
      title: product.seoTitle || `${product.title} | Silvibe`,
      description: product.seoDescription || product.description || `Buy ${product.title} at wholesale prices. Premium adult wellness products for global distribution.`,
      keywords: product.seoKeywords ? product.seoKeywords.split(',').map(k => k.trim()) : [product.title, 'adult toys wholesale', 'wellness products'],
      openGraph: {
        title: product.seoTitle || `${product.title} | Silvibe`,
        description: product.seoDescription || product.description || `Buy ${product.title} at wholesale prices. Premium adult wellness products for global distribution.`,
        images: product.image ? [{ url: product.image.startsWith('http') ? product.image : `https://pub-e5d14c6d386c4d90979458082617517a.r2.dev/${product.image}`, alt: product.alt || product.title }] : [],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: product.seoTitle || `${product.title} | Silvibe`,
        description: product.seoDescription || product.description || `Buy ${product.title} at wholesale prices. Premium adult wellness products for global distribution.`,
        images: product.image ? [product.image.startsWith('http') ? product.image : `https://pub-e5d14c6d386c4d90979458082617517a.r2.dev/${product.image}`] : [],
      },
    };
  } catch (error) {
    return {
      title: 'Product Not Found | Silvibe',
      description: 'The requested product could not be found.',
    };
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const productSlug = slug ? slug.join('/') : '';
  
  let product: Product | null = null;
  let error: string | null = null;
  
  try {
    product = await productService.getProductDetail(productSlug);
    
    // 解析tags（JSON字符串 -> 数组）
    if (product.tags && typeof product.tags === 'string') {
      try {
        product.tags = JSON.parse(product.tags);
      } catch (e) {
        console.error('Failed to parse tags:', e);
        product.tags = [];
      }
    }
    
    // 解析features（JSON字符串 -> 对象）
    if (product.features && typeof product.features === 'string') {
      try {
        const parsed = JSON.parse(product.features);
        if (typeof parsed === 'object' && !Array.isArray(parsed)) {
          product.featuresParsed = parsed;
        } else {
          product.featuresParsed = {};
        }
      } catch (e) {
        console.error('Failed to parse features:', e);
        product.featuresParsed = {};
      }
    }
    
    // 解析specifications（JSON字符串 -> 数组）
    if (product.specifications && typeof product.specifications === 'string') {
      try {
        product.specifications = JSON.parse(product.specifications);
      } catch (e) {
        console.error('Failed to parse specifications:', e);
        product.specifications = [];
      }
    }
  } catch (err) {
    console.error('Failed to fetch product detail:', err);
    const errorMessage = err instanceof Error ? err.message : 'Failed to load product details';
    error = errorMessage;
  }
  
  return <ProductDetailClient initialProduct={product} error={error} productSlug={productSlug} />;
}
