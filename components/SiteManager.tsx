'use client';

import { useState, useEffect } from 'react';
import { getAllSites, getCurrentSite, switchToSite, SiteConfig } from '@/lib/site-service';

interface SiteManagerProps {
  className?: string;
}

export default function SiteManager({ className = '' }: SiteManagerProps) {
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

  const handleSiteChange = (newSiteId: string) => {
    setCurrentSite(newSiteId);
    const success = switchToSite(newSiteId);
    
    // 刷新页面以应用新的站点配置
    if (success) {
      window.location.reload();
    }
  };

  if (!isClient || availableSites.length === 0) {
    return null;
  }

  return (
    <div className={`p-4 bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <h3 className="text-lg font-medium text-gray-900 mb-4">站点管理</h3>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="site-manager" className="block text-sm font-medium text-gray-700 mb-2">
            当前站点
          </label>
          <select
            id="site-manager"
            value={currentSite}
            onChange={(e) => handleSiteChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {availableSites.map((site) => (
              <option key={site.id} value={site.id}>
                {site.label} ({site.id})
              </option>
            ))}
          </select>
        </div>
        
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">站点信息</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p><span className="font-medium">当前站点ID:</span> {currentSite}</p>
            <p><span className="font-medium">站点名称:</span> {availableSites.find(s => s.id === currentSite)?.label}</p>
            <p><span className="font-medium">管理后台:</span> {availableSites.find(s => s.id === currentSite)?.adminName}</p>
            <p><span className="font-medium">域名:</span> {availableSites.find(s => s.id === currentSite)?.domain || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}