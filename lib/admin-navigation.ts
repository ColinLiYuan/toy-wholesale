// 管理端导航：单一全局配置（对齐零售 retail-admin/lib/admin-navigation.ts）
// 每个菜单项可带 permission 权限点，侧边栏按登录响应下发的 permissions 过滤可见性；
// 未标注 permission 的菜单对所有登录用户可见。
// 权限点由后端 RBAC 播种（DataInitializer），格式 {module}:{action}，action ∈ view/create/edit/delete。

export interface NavItem {
  name: string;
  href: string;
  icon: string;
  permission?: string;
  children?: { name: string; href: string }[];
}

export const ADMIN_NAVIGATION: NavItem[] = [
  { name: '产品管理', href: '/admin/products', icon: '📦', permission: 'product:view' },
  { name: '询盘管理', href: '/admin/inquiries', icon: '📋', permission: 'inquiry:view' },
  { name: '潜客管理', href: '/admin/leads', icon: '👥', permission: 'lead:view' },
  { name: '供应商管理', href: '/admin/suppliers', icon: '🏭', permission: 'supplier:view' },
  { name: '经销商管理', href: '/admin/distributors', icon: '🏢', permission: 'distributor:view' },
  { name: '订单管理', href: '/admin/orders', icon: '🛒', permission: 'order:view' },
  { name: '报价单管理', href: '/admin/quotation', icon: '📄', permission: 'quotation:view' },
  {
    name: '支出管理',
    href: '/admin/expenses',
    icon: '💰',
    permission: 'finance:view',
    children: [
      { name: '采购成本', href: '/admin/expenses?type=PURCHASE' },
      { name: '销售费用', href: '/admin/expenses?type=SALES' },
      { name: '物流费用', href: '/admin/expenses?type=LOGISTICS' },
      { name: '管理费用', href: '/admin/expenses?type=ADMIN' },
      { name: '其他杂费', href: '/admin/expenses?type=OTHER' },
    ],
  },
  {
    name: '收入管理',
    href: '/admin/incomes',
    icon: '💵',
    permission: 'finance:view',
    children: [
      { name: '订单收款', href: '/admin/incomes?type=ORDER' },
    ],
  },
  { name: '博客管理', href: '/admin/blog', icon: '📝', permission: 'blog:view' },
  { name: '访问记录', href: '/admin/visit-records', icon: '🗒️', permission: 'visit_record:view' },
  { name: '运营账号', href: '/admin/operation-accounts', icon: '🌐', permission: 'operation_account:view' },
  { name: 'SEO关键字管理', href: '/admin/seo-keywords', icon: '🏷️', permission: 'seo_keyword:view' },
  {
    name: 'SEO 专题',
    href: '/admin/seo-knowledge',
    icon: '🔍',
    children: [
      { name: 'SEO 基础知识', href: '/admin/seo-knowledge/basics' },
      { name: '技术 SEO', href: '/admin/seo-knowledge/technical' },
      { name: '内容策略', href: '/admin/seo-knowledge/content' },
      { name: '数据分析', href: '/admin/seo-knowledge/analytics' },
      { name: '国际化 SEO', href: '/admin/seo-knowledge/international' },
    ],
  },
  {
    name: '外贸专题',
    href: '/admin/trade-knowledge',
    icon: '📚',
    children: [
      { name: '基础知识', href: '/admin/trade-knowledge/basics' },
      { name: '报价管理', href: '/admin/trade-knowledge/quotation' },
      { name: '跟单流程', href: '/admin/trade-knowledge/order-followup' },
      { name: '支付与风控', href: '/admin/trade-knowledge/payment-risk' },
      { name: '物流与通关', href: '/admin/trade-knowledge/logistics-customs' },
      { name: '产品认证', href: '/admin/trade-knowledge/certifications' },
      { name: '报价计算器', href: '/admin/quotation-calculator' },
    ],
  },
];

// 过滤导航（与零售 sidebar 同款语义）：
// permissions === undefined 表示旧会话或接口未返回权限 → 展示全部，避免升级期间菜单消失。
export function filterNavigation(permissions: string[] | undefined): NavItem[] {
  if (permissions === undefined) {
    return ADMIN_NAVIGATION;
  }
  return ADMIN_NAVIGATION.filter(
    (item) => item.permission === undefined || permissions.includes(item.permission)
  );
}
