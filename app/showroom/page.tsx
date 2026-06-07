import type { Metadata } from 'next';
import { showroomVideos } from '@/data/showroom-videos';
import VideoCard from './VideoCard';

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
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 px-6 bg-[#F8F9FA] border-b border-gray-200">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-[#1A1A1A]">
            Product Showroom
          </h1>
          <p className="text-xl text-[#6C757D] max-w-3xl mx-auto">
            Real product videos showcasing medical-grade silicone quality, texture details, and craftsmanship. Hover to play.
          </p>
        </div>
      </section>

      {/* Video Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {showroomVideos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {showroomVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <svg className="w-24 h-24 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">No Videos Yet</h3>
              <p className="text-[#6C757D]">Check back soon for product demonstration videos</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-[#F8F9FA] border-t border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A1A] mb-6">
            Want to See More?
          </h2>
          <p className="text-xl text-[#6C757D] mb-10">
            Request custom product videos or schedule a live video call with our team
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-[#0056B3] text-white font-semibold text-lg hover:bg-[#004494] transition-all shadow-sm"
            >
              Request Custom Videos
              <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
            <a
              href="/products"
              className="inline-flex items-center justify-center px-8 py-4 rounded-lg border-2 border-[#1A1A1A] text-[#1A1A1A] font-semibold text-lg hover:bg-[#1A1A1A] hover:text-white transition-all"
            >
              Browse Products
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
