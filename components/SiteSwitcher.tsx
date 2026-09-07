'use client';

import { useState, useEffect } from 'react';
import { getAllSites, getCurrentSite, switchToSite, SiteConfig } from '@/lib/site-service';

interface SiteSwitcherProps {
  className?: string;
  onSiteChange?: (siteId: string) => void;
}

export default function SiteSwitcher({ className = '', onSiteChange }: SiteSwitcherProps) {
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
    
    if (success && onSiteChange) {
      onSiteChange(newSiteId);
    }
    
    // 刷新页面以应用新的站点配置
    if (success) {
      window.location.reload();
    }
  };

  // 站点数 ≤1 时隐藏切换器（对齐零售：只有一个站点的平台没必要切换）
  if (!isClient || availableSites.length <= 1) {
    return null;
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <label htmlFor="site-switcher" className="text-sm text-gray-600">
        站点:
      </label>
      <select
        id="site-switcher"
        value={currentSite}
        onChange={(e) => handleSiteChange(e.target.value)}
        className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer min-w-[120px]"
      >
        {availableSites.map((site) => (
          <option key={site.id} value={site.id}>
            {site.label}
          </option>
        ))}
      </select>
    </div>
  );
}