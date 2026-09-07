// 商品分类（后端驱动）：分类由商户在管理端「分类管理」中自行配置，
// 本文件不再内置任何分类数据（平台原则：无兜底业务数据）。
// 后端未配置分类时返回空树，前台分类区为空。
import { BACKEND_BASE_URL } from '@/lib/api-config';

export interface CategoryItem {
  name: string;       // 中文名（管理端展示）
  nameEn: string;     // 英文名（前台展示）
  slug: string;
  priority?: number;
  coverImage?: string;
  description?: string;
  children?: CategoryItem[];
}

// 简易模块级缓存（仅客户端生效）：避免同一页面多个组件重复请求
const treeCache: Record<string, { tree: CategoryItem[]; at: number }> = {};
const CACHE_TTL = 30 * 1000;

function resolveSiteId(siteId?: string): string {
  if (siteId) return siteId;
  // 公共前台站点由部署配置决定（NEXT_PUBLIC_SITE_ID）
  return process.env.NEXT_PUBLIC_SITE_ID || '';
}

/**
 * 拉取站点分类树：GET /api/v1/categories/tree（公开接口，仅返回启用中的 CATEGORY）
 * 服务端组件（SSR）与客户端组件均可调用；失败/空 → []
 */
export async function fetchSiteCategories(siteId?: string): Promise<CategoryItem[]> {
  const sid = resolveSiteId(siteId);
  const cacheKey = sid || '__default__';

  // 客户端复用短缓存，服务端每次都取（配合 Next fetch revalidate）
  if (typeof window !== 'undefined') {
    const cached = treeCache[cacheKey];
    if (cached && Date.now() - cached.at < CACHE_TTL) {
      return cached.tree;
    }
  }

  try {
    const headers: Record<string, string> = sid ? { 'X-Site-Id': sid } : {};
    const res = await fetch(`${BACKEND_BASE_URL}/api/v1/categories/tree`, {
      headers,
      ...(typeof window === 'undefined' ? { next: { revalidate: 60 } } : {}),
    });
    if (!res.ok) return [];
    const body = await res.json();
    const tree: CategoryItem[] =
      body?.code === 200 && Array.isArray(body?.data) ? body.data : [];
    treeCache[cacheKey] = { tree, at: Date.now() };
    return tree;
  } catch (error) {
    console.error('获取分类树失败:', error);
    return [];
  }
}

// 兼容旧调用方（内嵌 /admin 的 CategorySelector，后期随内嵌后台删除）
export async function getSiteCategories(siteId?: string): Promise<CategoryItem[]> {
  return fetchSiteCategories(siteId);
}

// 辅助函数：获取父分类（对传入树操作）
export const getParentCategory = (childSlug: string, tree: CategoryItem[]): CategoryItem | undefined => {
  for (const category of tree) {
    if (category.children?.some(child => child.slug === childSlug)) return category;
    for (const child of category.children || []) {
      if (child.children?.some(gc => gc.slug === childSlug)) return child;
    }
  }
  return undefined;
};

// 辅助函数：根据 slug 查找分类（对传入树操作）
export const findCategoryBySlug = (slug: string, tree: CategoryItem[]): CategoryItem | undefined => {
  for (const category of tree) {
    if (category.slug === slug) return category;
    if (category.children) {
      for (const child of category.children) {
        if (child.slug === slug) return child;
        if (child.children) {
          const grandchild = child.children.find(c => c.slug === slug);
          if (grandchild) return grandchild;
        }
      }
    }
  }
  return undefined;
};

// 辅助函数：获取所有叶子节点（对传入树操作）
export const getLeafCategories = (tree: CategoryItem[]): CategoryItem[] => {
  const leaves: CategoryItem[] = [];
  const collect = (items: CategoryItem[]) => {
    items.forEach(item => {
      if (!item.children || item.children.length === 0) leaves.push(item);
      else collect(item.children);
    });
  };
  collect(tree);
  return leaves;
};
