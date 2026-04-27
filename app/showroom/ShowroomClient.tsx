'use client';

import { useState, useRef } from 'react';
import { showroomVideos, getVideoUrl } from '@/data/showroom-videos';

export default function ShowroomClient() {
  const [hoveredVideoId, setHoveredVideoId] = useState<string | null>(null);
  const [videoErrors, setVideoErrors] = useState<{ [key: string]: boolean }>({});
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

  // 鼠标悬停时播放视频
  const handleMouseEnter = (videoId: string) => {
    setHoveredVideoId(videoId);
    const video = videoRefs.current[videoId];
    if (video) {
      video.currentTime = 0; // 从头开始播放
      video.play().catch(err => {
        console.log('Video autoplay prevented:', err);
      });
    }
  };

  // 鼠标离开时暂停视频
  const handleMouseLeave = (videoId: string) => {
    setHoveredVideoId(null);
    const video = videoRefs.current[videoId];
    if (video) {
      video.pause();
      video.currentTime = 0; // 重置到开头
    }
  };

  // 视频加载错误处理
  const handleVideoError = (videoId: string) => {
    console.error(`Failed to load video: ${videoId}`);
    setVideoErrors(prev => ({ ...prev, [videoId]: true }));
  };

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {showroomVideos.map((video) => (
              <div
                key={video.id}
                className="group relative bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300"
                onMouseEnter={() => handleMouseEnter(video.id)}
                onMouseLeave={() => handleMouseLeave(video.id)}
              >
                {/* Video Container */}
                <div className="relative aspect-[3/4] bg-[#1A1A1A]">
                  {!videoErrors[video.id] ? (
                    <video
                      ref={(el) => {
                        videoRefs.current[video.id] = el;
                      }}
                      src={getVideoUrl(video.filename)}
                      className="w-full h-full object-cover"
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      onError={() => handleVideoError(video.id)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800 text-white">
                      <div className="text-center p-4">
                        <svg className="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm">Video unavailable</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Play Icon Overlay (shown when not hovering) */}
                  <div
                    className={`absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-300 ${
                      hoveredVideoId === video.id && !videoErrors[video.id] ? 'opacity-0' : 'opacity-100'
                    }`}
                  >
                    <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-[#0056B3] ml-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>

                  {/* Category Badge */}
                  {video.category && (
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-[#0056B3]/90 text-white text-xs font-semibold rounded-full backdrop-blur-sm">
                        {video.category}
                      </span>
                    </div>
                  )}
                </div>

                {/* Video Info */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-[#1A1A1A] mb-2 group-hover:text-[#0056B3] transition-colors">
                    {video.title}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-[#6C757D]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Hover to play</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {showroomVideos.length === 0 && (
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
