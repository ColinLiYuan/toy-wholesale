/**
 * 站点切换服务
 * 用于管理多租户站点之间的切换
 *
 * 站点列表以后端公开接口 GET /api/v1/sites 为准（站点名称/后台名称/域名/启用状态），
 * 前端不再硬编码站点清单；后端不可用时回退到 FALLBACK_SITES 兜底，保证切换器仍可用。
 */

import apiClient, { setSiteId, getSiteId, registerSupportedSites } from './api-client';

export type SiteId = string;

export interface SiteConfig {
  id: SiteId;
  label: string;
  adminName: string;
  domain?: string;
}

// 平台不预埋任何站点：初始缓存为空，以后端 /v1/sites 返回为准；
// 后端不可用时保持空列表（切换器隐藏），不再回退任何业务站点
const FALLBACK_SITES: SiteConfig[] = [];

// 运行时站点缓存：初始为空，后端返回后覆盖
let siteCache: SiteConfig[] = FALLBACK_SITES;
let sitePromise: Promise<SiteConfig[]> | null = null;

/** 后端站点记录 → 前端 SiteConfig */
function mapSite(s: any): SiteConfig {
  return {
    id: s.code,
    label: s.name || s.code,
    adminName: s.adminName || `${s.name || s.code} Admin`,
    domain: s.domain || '',
  };
}

/**
 * 获取所有可用站点（后端 /v1/sites 公开接口；失败回退兜底列表）
 * 只显示启用站点；结果缓存在模块级，重复调用共享同一次请求
 */
export async function getAllSites(): Promise<SiteConfig[]> {
  if (!sitePromise) {
    sitePromise = (apiClient.get('/v1/sites') as Promise<{ code: number; data: any[] }>)
      .then((res) => {
        const list = res?.data;
        if (Array.isArray(list)) {
          // 后端返回即覆盖缓存（含空列表——平台新库无站点时不得回退兜底业务站点）
          const sites = list.filter((s: any) => s.status !== false).map(mapSite);
          siteCache = sites;
          // 同步 api-client 的合法站点集合（X-Site-Id 校验；空集合同样生效）
          registerSupportedSites(sites.map((s: SiteConfig) => s.id));
        }
        return siteCache;
      })
      .catch((e) => {
        // 仅在后端不可用时回退兜底列表，保证切换器不至于整个消失
        console.warn('[Site] 后端站点列表加载失败，使用兜底列表:', e?.message || e);
        return siteCache;
      });
  }
  return sitePromise;
}

/**
 * 获取当前站点配置（基于已加载的站点缓存；未加载完成时用兜底列表）。
 * 平台新库无站点时返回中性配置，不出现具体业务站点名称。
 */
export function getCurrentSite(): SiteConfig {
  const currentSiteId = getSiteId();
  const found = siteCache.find((s) => s.id === currentSiteId);
  if (found) {
    return found;
  }
  if (siteCache.length > 0) {
    return siteCache[0];
  }
  return { id: currentSiteId || 'default', label: 'Admin', adminName: 'Admin', domain: '' };
}

/**
 * 切换到指定站点
 */
export function switchToSite(siteId: SiteId): boolean {
  if (siteCache.some((s) => s.id === siteId)) {
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
 * 获取站点标签（基于缓存；未知站点返回编码本身）
 */
export function getSiteLabel(siteId: SiteId): string {
  return siteCache.find((s) => s.id === siteId)?.label || siteId;
}
