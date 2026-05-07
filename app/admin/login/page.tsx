'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // TODO: 实现实际登录逻辑
      // const response = await loginService.login(email, password);
      // localStorage.setItem('admin-token', response.token);
      // router.push('/admin/dashboard');
      
      // 临时直接跳转（后续需要实现真实认证）
      setTimeout(() => {
        // 添加访问密钥参数到URL
        router.push('/admin/dashboard?admin_access_key=luxe-admin-2024-secret');
      }, 1000);
    } catch (err) {
      setError('邮箱或密码错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#0056B3]">LuxeAdult Admin</h1>
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
                邮箱地址
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#0056B3] focus:border-transparent"
                placeholder="admin@luxeadult.com"
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
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#0056B3] focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#0056B3] text-white rounded-lg font-bold hover:bg-[#004494] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '登录中...' : '登录'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            默认密码请联系系统管理员
          </p>
        </div>

        {/* 返回前台 */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-[#0056B3] hover:underline text-sm"
          >
            ← 返回网站前台
          </a>
        </div>
      </div>
    </div>
  );
}
