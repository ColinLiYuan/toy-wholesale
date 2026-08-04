'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { inquiryAdminService } from '@/services';
import type { Inquiry } from '@/types';
import CountrySelect from '@/components/CountrySelect';

const sourceOptions = [
  { value: 'WEBSITE_FORM', label: '网站表单' },
  { value: 'EMAIL', label: '邮件' },
  { value: 'ALIBABA', label: '阿里巴巴' },
  { value: 'WHATSAPP', label: 'WhatsApp' },
  { value: 'TRADE_SHOW', label: '展会' },
  { value: 'MYTH_TOY', label: 'MythToy转移' },
  { value: 'MADE_IN_CHINA', label: '中国制造网' },
  { value: 'INDEPENDENT_WEBSITE', label: '独立站' },
  { value: 'OTHER', label: '其他' },
];

export default function EditInquiryPage() {
  const router = useRouter();
  const params = useParams();
  const inquiryId = Number(params.id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    companyName: '',
    country: '',
    source: '',
    message: '',
    assignedTo: '',
  });

  useEffect(() => {
    loadInquiry();
  }, [inquiryId]);

  const loadInquiry = async () => {
    try {
      setLoading(true);
      const data = await inquiryAdminService.getInquiryById(inquiryId);
      setFormData({
        customerName: data.customerName || data.name || '',
        customerEmail: data.customerEmail || data.email || '',
        customerPhone: data.customerPhone || data.phone || '',
        companyName: data.companyName || data.company || '',
        country: data.country || '',
        source: data.source || '',
        message: data.message || '',
        assignedTo: data.assignedTo || '',
      });
    } catch (error) {
      console.error('获取询盘详情失败:', error);
      alert('获取询盘详情失败');
      router.push('/admin/inquiries');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await inquiryAdminService.updateInquiry(inquiryId, formData);
      alert('询盘信息已更新');
      router.push('/admin/inquiries');
    } catch (error: any) {
      console.error('更新询盘失败:', error);
      alert('更新失败: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-gray-500">
        加载中...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">编辑询盘</h1>
        <Link href={`/admin/inquiries/${inquiryId}`} className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
          返回详情
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">客户信息</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">客户姓名</label>
              <input type="text" value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
              <input type="email" value={formData.customerEmail}
                onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">电话</label>
              <input type="text" value={formData.customerPhone}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">公司</label>
              <input type="text" value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">国家</label>
              <CountrySelect value={formData.country}
                onChange={(code) => setFormData({ ...formData, country: code })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">来源</label>
              <select value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option value="">-- 选择来源 --</option>
                {sourceOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">负责人</label>
              <input type="text" value={formData.assignedTo}
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">留言内容</h2>
          <textarea value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            placeholder="客户原始留言" />
        </div>

        <div className="flex items-center justify-end gap-3">
          <Link href={`/admin/inquiries/${inquiryId}`} className="px-6 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
            取消
          </Link>
          <button type="submit" disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">
            {saving ? '保存中...' : '保存修改'}
          </button>
        </div>
      </form>
    </div>
  );
}
