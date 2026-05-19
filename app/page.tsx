import type { Metadata } from 'next';
import HomePageClient from '@/app/content/HomePageClient';

export const metadata: Metadata = {
  title: 'Wholesale Adult Toys | Premium Sex Toys Wholesale Supplier',
  description: 'Leading wholesale sex toys and adult toys wholesale supplier. Luxury sex toys wholesale prices from China factory. Low MOQ, OEM/ODM, FDA CE certified.',
  keywords: ['wholesale sex toys', 'adult toys wholesale', 'wholesale adult toys', 'luxury sex toys wholesale', 'sex toys wholesale supplier', 'adult wellness wholesale'],
  openGraph: {
    title: 'Silvibe - Certified Medical-Grade Silicone Toys',
    description: 'Premium medical-grade silicone adult toys for global wholesale distribution',
    type: 'website',
    siteName: 'Silvibe',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Silvibe',
    description: 'Medical-grade silicone adult toys. Low MOQ for global retailers.',
  },
};

export default function HomePage() {
  return <HomePageClient />;
}
