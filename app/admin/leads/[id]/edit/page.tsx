'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { leadAdminService } from '@/services';
import type { Lead } from '@/types';
import { getSiteId } from '@/lib/api-client';

export default function EditLeadPage() {
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
  ];

  const sourceOptions = currentSite === 'seric'
    ? allSourceOptions.filter(option => option.value === 'MADE_IN_CHINA')
    : allSourceOptions;
  const params = useParams();
  const leadId = Number(params.id);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [lead, setLead] = useState<Partial<Lead>>({
    companyName: '',
    contactPerson: '',
    position: '',
    email: '',
    phone: '',
    imAccount: '',
    website: '',
    status: 'NEW',
    priority: 'MEDIUM',
    source: '',
    country: '',
    region: '',
    city: '',
    estimatedQuantity: undefined,
    budgetRange: '',
    notes: '',
  });

  useEffect(() => {
    if (leadId) {
      fetchLead();
    }
  }, [leadId]);

  const fetchLead = async () => {
    try {
      setFetching(true);
      const data = await leadAdminService.getLeadById(leadId);
      setLead(data);
    } catch (error) {
      console.error('Failed to fetch lead:', error);
      alert('获取潜客信息失败');
      router.push('/admin/leads');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!confirm('确定要保存更改吗？')) return;
    
    setLoading(true);
    try {
      await leadAdminService.updateLead(leadId, lead);
      alert('更新成功');
      router.push('/admin/leads');
    } catch (error) {
      console.error('Failed to update lead:', error);
      alert('更新失败');
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      NEW: '新线索',
      CONTACTED: '已联系',
      INTERESTED: '有意向',
      QUOTED: '已报价',
      NEGOTIATING: '谈判中',
      CONVERTED: '已成交',
      INVALID: '无效',
    };
    return statusMap[status] || status;
  };

  const getPriorityText = (priority: string) => {
    const priorityMap: Record<string, string> = {
      HIGH: '高',
      MEDIUM: '中',
      LOW: '低',
    };
    return priorityMap[priority] || priority;
  };

  const getSourceText = (source: string) => {
    const sourceMap: Record<string, string> = {
      EMAIL: '邮件开发',
      EXHIBITION: '展会',
      WEBSITE: '网站询盘',
      REFERRAL: '推荐',
      COLD_CALL: '电话开发',
      MYTH_TOY: 'MythToy',
      MADE_IN_CHINA: '中国制造网',
    };
    return sourceMap[source] || source;
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00F2FE]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/leads" className="text-blue-600 hover:underline mb-2 inline-block">
            ← 返回列表
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">编辑潜客</h1>
          <p className="text-gray-600 mt-1">修改潜客信息</p>
        </div>
        <div className="flex space-x-3">
          <Link
            href="/admin/leads"
            className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            取消
          </Link>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-3 bg-[#00F2FE] text-[#050505] rounded-lg font-semibold hover:bg-[#00C4CC] transition-colors disabled:opacity-50"
          >
            {loading ? '保存中...' : '保存'}
          </button>
        </div>
      </div>

      {/* 基本信息 */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">基本信息</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">公司名称</label>
            <input
              type="text"
              value={lead.companyName || ''}
              onChange={(e) => setLead({ ...lead, companyName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">联系人</label>
            <input
              type="text"
              value={lead.contactPerson || ''}
              onChange={(e) => setLead({ ...lead, contactPerson: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">职位</label>
            <input
              type="text"
              value={lead.position || ''}
              onChange={(e) => setLead({ ...lead, position: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
            <input
              type="email"
              value={lead.email || ''}
              onChange={(e) => setLead({ ...lead, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">电话</label>
            <input
              type="text"
              value={lead.phone || ''}
              onChange={(e) => setLead({ ...lead, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp/微信</label>
            <input
              type="text"
              value={lead.imAccount || ''}
              onChange={(e) => setLead({ ...lead, imAccount: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">网站</label>
            <input
              type="text"
              value={lead.website || ''}
              onChange={(e) => setLead({ ...lead, website: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">状态</label>
            <select
              value={lead.status || 'NEW'}
              onChange={(e) => setLead({ ...lead, status: e.target.value })}
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
              value={lead.priority || 'MEDIUM'}
              onChange={(e) => setLead({ ...lead, priority: e.target.value })}
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
              value={lead.source || ''}
              onChange={(e) => setLead({ ...lead, source: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
            >
              <option value="">请选择</option>
              {sourceOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
              <option value="MYTH_TOY">MythToy</option>
            </select>
          </div>
        </div>
      </div>

      {/* 地址信息 */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">地址信息</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">国家</label>
            <input
              type="text"
              value={lead.country || ''}
              onChange={(e) => setLead({ ...lead, country: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">省份/州</label>
            <input
              type="text"
              value={lead.region || ''}
              onChange={(e) => setLead({ ...lead, region: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">城市</label>
            <input
              type="text"
              value={lead.city || ''}
              onChange={(e) => setLead({ ...lead, city: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* 业务信息 */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">业务信息</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">预计采购量</label>
            <input
              type="number"
              value={lead.estimatedQuantity || ''}
              onChange={(e) => setLead({ ...lead, estimatedQuantity: Number(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">预算范围（USD）</label>
            <input
              type="text"
              value={lead.budgetRange || ''}
              onChange={(e) => setLead({ ...lead, budgetRange: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">备注</label>
            <textarea
              value={lead.notes || ''}
              onChange={(e) => setLead({ ...lead, notes: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
              placeholder="请输入备注信息..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}
