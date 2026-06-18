'use client';

import { useState, useRef } from 'react';
import type { ShowroomVideo } from '@/data/showroom-videos';
import { getVideoUrl } from '@/data/showroom-videos';

export default function VideoCard({ video }: { video: ShowroomVideo }) {
  const [hovered, setHovered] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleMouseEnter = () => {
    setHovered(true);
    const el = videoRef.current;
    if (el) {
      el.currentTime = 0;
      el.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setHovered(false);
    const el = videoRef.current;
    if (el) {
      el.pause();
      el.currentTime = 0;
    }
  };

  return (
    <div
      className="group relative bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative aspect-[3/4] bg-text-primary">
        {!videoError ? (
          <video
            ref={videoRef}
            src={getVideoUrl(video.filename)}
            className="w-full h-full object-cover"
            muted
            loop
            playsInline
            preload="metadata"
            onError={() => setVideoError(true)}
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

        <div className={`absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-300 ${hovered && !videoError ? 'opacity-0' : 'opacity-100'}`}>
          <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
            <svg className="w-8 h-8 text-brand ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {video.category && (
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-brand/90 text-white text-xs font-semibold rounded-full backdrop-blur-sm">
              {video.category}
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="text-lg font-bold text-text-primary mb-2 group-hover:text-brand transition-colors">
          {video.title}
        </h3>
        <div className="flex items-center space-x-2 text-sm text-text-secondary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Hover to play</span>
        </div>
      </div>
    </div>
  );
}
