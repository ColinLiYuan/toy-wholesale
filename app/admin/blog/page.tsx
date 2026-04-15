'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { blogAdminService } from '@/services';
import { BlogPost } from '@/types';

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  // 加载博客列表
  useEffect(() => {
    loadBlogs();
  }, [currentPage]);

  const loadBlogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await blogAdminService.getAllBlogs(currentPage, pageSize);
      setBlogs(data.content || []);
      setTotalPages(data.totalPages || 1);
      console.log('Loaded blogs:', data.content?.length, 'items');
    } catch (err: any) {
      const errorMsg = err.message || '加载博客列表失败';
      setError(errorMsg);
      console.error('Failed to load blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除此文章吗？')) return;
    try {
      await blogAdminService.deleteBlog(id);
      await loadBlogs();
      alert('删除成功！');
    } catch (error) {
      console.error('Delete failed:', error);
      alert('删除失败');
    }
  };

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase());
    let matchesStatus = true;
    if (statusFilter === 'PUBLISHED') {
      matchesStatus = blog.isPublished === true;
    } else if (statusFilter === 'DRAFT') {
      matchesStatus = blog.isPublished === false;
    }
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">博客管理</h1>
          <p className="text-gray-600 mt-1">管理所有博客文章</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          ➕ 发布新文章
        </Link>
      </div>

      {/* 筛选和搜索 */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">搜索文章</label>
            <input
              type="text"
              placeholder="搜索文章标题..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">状态筛选</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              <option value="ALL">所有状态</option>
              <option value="PUBLISHED">已发布</option>
              <option value="DRAFT">草稿</option>
            </select>
          </div>
          <div className="flex items-end">
            <p className="text-sm text-gray-600">
              共 {filteredBlogs.length} 篇文章
            </p>
          </div>
        </div>
      </div>

      {/* 博客列表 */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">加载中...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-2">加载失败</p>
            <p className="text-gray-500 text-sm mb-4">{error}</p>
            <button
              onClick={loadBlogs}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              重试
            </button>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">暂无博客文章</p>
            <Link
              href="/admin/blog/new"
              className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              发布第一篇文章
            </Link>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">文章标题</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">分类</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">状态</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">浏览量</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">发布时间</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredBlogs.map((blog) => (
                    <tr key={blog.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">{blog.title}</h3>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-1">{blog.excerpt}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-800 font-medium">
                          {blog.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 text-xs rounded-full font-medium ${
                          blog.isPublished 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {blog.isPublished ? '已发布' : '草稿'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{blog.viewCount || 0}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/admin/blog/${blog.id}`}
                            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                          >
                            编辑
                          </Link>
                          <button
                            onClick={() => handleDelete(blog.id)}
                            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                          >
                            删除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 分页 */}
            {totalPages > 1 && (
              <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  第 {currentPage + 1} 页，共 {totalPages} 页
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                    disabled={currentPage === 0}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    上一页
                  </button>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                    disabled={currentPage >= totalPages - 1}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    下一页
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
