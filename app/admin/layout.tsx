'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// 定义导航菜单，支持子菜单
const navigation = [
  { name: '仪表板', href: '/admin/dashboard', icon: '📊' },
  { name: '产品管理', href: '/admin/products', icon: '📦' },
  { name: '潜客管理', href: '/admin/leads', icon: '👥' },
  { name: '博客管理', href: '/admin/blog', icon: '📝' },
  { name: '运营账号', href: '/admin/operation-accounts', icon: '🌐' },
  { name: '报价计算器', href: '/admin/quotation-calculator', icon: '💰' },
  {
    name: '外贸知识库',
    href: '/admin/trade-knowledge',
    icon: '📚',
    children: [
      { name: '基础知识', href: '/admin/trade-knowledge/basics' },
      { name: '报价管理', href: '/admin/trade-knowledge/quotation' },
      { name: '跟单流程', href: '/admin/trade-knowledge/order-followup' },
      { name: '支付与风控', href: '/admin/trade-knowledge/payment-risk' },
      { name: '物流与通关', href: '/admin/trade-knowledge/logistics-customs' },
      { name: '产品认证', href: '/admin/trade-knowledge/certifications' },
    ],
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // 跟踪哪些菜单项是展开的
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

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
            <Link href="/admin/dashboard" className="text-xl font-bold text-[#0056B3]">
              LuxeAdult Admin
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
                          ? 'bg-[#0056B3] text-white font-semibold'
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
                            onClick={() => setSidebarOpen(false)}
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
            <span className="text-sm text-gray-600">管理员</span>
            <div className="w-8 h-8 bg-[#0056B3] rounded-full flex items-center justify-center text-white font-bold">
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
