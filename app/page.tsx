import type { Metadata } from 'next';
import HomePageClient from '@/app/content/HomePageClient';
import { productService } from '@/services';
import type { Product } from '@/types';

export const metadata: Metadata = {
  title: 'Premium Adult Toys Wholesale | Medical-Grade Supplier',
  description: 'Leading wholesale sex toys and adult toys supplier. Medical-grade silicone, low MOQ from 20 pcs, OEM/ODM, FDA/CE certified. Direct from Dongguan factory.',
  keywords: ['wholesale sex toys', 'adult toys wholesale', 'wholesale adult toys', 'medical-grade silicone toys', 'sex toys wholesale supplier'],
  openGraph: {
    title: 'Silvibe — Medical-Grade Silicone Adult Toys Wholesale',
    description: 'Premium medical-grade silicone adult toys for global wholesale distribution. Low MOQ, OEM/ODM available.',
    type: 'website',
    siteName: 'Silvibe',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Silvibe — Medical-Grade Adult Toys Wholesale',
    description: 'Medical-grade silicone adult toys from Dongguan. Low MOQ for global retailers.',
  },
  alternates: {
    canonical: '/',
  },
};

export default async function HomePage() {
  let featuredProducts: Product[] = [];
  try {
    featuredProducts = await productService.getFeaturedProducts('首页推荐', 6);
  } catch (error) {
    console.error('Failed to fetch featured products for homepage:', error);
  }

  return <HomePageClient initialFeaturedProducts={featuredProducts} />;
}
