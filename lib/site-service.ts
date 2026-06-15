/**
 * 站点切换服务
 * 用于管理多租户站点之间的切换
 */

import { setSiteId, getSiteId } from './api-client';

export type SiteId = 'toy' | 'myth' | string;

export interface SiteConfig {
  id: SiteId;
  label: string;
  adminName: string;
  domain?: string;
}

// 站点配置
const SITE_CONFIGS: Record<SiteId, SiteConfig> = {
  toy: {
    id: 'toy',
    label: 'LuxeAdult (Toy)',
    adminName: 'LuxeAdult Admin',
    domain: 'www.luxeadult.com'
  },
  myth: {
    id: 'myth',
    label: 'MythToy',
    adminName: 'MythToy Admin',
    domain: 'www.mythtoy.com'
  },
  seric: {
    id: 'seric',
    label: 'Seric',
    adminName: 'Seric Admin',
    domain: 'www.seric.com'
  },
  general: {
    id: 'general',
    label: '通用',
    adminName: '通用 Admin',
    domain: ''
  }
};

/**
 * 获取所有可用站点配置
 */
export function getAllSites(): SiteConfig[] {
  return Object.values(SITE_CONFIGS);
}

/**
 * 获取当前站点配置
 */
export function getCurrentSite(): SiteConfig {
  const currentSiteId = getSiteId();
  return SITE_CONFIGS[currentSiteId] || SITE_CONFIGS.toy; // 默认返回 toy 站点
}

/**
 * 切换到指定站点
 */
export function switchToSite(siteId: SiteId): boolean {
  if (SITE_CONFIGS[siteId]) {
    setSiteId(siteId);
    // 保存到 localStorage 以便下次访问时恢复
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin_site_id', siteId);
    }
    return true;
  }
  console.warn(`Site ID "${siteId}" is not configured`);
  return false;
}

/**
 * 添加新站点配置
 * 注意：这仅在运行时添加，不会持久化
 */
export function addSiteConfig(config: SiteConfig) {
  SITE_CONFIGS[config.id] = config;
}

/**
 * 检查站点是否存在
 */
export function isValidSite(siteId: SiteId): boolean {
  return !!SITE_CONFIGS[siteId];
}

/**
 * 获取站点标签
 */
export function getSiteLabel(siteId: SiteId): string {
  return SITE_CONFIGS[siteId]?.label || siteId.toString();
}