'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { setSiteId } from '@/lib/api-client';
import { getAllSites, getCurrentSite, switchToSite, SiteConfig } from '@/lib/site-service';
import SiteSwitcher from '@/components/SiteSwitcher';

// 检查是否已登录
const checkAuth = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_token');
    return !!token;
  }
  return false;
};

type MenuItem = {
  name: string;
  href: string;
  icon: string;
  children?: { name: string; href: string }[];
};

const siteConfig: Record<string, { label: string; adminName: string; menus: MenuItem[] }> = {
  toy: {
    label: 'SinTone',
    adminName: 'SinTone Admin',
    menus: [
      { name: '产品管理', href: '/admin/products', icon: '📦' },
      { name: '询盘管理', href: '/admin/inquiries', icon: '📋' },
      { name: '潜客管理', href: '/admin/leads', icon: '👥' },
      { name: '供应商管理', href: '/admin/suppliers', icon: '🏭' },
      { name: '经销商管理', href: '/admin/distributors', icon: '🏢' },
      { name: '订单管理', href: '/admin/orders', icon: '🛒' },
      { name: '报价单管理', href: '/admin/quotation', icon: '📄' },
      {
        name: '支出管理',
        href: '/admin/expenses',
        icon: '💰',
        children: [
          { name: '采购成本', href: '/admin/expenses?type=PURCHASE' },
          { name: '销售费用', href: '/admin/expenses?type=SALES' },
          { name: '物流费用', href: '/admin/expenses?type=LOGISTICS' },
        ],
      },
      { name: '收入管理', href: '/admin/incomes', icon: '💵' },
      { name: '博客管理', href: '/admin/blog', icon: '📝' },
    ],
  },
  myth: {
    label: 'Myth',
    adminName: 'Myth Admin',
    menus: [
      {
        name: '支出管理',
        href: '/admin/expenses',
        icon: '💰',
        children: [
          { name: '采购成本', href: '/admin/expenses?type=PURCHASE' },
          { name: '销售费用', href: '/admin/expenses?type=SALES' },
          { name: '物流费用', href: '/admin/expenses?type=LOGISTICS' },
        ],
      },
      { name: '收入管理', href: '/admin/incomes', icon: '💵' },
    ],
  },
  general: {
    label: '通用',
    adminName: '通用 Admin',
    menus: [
      {
        name: '支出管理',
        href: '/admin/expenses',
        icon: '💰',
        children: [
          { name: '管理费用', href: '/admin/expenses?type=ADMIN' },
          { name: '其他杂费', href: '/admin/expenses?type=OTHER' },
        ],
      },
      { name: '收入管理', href: '/admin/incomes', icon: '💵' },
      { name: '运营账号', href: '/admin/operation-accounts', icon: '🌐' },
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
      { name: 'SEO关键字管理', href: '/admin/seo-keywords', icon: '🏷️' },
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
    ],
  },
  seric: {
    label: 'Seric',
    adminName: 'Seric Admin',
    menus: [
      { name: '产品管理', href: '/admin/products', icon: '📦' },
      { name: '询盘管理', href: '/admin/inquiries', icon: '📋' },
      { name: '潜客管理', href: '/admin/leads', icon: '👥' },
      { name: '供应商管理', href: '/admin/suppliers', icon: '🏭' },
      { name: '访问记录', href: '/admin/visit-records', icon: '📋' },
      { name: '经销商管理', href: '/admin/distributors', icon: '🏢' },
      { name: '订单管理', href: '/admin/orders', icon: '🛒' },
      {
        name: '支出管理',
        href: '/admin/expenses',
        icon: '💰',
        children: [
          { name: '采购成本', href: '/admin/expenses?type=PURCHASE' },
          { name: '销售费用', href: '/admin/expenses?type=SALES' },
          { name: '物流费用', href: '/admin/expenses?type=LOGISTICS' },
        ],
      },
      { name: '收入管理', href: '/admin/incomes', icon: '💵' },
    ],
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // 跟踪哪些菜单项是展开的
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [currentSite, setCurrentSite] = useState('toy');
  const navigation = siteConfig[currentSite]?.menus || siteConfig.toy.menus;

  // 标记客户端渲染，初始化站点
  useEffect(() => {
    setIsClient(true);

    // 从 localStorage 恢复站点选择
    const savedSite = localStorage.getItem('admin_site_id');
    if (savedSite && siteConfig[savedSite]) {
      setCurrentSite(savedSite);
      setSiteId(savedSite);
    }

    // 排除登录页面
    if (pathname === '/admin/login') {
      setIsAuthenticated(true);
      return;
    }

    const isLoggedIn = checkAuth();
    setIsAuthenticated(isLoggedIn);

    if (!isLoggedIn) {
      router.push('/admin/login');
    }
  }, [pathname, router]);

  // 获取所有可用站点配置用于下拉菜单
  const availableSites = getAllSites();

  // 当路由变化时，自动展开包含当前页面的父菜单
  useEffect(() => {
    if (isClient && isAuthenticated && pathname !== '/admin/login') {
      const newExpandedMenus: Record<string, boolean> = {};
      
      navigation.forEach((item: any) => {
        if (item.children && item.children.length > 0) {
          // 检查当前路径是否匹配任何子菜单
          const hasActiveChild = item.children.some((child: any) => 
            pathname === child.href || pathname?.startsWith(child.href.split('#')[0])
          );
          
          if (hasActiveChild) {
            newExpandedMenus[item.name] = true;
          }
        }
      });
      
      // 只有当有新的菜单需要展开时才更新状态
      if (Object.keys(newExpandedMenus).length > 0) {
        setExpandedMenus(prev => ({
          ...prev,
          ...newExpandedMenus
        }));
      }
    }
  }, [pathname, isClient, isAuthenticated]);

  // 服务端渲染或客户端初始化期间，显示加载中
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto mb-4"></div>
          <p className="text-gray-600">正在验证身份...</p>
        </div>
      </div>
    );
  }

  // 如果未登录且不在登录页面，显示加载中
  if (pathname !== '/admin/login' && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto mb-4"></div>
          <p className="text-gray-600">正在跳转...</p>
        </div>
      </div>
    );
  }

  const toggleMenu = (name: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 侧边栏 */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 shadow-sm transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <Link href={navigation[0]?.href || '/admin/dashboard'} className="text-xl font-bold text-brand">
              {siteConfig[currentSite]?.adminName || 'Admin'}
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* 导航菜单 */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item: any) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href.split('#')[0]);
              const hasChildren = item.children && item.children.length > 0;
              const isExpanded = expandedMenus[item.name] || isActive;

              return (
                <div key={item.name}>
                  {/* 一级菜单项 */}
                  <div className="flex items-center">
                    <Link
                      href={item.href}
                      className={`flex-1 flex items-center px-4 py-3 rounded-lg transition-colors ${
                        isActive && !hasChildren
                          ? 'bg-brand text-white font-semibold'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <span className="text-xl mr-3">{item.icon}</span>
                      <span className="flex-1">{item.name}</span>
                    </Link>
                    {hasChildren && (
                      <button
                        onClick={() => toggleMenu(item.name)}
                        className={`p-2 rounded-lg hover:bg-gray-100 transition-transform ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      >
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* 子菜单 */}
                  {hasChildren && isExpanded && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.children.map((child: any) => {
                        const isChildActive = pathname === child.href || pathname?.startsWith(child.href.split('#')[0]);
                        return (
                          <Link
                            key={child.name}
                            href={child.href}
                            onClick={() => {
                              // 只在移动端关闭侧边栏
                              if (window.innerWidth < 1024) {
                                setSidebarOpen(false);
                              }
                            }}
                            className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                              isChildActive
                                ? 'bg-blue-50 text-blue-700 font-medium'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-2"></span>
                            {child.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* 底部 */}
          <div className="px-4 py-4 border-t border-gray-200">
            <Link
              href="/"
              className="flex items-center px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            >
              <span className="text-xl mr-3"></span>
              <span>返回前台</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* 主内容区 */}
      <div className="lg:ml-64">
        {/* 顶部栏 */}
        <header className="bg-white shadow-sm h-16 flex items-center px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden mr-4 text-gray-600 hover:text-gray-900"
          >
            ☰
          </button>
          <div className="flex-1"></div>
          <div className="flex items-center space-x-4">
            <SiteSwitcher />
            <span className="text-sm text-gray-600">管理员</span>
            <button
              onClick={async () => {
                // 清除 localStorage
                localStorage.removeItem('admin_token');
                localStorage.removeItem('admin_info');
                
                // 清除 cookie
                await fetch('/api/admin/logout', {
                  method: 'POST',
                });
                
                // 跳转到登录页
                router.push('/admin/login');
              }}
              className="text-sm text-red-500 hover:text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
            >
              登出
            </button>
            <div className="w-8 h-8 bg-brand rounded-full flex items-center justify-center text-white font-bold">
              A
            </div>
          </div>
        </header>

        {/* 内容 */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
