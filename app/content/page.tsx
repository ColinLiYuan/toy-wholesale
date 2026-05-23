import HomePageClient from './HomePageClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LuxeAdult Wholesale - Premium Adult Toys at Wholesale Prices',
  description: 'Global distributor of premium adult wellness products. Low MOQ, fast shipping, competitive wholesale prices for retailers and e-commerce businesses.',
  keywords: ['adult toys wholesale', 'sex toys distributor', 'wellness products bulk', 'adult products supplier', 'dropshipping adult toys', 'low MOQ adult toys'],
  openGraph: {
    title: 'LuxeAdult Wholesale - Premium Adult Toys Distributor',
    description: 'Premium adult wellness products for global wholesale distribution',
    type: 'website',
    siteName: 'LuxeAdult Wholesale',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LuxeAdult Wholesale',
    description: 'High-quality adult wellness products for wholesale markets',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/content',
  },
};

export default function Home() {
  return <HomePageClient />;
}
