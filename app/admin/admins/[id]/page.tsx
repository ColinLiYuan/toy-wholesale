'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { adminService } from '@/services';
import { Admin } from '@/types';

export default function AdminDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formData, setFormData] = useState<Partial<Admin>>({});

  useEffect(() => {
    fetchAdmin();
  }, [params.id]);

  const fetchAdmin = async () => {
    setLoading(true);
    try {
      const result = await adminService.getAdminById(parseInt(params.id!));
      setAdmin(result);
      setFormData(result);
    } catch (error) {
      console.error('Failed to fetch admin:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await adminService.updateAdmin(admin!.id!, formData);
      setAdmin(formData as Admin);
      setIsEditing(false);
      alert('更新成功');
    } catch (error) {
      alert('更新失败，请稍后重试');
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      alert('两次输入的密码不一致');
      return;
    }
    if (newPassword.length < 6) {
      alert('密码长度至少为6位');
      return;
    }

    try {
      await adminService.resetPassword(admin!.id!, newPassword);
      alert('密码重置成功');
      setShowResetPassword(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      alert('密码重置失败，请稍后重试');
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
        return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">超级管理员</span>;
      case 'ADMIN':
        return <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">管理员</span>;
      case 'OPERATOR':
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">操作员</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">未知</span>;
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">活跃</span>;
      case 'INACTIVE':
        return <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">停用</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">未知</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00F2FE]"></div>
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">管理员不存在</p>
        <Link href="/admin/admins" className="text-[#00F2FE] hover:underline mt-4 inline-block">
          返回管理员列表
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{admin.username}</h1>
          <p className="text-gray-600 mt-1">管理员详情</p>
        </div>
        <div className="flex items-center gap-4">
          {isEditing ? (
            <>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setFormData(admin);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-[#00F2FE] text-[#050505] rounded-lg font-semibold hover:bg-[#00C4CC] transition-colors"
              >
                保存
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setShowResetPassword(true)}
                className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors"
              >
                重置密码
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-[#00F2FE] text-[#050505] rounded-lg font-semibold hover:bg-[#00C4CC] transition-colors"
              >
                编辑
              </button>
              <Link
                href="/admin/admins"
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                返回列表
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">基本信息</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">用户名</label>
                  <p className="text-gray-900 font-semibold">{admin.username}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">角色</label>
                  {isEditing ? (
                    <select
                      name="role"
                      value={formData.role || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                    >
                      <option value="">请选择</option>
                      <option value="SUPER_ADMIN">超级管理员</option>
                      <option value="ADMIN">管理员</option>
                      <option value="OPERATOR">操作员</option>
                    </select>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900">{getRoleLabel(admin.role)}</span>
                      {getRoleBadge(admin.role)}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">真实姓名</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="realName"
                      value={formData.realName || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                      placeholder="请输入真实姓名"
                    />
                  ) : (
                    <p className="text-gray-900">{admin.realName || '-'}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
                  {isEditing ? (
                    <select
                      name="status"
                      value={formData.status || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                    >
                      <option value="ACTIVE">活跃</option>
                      <option value="INACTIVE">停用</option>
                    </select>
                  ) : (
                    getStatusBadge(admin.status)
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">电子邮箱</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                    placeholder="请输入电子邮箱"
                  />
                ) : (
                  <p className="text-blue-600">{admin.email || '-'}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
                {isEditing ? (
                  <textarea
                    name="remark"
                    value={formData.remark || ''}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                    placeholder="请输入备注信息"
                  />
                ) : (
                  <p className="text-gray-900">{admin.remark || '-'}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">登录信息</h2>
            <div className="space-y-4">
              {admin.lastLoginAt && (
                <div className="flex items-center justify-between py-4 border-t border-gray-200">
                  <span className="text-gray-600">最后登录时间</span>
                  <span className="text-gray-900">{new Date(admin.lastLoginAt).toLocaleString()}</span>
                </div>
              )}
              <div className="flex items-center justify-between py-4 border-t border-gray-200">
                <span className="text-gray-600">登录失败次数</span>
                <span className="text-gray-900">{admin.loginFailCount || 0}</span>
              </div>
              {admin.lockedUntil && (
                <div className="flex items-center justify-between py-4 border-t border-gray-200">
                  <span className="text-gray-600">锁定时间</span>
                  <span className="text-red-600">{new Date(admin.lockedUntil).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">快捷操作</h2>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/admin/admins')}
                className="w-full px-4 py-2 text-left border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                返回管理员列表
              </button>
              <Link
                href="/admin/admins/new"
                className="block w-full px-4 py-2 text-center bg-[#00F2FE] text-[#050505] rounded-lg font-semibold hover:bg-[#00C4CC] transition-colors"
              >
                添加新管理员
              </Link>
            </div>
          </div>
        </div>
      </div>

      {showResetPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">重置密码</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">新密码</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                  placeholder="请输入新密码"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">确认密码</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                  placeholder="请再次输入密码"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-4 mt-6">
              <button
                onClick={() => {
                  setShowResetPassword(false);
                  setNewPassword('');
                  setConfirmPassword('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleResetPassword}
                className="px-4 py-2 bg-[#00F2FE] text-[#050505] rounded-lg font-semibold hover:bg-[#00C4CC] transition-colors"
              >
                确认重置
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
