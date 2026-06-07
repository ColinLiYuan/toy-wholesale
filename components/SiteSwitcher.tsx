'use client';

import { useState, useEffect } from 'react';
import { getAllSites, getCurrentSite, switchToSite, SiteConfig } from '@/lib/site-service';

interface SiteSwitcherProps {
  className?: string;
  onSiteChange?: (siteId: string) => void;
}

export default function SiteSwitcher({ className = '', onSiteChange }: SiteSwitcherProps) {
  const [currentSite, setCurrentSite] = useState<string>('toy');
  const [availableSites, setAvailableSites] = useState<SiteConfig[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // 获取当前站点和所有可用站点
    const current = getCurrentSite();
    const sites = getAllSites();
    
    setCurrentSite(current.id);
    setAvailableSites(sites);
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

  if (!isClient || availableSites.length === 0) {
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