'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { inquiryAdminService, Inquiry } from '@/services';
import { getSiteId } from '@/lib/api-client';
import CountrySelect from '@/components/CountrySelect';

export default function NewInquiryPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  // 获取当前站点
  const currentSite = typeof window !== 'undefined' ? getSiteId() : 'toy';

  // 所有询盘来源选项
  const allSourceOptions = [
    { value: 'WEBSITE_FORM', label: '网站表单' },
    { value: 'EMAIL', label: '邮件' },
    { value: 'ALIBABA', label: '阿里巴巴' },
    { value: 'WHATSAPP', label: 'WhatsApp' },
    { value: 'TRADE_SHOW', label: '展会' },
    { value: 'MYTH_TOY', label: 'MythToy转移' },
    { value: 'MADE_IN_CHINA', label: '中国制造网' },
    { value: 'OTHER', label: '其他' },
  ];

  // 根据站点筛选来源选项
  // toy 展示全部来源，seric 只展示中国制造网
  const sourceOptions = currentSite === 'seric'
    ? allSourceOptions.filter(option => option.value === 'MADE_IN_CHINA')
    : allSourceOptions;

  // 表单数据 - 根据站点设置默认来源
  const [formData, setFormData] = useState<Partial<Inquiry>>({
    status: 'NEW',
    source: currentSite === 'seric' ? 'MADE_IN_CHINA' : 'WEBSITE_FORM',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    companyName: '',
    country: '',
    message: '',
    assignedTo: '',
  });

  // 询单项
  const [items, setItems] = useState<Array<{
    productId: number;
    skuId?: number;
    quantity: number;
    productName: string;
    productImage?: string;
    specifications?: string;
    notes?: string;
  }>>([]);

  // 添加询单项
  const handleAddItem = async () => {
    const productIdInput = prompt('请输入产品ID:');
    if (!productIdInput) return;

    const productName = prompt('请输入产品名称:', `产品 ${productIdInput}`) || `产品 ${productIdInput}`;
    const quantity = parseInt(prompt('请输入数量:', '1') || '1');
    const notes = prompt('客户备注（可选）:', '') || '';

    const newItem = {
      productId: parseInt(productIdInput),
      quantity: Math.max(1, quantity),
      productName,
      notes,
    };

    setItems([...items, newItem]);
  };

  // 删除询单项
  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 必填字段验证
    if (!formData.customerName?.trim()) {
      alert('请输入客户姓名');
      return;
    }
    if (!formData.customerEmail?.trim()) {
      alert('请输入客户邮箱');
      return;
    }

    if (!confirm('确定要创建询盘吗？')) {
      return;
    }

    setSaving(true);
    try {
      const inquiryData: Partial<Inquiry> = {
        ...formData,
        // items 可以为空（纯咨询询盘）
      };

      const createdInquiry = await inquiryAdminService.createInquiry(inquiryData);
      alert(`询盘创建成功！询盘编号：${createdInquiry.inquiryNumber}`);
      router.push(`/admin/inquiries/${createdInquiry.id}`);
    } catch (error: any) {
      console.error('Failed to create inquiry:', error);
      alert('创建询盘失败：' + (error.userMessage || error.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/inquiries" className="text-blue-600 hover:underline mb-2 inline-block">
            ← 返回询盘列表
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">新建询盘</h1>
          <p className="text-gray-600 mt-1">创建新的询盘记录</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 客户基本信息 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">客户基本信息</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                询盘来源 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.source || 'WEBSITE_FORM'}
                onChange={(e) => setFormData({ ...formData, source: e.target.value as any })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {sourceOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                客户姓名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.customerName || ''}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="客户姓名"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                客户邮箱 <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.customerEmail || ''}
                onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="客户邮箱"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">客户电话/WhatsApp</label>
              <input
                type="text"
                value={formData.customerPhone || ''}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="联系电话或WhatsApp"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">公司名称</label>
              <input
                type="text"
                value={formData.companyName || ''}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="公司名称"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">国家</label>
              <CountrySelect
                value={formData.country || ''}
                onChange={(code) => setFormData({ ...formData, country: code })}
              />
            </div>
          </div>
        </div>

        {/* 产品清单 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">产品清单</h2>
            <button
              type="button"
              onClick={handleAddItem}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              + 添加产品
            </button>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              暂无产品，点击"添加产品"按钮添加
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.productName}</p>
                    <p className="text-sm text-gray-500">产品ID: {item.productId}</p>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">数量: </span>
                    <span className="font-medium">{item.quantity}</span>
                  </div>
                  {item.notes && (
                    <div className="text-sm text-gray-500">
                      <span className="text-gray-600">备注: </span>
                      {item.notes}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="px-3 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    删除
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 询盘留言 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">询盘留言</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">客户留言内容</label>
            <textarea
              value={formData.message || ''}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="客户的原始留言内容..."
            />
          </div>
        </div>

        {/* 分配销售人员 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">分配信息</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">销售人员</label>
            <input
              type="text"
              value={formData.assignedTo || ''}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="负责的销售人员姓名"
            />
          </div>
        </div>

        {/* 提交按钮 */}
        <div className="flex justify-end gap-4">
          <Link
            href="/admin/inquiries"
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            取消
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? '创建中...' : '创建询盘'}
          </button>
        </div>
      </form>
    </div>
  );
}
