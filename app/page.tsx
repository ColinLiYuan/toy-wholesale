import type { Metadata } from 'next';
import HomePageClient from '@/app/content/HomePageClient';

export const metadata: Metadata = {
  title: 'Silvibe - Medical-Grade Silicone Adult Toys Wholesale',
  description: 'Certified medical-grade silicone adult toys from Dongguan factory. Low MOQ for global retailers. FDA, CE, RoHS compliant with OEM/ODM services.',
  keywords: ['medical-grade silicone toys', 'adult toys wholesale', 'silicone vibrator bulk', 'FDA certified sex toys', 'OEM adult toys', 'low MOQ adult products'],
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
