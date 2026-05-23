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
  },
};

export default function ShowroomPage() {
  return <ShowroomClient />;
}
