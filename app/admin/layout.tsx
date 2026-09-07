'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { setSiteId } from '@/lib/api-client';
import { getCurrentSite } from '@/lib/site-service';
import { ADMIN_NAVIGATION, filterNavigation, NavItem } from '@/lib/admin-navigation';
import SiteSwitcher from '@/components/SiteSwitcher';

// 检查是否已登录
const checkAuth = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('admin_token');
    return !!token;
  }
  return false;
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
  const [currentSite, setCurrentSite] = useState('');
  // 导航为单一全局配置（lib/admin-navigation.ts），按登录下发的权限过滤，不再按站点硬编码
  const [navigation, setNavigation] = useState<NavItem[]>(ADMIN_NAVIGATION);

  // 标记客户端渲染，初始化站点
  useEffect(() => {
    setIsClient(true);

    // 从 localStorage 恢复站点选择（合法性由 api-client 的站点集合校验）
    const savedSite = localStorage.getItem('admin_site_id');
    if (savedSite) {
      setCurrentSite(savedSite);
      setSiteId(savedSite);
    }

    // 按 admin_info 里的 permissions 过滤菜单（对齐零售侧边栏）。
    // 旧会话没有该字段（undefined）→ 保持显示全部，避免升级期间菜单消失。
    try {
      const info = JSON.parse(localStorage.getItem('admin_info') || 'null');
      setNavigation(filterNavigation(info?.permissions));
    } catch {
      // 解析失败保持默认全部
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

  // 当路由变化时，自动展开包含当前页面的父菜单
  useEffect(() => {
    if (isClient && isAuthenticated && pathname !== '/admin/login') {
      const newExpandedMenus: Record<string, boolean> = {};

      navigation.forEach((item: NavItem) => {
        if (item.children && item.children.length > 0) {
          // 检查当前路径是否匹配任何子菜单
          const hasActiveChild = item.children.some((child: { name: string; href: string }) =>
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
  }, [pathname, isClient, isAuthenticated, navigation]);

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

  // 站点名称来自站点服务（后端 /api/v1/sites，失败回退兜底列表）
  const adminName = getCurrentSite().adminName || 'Admin';

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
              {adminName}
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
            {navigation.map((item: NavItem) => {
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
                      {(item.children || []).map((child: { name: string; href: string }) => {
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
                // 服务端作废 refresh token（尽力而为，失败不阻塞登出）
                const refreshToken = localStorage.getItem('admin_refresh_token');
                if (refreshToken) {
                  fetch('/api/v1/admin/logout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refreshToken }),
                  }).catch(() => {});
                }

                // 清除 localStorage
                localStorage.removeItem('admin_token');
                localStorage.removeItem('admin_refresh_token');
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
