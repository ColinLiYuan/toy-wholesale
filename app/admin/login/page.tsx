'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminService } from '@/services';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');

  // 显示调试信息
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('admin_token');
      setDebugInfo(`LocalStorage admin_token: ${token ? '存在' : '不存在'}`);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. 调用后端 API 获取 token
      const response = await adminService.login(username, password);
      
      if (!response.token) {
        throw new Error('未获取到认证令牌');
      }
      
      // 2. 设置 localStorage
      localStorage.setItem('admin_token', response.token);
      if (response.refreshToken) {
        localStorage.setItem('admin_refresh_token', response.refreshToken);
      }
      if (response.admin) {
        // 存储完整登录信息（含 RBAC 能力），管理端侧边栏按 permissions 过滤菜单
        localStorage.setItem('admin_info', JSON.stringify({
          ...response.admin,
          permissions: response.permissions,
          boundSiteIds: response.boundSiteIds,
          hasGlobalBinding: response.hasGlobalBinding,
        }));
      }
      
      // 3. 设置 cookie
      const cookieResponse = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: response.token }),
      });
      
      
      if (!cookieResponse.ok) {
        const errorData = await cookieResponse.json().catch(() => ({}));
        throw new Error(errorData.error || '设置认证信息失败');
      }
      
      // 4. 验证 cookie 是否设置成功
      
      // 5. 跳转到仪表板
      router.push('/admin/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      
      // 使用拦截器设置的友好提示信息
      const errorMessage = err.userMessage || err.message || '登录失败，请检查用户名和密码';
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand">SinTone Admin</h1>
          <p className="text-gray-600 mt-2">管理后台登录</p>
        </div>

        {/* 登录表单 */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                用户名
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-brand focus:border-transparent"
                placeholder="admin"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                密码
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-brand focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-brand text-white rounded-lg font-bold hover:bg-brand-hover transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '登录中...' : '登录'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            默认密码请联系系统管理员
          </p>
        </div>

        {/* 调试信息 */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-xs text-gray-600 mb-2 font-mono">调试信息:</p>
            <p className="text-xs text-gray-500 font-mono">{debugInfo}</p>
            <button
              onClick={() => {
                localStorage.removeItem('admin_token');
                localStorage.removeItem('admin_refresh_token');
                localStorage.removeItem('admin_info');
                setDebugInfo('LocalStorage 已清除');
              }}
              className="mt-2 text-xs text-red-500 hover:text-red-700 underline"
            >
              清除本地存储
            </button>
          </div>
        )}

        {/* 返回前台 */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-brand hover:underline text-sm"
          >
            ← 返回网站前台
          </a>
        </div>
      </div>
    </div>
  );
}
