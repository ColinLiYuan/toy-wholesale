'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { leadAdminService } from '@/services';
import type { Lead } from '@/types';
import { getSiteId } from '@/lib/api-client';
import CountrySelect from '@/components/CountrySelect';

export default function NewLeadPage() {
  const router = useRouter();

  // 获取当前站点
  const currentSite = typeof window !== 'undefined' ? getSiteId() : 'toy';

  // 所有潜客来源选项
  const allSourceOptions = [
    { value: 'WEBSITE', label: '网站询盘' },
    { value: 'EMAIL', label: '邮件开发' },
    { value: 'EXHIBITION', label: '展会' },
    { value: 'REFERRAL', label: '推荐' },
    { value: 'COLD_CALL', label: '电话开发' },
    { value: 'MYTH_TOY', label: 'MythToy' },
    { value: 'MADE_IN_CHINA', label: '中国制造网' },
    { value: 'INDEPENDENT_WEBSITE', label: '独立站' },
  ];

  // 根据站点筛选来源选项
  const sourceOptions = currentSite === 'seric'
    ? allSourceOptions.filter(option => ['MADE_IN_CHINA', 'REFERRAL', 'INDEPENDENT_WEBSITE'].includes(option.value))
    : allSourceOptions;

  const [formData, setFormData] = useState<Partial<Lead>>({
    status: 'NEW',
    priority: 'MEDIUM',
    source: currentSite === 'seric' ? 'MADE_IN_CHINA' : 'WEBSITE',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await leadAdminService.createLead(formData);
      alert('潜客创建成功');
      router.push('/admin/leads');
    } catch (error: any) {
      console.error('Failed to create lead:', error);
      
      // 提取错误信息
      let errorMessage = '创建失败';
      
      if (error.response?.data?.message) {
        // 后端返回的错误消息
        errorMessage = error.response.data.message;
      } else if (error.message) {
        // Axios 错误消息
        errorMessage = error.message;
      }
      
      alert(`创建失败：${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/leads" className="text-blue-600 hover:underline mb-2 inline-block">
            ← 返回潜客列表
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">添加新潜客</h1>
          <p className="text-gray-600 mt-1">填写潜在客户信息</p>
        </div>
      </div>

      {/* 表单 */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6">
        <div className="space-y-6">
          {/* 基本信息 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">基本信息</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">公司名称</label>
                <input
                  type="text"
                  value={formData.companyName || ''}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                  placeholder="请输入公司名称"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">联系人 *</label>
                <input
                  type="text"
                  required
                  value={formData.contactPerson || ''}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                  placeholder="请输入联系人姓名"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">职位</label>
                <input
                  type="text"
                  value={formData.position || ''}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                  placeholder="请输入职位"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">邮箱 *</label>
                <input
                  type="email"
                  required
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                  placeholder="请输入邮箱地址"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">电话</label>
                <input
                  type="text"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                  placeholder="请输入电话号码"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp/微信</label>
                <input
                  type="text"
                  value={formData.imAccount || ''}
                  onChange={(e) => setFormData({ ...formData, imAccount: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                  placeholder="请输入即时通讯账号"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">网站</label>
                <input
                  type="text"
                  value={formData.website || ''}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                  placeholder="请输入公司网站"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">状态</label>
                <select
                  value={formData.status || 'NEW'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                >
                  <option value="NEW">新线索</option>
                  <option value="CONTACTED">已联系</option>
                  <option value="INTERESTED">有意向</option>
                  <option value="QUOTED">已报价</option>
                  <option value="NEGOTIATING">谈判中</option>
                  <option value="CONVERTED">已成交</option>
                  <option value="INVALID">无效</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">优先级</label>
                <select
                  value={formData.priority || 'MEDIUM'}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                >
                  <option value="HIGH">高</option>
                  <option value="MEDIUM">中</option>
                  <option value="LOW">低</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">来源</label>
                <select
                  value={formData.source || ''}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                >
                  <option value="">请选择</option>
                  {sourceOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 地址信息 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">地址信息</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">国家</label>
                <CountrySelect
                  value={formData.country || ''}
                  onChange={(code) => setFormData({ ...formData, country: code })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">省份/州</label>
                <input
                  type="text"
                  value={formData.region || ''}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                  placeholder="请输入省份或州"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">城市</label>
                <input
                  type="text"
                  value={formData.city || ''}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                  placeholder="请输入城市"
                />
              </div>
            </div>
          </div>

          {/* 业务信息 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">业务信息</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">预计采购量</label>
                <input
                  type="number"
                  value={formData.estimatedQuantity || ''}
                  onChange={(e) => setFormData({ ...formData, estimatedQuantity: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                  placeholder="请输入预计采购数量"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">预算范围（USD）</label>
                <input
                  type="text"
                  value={formData.budgetRange || ''}
                  onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                  placeholder="例如：$5000-$10000"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">备注</label>
                <textarea
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
                  placeholder="请输入备注信息..."
                />
              </div>
            </div>
          </div>

          {/* 提交按钮 */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Link
              href="/admin/leads"
              className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
            >
              取消
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-[#00F2FE] text-[#050505] rounded-lg font-semibold hover:bg-[#00C4CC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '创建中...' : '创建潜客'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
