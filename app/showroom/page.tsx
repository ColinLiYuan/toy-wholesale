import type { Metadata } from 'next';
import ShowroomClient from './ShowroomClient';

export const metadata: Metadata = {
  title: 'Product Showroom — Real Video Demonstrations',
  description: 'Watch real product videos showcasing medical-grade silicone quality, texture details, and craftsmanship. See before you buy.',
  keywords: ['product videos', 'silicone toys demo', 'quality showcase', 'real product footage', 'adult toys showroom'],
  openGraph: {
    title: 'Product Showroom — Real Video Demonstrations | Silvibe',
    description: 'Watch authentic product videos showcasing premium quality',
    type: 'website',
    images: [
      {
        url: 'https://pub-e5d14c6d386c4d90979458082617517a.r2.dev/toy/home_product.jpg',
        width: 1200,
        height: 630,
        alt: 'Silvibe - Product Showroom',
      },
    ],
  },
  alternates: {
    canonical: '/showroom',
  },
};

export default function ShowroomPage() {
  return <ShowroomClient />;
}
