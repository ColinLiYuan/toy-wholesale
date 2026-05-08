'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { adminService } from '@/services';
import { Admin } from '@/types';

export default function AdminsPage() {
  const [loading, setLoading] = useState(true);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchAdmins();
  }, [currentPage]);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const result = await adminService.getAdminList(currentPage, 10);
      setAdmins(result.content);
      setTotalElements(result.totalElements);
      setTotalPages(result.totalPages);
    } catch (error) {
      console.error('Failed to fetch admins:', error);
      setAdmins([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, username: string) => {
    if (!confirm(`确定要删除管理员 "${username}" 吗？此操作无法撤销。`)) {
      return;
    }

    try {
      await adminService.deleteAdmin(id);
      setAdmins(prev => prev.filter(a => a.id !== id));
      alert('删除成功');
    } catch (error) {
      alert('删除失败，请稍后重试');
    }
  };

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return '超级管理员';
      case 'ADMIN':
        return '管理员';
      case 'OPERATOR':
        return '操作员';
      default:
        return '未知';
    }
  };

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">超级管理员</span>;
      case 'ADMIN':
        return <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">管理员</span>;
      case 'OPERATOR':
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">操作员</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">未知</span>;
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">活跃</span>;
      case 'INACTIVE':
        return <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">停用</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">未知</span>;
    }
  };

  const filteredAdmins = admins.filter(admin => {
    const roleMatch = !roleFilter || admin.role === roleFilter;
    const statusMatch = !statusFilter || admin.status === statusFilter;
    return roleMatch && statusMatch;
  });

  const stats = {
    total: admins.length,
    superAdmin: admins.filter(a => a.role === 'SUPER_ADMIN').length,
    admin: admins.filter(a => a.role === 'ADMIN').length,
    operator: admins.filter(a => a.role === 'OPERATOR').length,
    active: admins.filter(a => a.status === 'ACTIVE').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">管理员管理</h1>
          <p className="text-gray-600 mt-1">管理系统管理员账户</p>
        </div>
        <Link
          href="/admin/admins/new"
          className="px-6 py-3 bg-[#00F2FE] text-[#050505] rounded-lg font-semibold hover:bg-[#00C4CC] transition-colors"
        >
          ➕ 添加管理员
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-600">总管理员数</p>
          <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-600">超级管理员</p>
          <p className="text-2xl font-bold text-red-600">{stats.superAdmin}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-600">管理员</p>
          <p className="text-2xl font-bold text-blue-600">{stats.admin}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-600">操作员</p>
          <p className="text-2xl font-bold text-green-600">{stats.operator}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <p className="text-sm text-gray-600">活跃状态</p>
          <p className="text-2xl font-bold text-teal-600">{stats.active}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">角色</label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
              >
                <option value="">所有角色</option>
                <option value="SUPER_ADMIN">超级管理员</option>
                <option value="ADMIN">管理员</option>
                <option value="OPERATOR">操作员</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">状态</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
              >
                <option value="">所有状态</option>
                <option value="ACTIVE">活跃</option>
                <option value="INACTIVE">停用</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00F2FE]"></div>
          </div>
        ) : filteredAdmins.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">没有找到匹配的管理员</p>
            <Link href="/admin/admins/new" className="text-[#00F2FE] hover:underline">
              添加第一个管理员
            </Link>
          </div>
        ) : (
          <>
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  共 {totalElements} 条记录
                </p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用户名</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">真实姓名</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">邮箱</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">角色</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">最后登录</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAdmins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900">{admin.username}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-900">{admin.realName || '-'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-blue-600">{admin.email || '-'}</p>
                      </td>
                      <td className="px-6 py-4">
                        {getRoleBadge(admin.role)}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(admin.status)}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-600">
                          {admin.lastLoginAt ? new Date(admin.lastLoginAt).toLocaleString() : '从未登录'}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/admins/${admin.id}`}
                            className="px-3 py-1.5 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            查看
                          </Link>
                          {admin.role !== 'SUPER_ADMIN' && (
                            <button
                              onClick={() => handleDelete(admin.id!, admin.username)}
                              className="px-3 py-1.5 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                            >
                              删除
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-center gap-4">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                >
                  上一页
                </button>
                <span className="text-sm text-gray-600">
                  第 {currentPage + 1} / {totalPages} 页
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                  disabled={currentPage >= totalPages - 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
                >
                  下一页
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
