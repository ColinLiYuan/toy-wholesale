'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    // 直接跳转到仪表板（不需要登录）
    router.replace('/admin/dashboard');
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
