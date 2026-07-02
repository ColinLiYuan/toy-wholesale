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
      title: product.seoTitle || `${product.title} | SinTone`,
      description: product.seoDescription || product.description || `Buy ${product.title} at wholesale prices. Premium adult wellness products for global distribution.`,
      keywords: product.seoKeywords ? product.seoKeywords.split(',').map(k => k.trim()) : [product.title, 'adult toys wholesale', 'wellness products'],
      openGraph: {
        title: product.seoTitle || `${product.title} | SinTone`,
        description: product.seoDescription || product.description || `Buy ${product.title} at wholesale prices. Premium adult wellness products for global distribution.`,
        images: product.image ? [{ url: product.image.startsWith('http') ? product.image : `https://pub-e5d14c6d386c4d90979458082617517a.r2.dev/${product.image}`, alt: product.alt || product.title }] : [],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: product.seoTitle || `${product.title} | SinTone`,
        description: product.seoDescription || product.description || `Buy ${product.title} at wholesale prices. Premium adult wellness products for global distribution.`,
        images: product.image ? [product.image.startsWith('http') ? product.image : `https://pub-e5d14c6d386c4d90979458082617517a.r2.dev/${product.image}`] : [],
      },
      alternates: {
        canonical: productSlug ? `/products/${productSlug}` : '/products',
      },
    };
  } catch (error) {
    return {
      title: 'Product Not Found | SinTone',
      description: 'The requested product could not be found.',
    };
  }
}

function ProductJsonLd({ product }: { product: Product }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.adult-toy-wholesale.com';
  const imageUrl = product.image
    ? (product.image.startsWith('http') ? product.image : `https://pub-e5d14c6d386c4d90979458082617517a.r2.dev/${product.image}`)
    : `${baseUrl}/placeholder-product.svg`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description?.replace(/###|\*\*/g, '') || product.shortDescription || '',
    image: imageUrl,
    sku: product.sku || product.productSkus?.[0]?.sku || undefined,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'SinTone',
    },
    ...(product.productSkus?.length ? {
      offers: product.productSkus.map((sku) => ({
        '@type': 'Offer',
        sku: sku.sku,
        price: product.currentPrice?.toString(),
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url: `${baseUrl}/products/${product.slug}`,
      })),
    } : {
      offers: {
        '@type': 'Offer',
        price: product.currentPrice?.toString(),
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url: `${baseUrl}/products/${product.slug}`,
      },
    }),
    ...(product.material ? { material: product.material } : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.adult-toy-wholesale.com';
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
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

  return <>
    {product && <ProductJsonLd product={product} />}
    {product && (
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: '/' },
          { name: 'Products', url: '/products' },
          { name: product.title, url: `/products/${productSlug}` },
        ]}
      />
    )}
    <ProductDetailClient initialProduct={product} error={error} productSlug={productSlug} />
  </>;
}
