// 站点页面权限控制 - 默认无权限，需显式配置
// key: {siteId}.{page}.{action}

type PagePermissions = Record<string, string[]>;

const permissions: Record<string, PagePermissions> = {
  // toy 站点
  toy: {
    products: ['create', 'edit', 'delete', 'toggle_status'],
    inquiries: ['create', 'edit', 'delete', 'toggle_status'],
    leads: ['create', 'edit', 'delete', 'toggle_status'],
    suppliers: ['create', 'edit'],
    'visit-records': ['create', 'edit', 'delete'],
    distributors: ['create', 'edit'],
    orders: ['create', 'edit', 'delete', 'toggle_status'],
    quotation: ['create', 'edit', 'delete', 'export'],
    admins: ['create', 'edit', 'delete'],
    blog: ['create', 'edit', 'delete'],
  },
  // seric 站点
  seric: {
    products: ['create', 'edit'],
    inquiries: ['create', 'edit'],
    leads: ['create', 'edit'],
    suppliers: ['create', 'edit'],
    'visit-records': ['create'],
    distributors: ['create', 'edit'],
    orders: ['create', 'edit'],
  },
  // general 站点
  general: {
    expenses: ['create', 'edit', 'delete'],
    incomes: ['create', 'edit', 'delete'],
    'operation-accounts': ['create', 'edit', 'delete'],
    'seo-keywords': ['create', 'edit', 'delete'],
  },
};

export function siteCan(page: string, action: string): boolean {
  if (typeof window === 'undefined') return false;
  const siteId = localStorage.getItem('admin_site_id') || 'toy';
  const pagePerms = permissions[siteId];
  if (!pagePerms) return false;
  const actions = pagePerms[page];
  if (!actions) return false;
  return actions.includes(action);
}
