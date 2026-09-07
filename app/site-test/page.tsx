'use client';

import { useState, useEffect } from 'react';
import { getAllSites, getCurrentSite, switchToSite, SiteConfig } from '@/lib/site-service';
import SiteSwitcher from '@/components/SiteSwitcher';
import SiteManager from '@/components/SiteManager';

export default function SiteTestPage() {
  const [currentSite, setCurrentSite] = useState<string>('');
  const [availableSites, setAvailableSites] = useState<SiteConfig[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // 从后端获取所有可用站点（失败时站点服务自动回退兜底列表）
    getAllSites().then((sites) => {
      const current = getCurrentSite();
      setCurrentSite(current.id);
      setAvailableSites(sites);
    });
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">站点切换测试</h1>
          <p className="text-gray-600 mb-6">
            这是一个用于测试站点切换功能的页面。您可以在这里切换不同的站点并查看效果。
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-3">快速切换</h2>
              <SiteSwitcher />
            </div>
            
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-3">详细信息</h2>
              <div className="text-sm text-gray-600 space-y-1">
                <p><span className="font-medium">当前站点ID:</span> {currentSite}</p>
                <p><span className="font-medium">站点名称:</span> {availableSites.find(s => s.id === currentSite)?.label}</p>
                <p><span className="font-medium">管理后台:</span> {availableSites.find(s => s.id === currentSite)?.adminName}</p>
                <p><span className="font-medium">域名:</span> {availableSites.find(s => s.id === currentSite)?.domain || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">所有可用站点</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableSites.map((site) => (
              <div 
                key={site.id} 
                className={`border rounded-lg p-4 ${
                  site.id === currentSite 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h3 className="font-medium text-gray-900">{site.label}</h3>
                <p className="text-sm text-gray-600 mt-1">ID: {site.id}</p>
                <p className="text-sm text-gray-600">Admin: {site.adminName}</p>
                {site.domain && (
                  <p className="text-sm text-gray-600">Domain: {site.domain}</p>
                )}
                {site.id === currentSite && (
                  <span className="inline-block mt-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                    当前站点
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-6">
          <SiteManager />
        </div>
      </div>
    </div>
  );
}