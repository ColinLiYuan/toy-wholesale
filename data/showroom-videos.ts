// Showroom 视频配置
// 按照这个格式添加你的视频文件名
// 视频文件需要上传到 R2: /showroom/ 目录下

export interface ShowroomVideo {
  id: string;
  filename: string; // 视频文件名，例如: 'video_001.mp4'
  title: string;    // 视频标题/描述
  category?: string; // 可选分类
}

export const showroomVideos: ShowroomVideo[] = [
  {
    id: '1',
    filename: 'toy/showroom/liquid-silicone-lsr-texture-real-shot.mp4',
    title: 'Liquid Silicone (LSR) Texture - Seamless & Ultra-Soft Finish 11.2KG',
    category: 'Silicone',
  },
  {
    id: '2',
    filename: 'toy/showroom/bulk-inventory-silicone-dildo-wholesale.mp4',
    title: 'Bulk Stock Ready for Global Wholesale',
    category: 'Massagers',
  },
  {
    id: '3',
    filename: 'toy/showroom/remote-control-vibrating-dildo-realistic-texture.mp4',
    title: 'Remote Control Vibrating Dildo - Realistic Texture & Multi-Tone Options',
    category: 'Vibrators',
  },
  {
    id: '4',
    filename: 'toy/showroom/life-size-butt-model-360-view.mp4',
    title: '360° Showroom: Life-size Realistic Butt with Dual Channels',
    category: 'Best Seller',
  },
  {
    id: '5',
    filename: 'toy/showroom/portable-realistic-tpe-stroker-squeeze-test.mp4',
    title: 'Portable Realistic Stroker - Ultra-Soft & High-Elasticity TPE',
    category: 'Pocket',
  },
  {
    id: '6',
    filename: 'toy/showroom/multi-tone-realistic-dildo-detail.mp4',
    title: 'Multi-Tone Realistic Dildo - Authentic Texture Test',
    category: 'Packaging',
  },
];

// 获取视频的完整 URL
export const getVideoUrl = (filename: string): string => {
  const baseUrl = process.env.NEXT_PUBLIC_R2_CDN_URL || 'https://pub-e5d14c6d386c4d90979458082617517a.r2.dev';
  return `${baseUrl}/${filename}`;
};
