'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// 各站点的默认首页（第一个菜单页面）
const siteDefaultPages: Record<string, string> = {
  toy: '/admin/dashboard',
  myth: '/admin/blog',
  seric: '/admin/inquiries',
};

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // 从 localStorage 获取当前站点
    const savedSite = typeof window !== 'undefined' ? localStorage.getItem('admin_site_id') : null;
    // 根据站点获取默认首页，默认为 toy 的仪表板
    const defaultPage = siteDefaultPages[savedSite || 'toy'] || '/admin/dashboard';
    router.replace(defaultPage);
  }, [router]);

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#00F2FE] mx-auto mb-4"></div>
        <p className="text-gray-400">正在跳转...</p>
      </div>
    </div>
  );
}
