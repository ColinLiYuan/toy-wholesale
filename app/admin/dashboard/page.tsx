'use client';

import Link from 'next/link';

const stats = [
  { name: '总产品数', value: '128', change: '+12%', icon: '📦' },
  { name: '活跃产品', value: '95', change: '+8%', icon: '✅' },
  { name: '博客文章', value: '42', change: '+5%', icon: '📝' },
  { name: '本月询盘', value: '156', change: '+23%', icon: '💬' },
];

const recentProducts = [
  { id: 1, name: 'The Muse', slug: 'the-muse', price: 69.00, status: 'ACTIVE', date: '2024-01-15' },
  { id: 2, name: 'The Slate', slug: 'the-slate', price: 89.00, status: 'ACTIVE', date: '2024-01-14' },
  { id: 3, name: 'The Rouge', slug: 'the-rouge', price: 79.00, status: 'DRAFT', date: '2024-01-13' },
];

const recentBlogs = [
  { id: 1, title: 'Top 10 Trending Adult Toys 2026', status: 'PUBLISHED', views: 1250, date: '2026-01-15' },
  { id: 2, title: 'How to Source Quality Adult Products', status: 'PUBLISHED', views: 890, date: '2026-01-12' },
  { id: 3, title: 'Wholesale vs Dropshipping Guide', status: 'DRAFT', views: 0, date: '2026-01-10' },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">仪表板</h1>
        <p className="text-gray-600 mt-1">欢迎来到 LuxeAdult 管理后台</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className="text-4xl">{stat.icon}</div>
            </div>
            <p className="text-sm text-green-600 mt-4">{stat.change} 较上月</p>
          </div>
        ))}
      </div>

      {/* 最近产品和博客 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 最近产品 */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">最近产品</h2>
            <Link href="/admin/products" className="text-sm text-[#0056B3] hover:underline">
              查看全部
            </Link>
          </div>
          <div className="divide-y divide-gray-200">
            {recentProducts.map((product) => (
              <div key={product.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.slug}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${product.price.toFixed(2)}</p>
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                      product.status === 'ACTIVE' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {product.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 最近博客 */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">最近博客</h2>
            <Link href="/admin/blog" className="text-sm text-[#0056B3] hover:underline">
              查看全部
            </Link>
          </div>
          <div className="divide-y divide-gray-200">
            {recentBlogs.map((blog) => (
              <div key={blog.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{blog.title}</h3>
                    <p className="text-sm text-gray-500">{blog.views} 次浏览</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                      blog.status === 'PUBLISHED' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {blog.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 快速操作 */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">快速操作</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/products/new"
            className="flex items-center justify-center px-6 py-4 bg-[#0056B3] text-white rounded-lg font-semibold hover:bg-[#004494] transition-colors"
          >
            <span className="mr-2">➕</span> 添加新产品
          </Link>
          <Link
            href="/admin/blog/new"
            className="flex items-center justify-center px-6 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <span className="mr-2">📝</span> 发布新文章
          </Link>
          <Link
            href="/admin/inquiries"
            className="flex items-center justify-center px-6 py-4 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            <span className="mr-2">💬</span> 管理询盘
          </Link>
        </div>
      </div>
    </div>
  );
}
