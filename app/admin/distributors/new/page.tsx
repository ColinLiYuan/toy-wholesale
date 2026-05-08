'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { distributorAdminService } from '@/services';
import { Distributor } from '@/types';

export default function NewDistributorPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<Distributor>>({
    status: 'ACTIVE',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = '请输入经销商名称';
    }
    if (!formData.code?.trim()) {
      newErrors.code = '请输入经销商编码';
    }
    if (!formData.contactPerson?.trim()) {
      newErrors.contactPerson = '请输入联系人';
    }
    if (!formData.email?.trim()) {
      newErrors.email = '请输入电子邮箱';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '请输入有效的电子邮箱';
    }
    if (!formData.country?.trim()) {
      newErrors.country = '请输入国家';
    }
    if (!formData.customerType?.trim()) {
      newErrors.customerType = '请选择客户类型';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await distributorAdminService.createDistributor(formData);
      alert('经销商创建成功');
      router.push('/admin/distributors');
    } catch (error) {
      alert('创建失败，请稍后重试');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">添加新经销商</h1>
          <p className="text-gray-600 mt-1">创建新的经销商账户</p>
        </div>
        <Link
          href="/admin/distributors"
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          返回列表
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">基本信息</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">经销商名称 <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleInputChange}
                placeholder="请输入经销商名称"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">经销商编码 <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="code"
                value={formData.code || ''}
                onChange={handleInputChange}
                placeholder="请输入经销商编码"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent ${errors.code ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.code && <p className="mt-1 text-sm text-red-500">{errors.code}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">客户类型 <span className="text-red-500">*</span></label>
              <select
                name="customerType"
                value={formData.customerType || ''}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent ${errors.customerType ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">请选择</option>
                <option value="REGULAR">正规经销商</option>
                <option value="SMALL_BUSINESS">小B商户</option>
                <option value="INDIVIDUAL">个人客户</option>
              </select>
              {errors.customerType && <p className="mt-1 text-sm text-red-500">{errors.customerType}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">经销商等级</label>
              <select
                name="level"
                value={formData.level || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
              >
                <option value="">请选择</option>
                <option value="GOLD">金牌</option>
                <option value="SILVER">银牌</option>
                <option value="BRONZE">铜牌</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">联系人 <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson || ''}
                onChange={handleInputChange}
                placeholder="请输入联系人姓名"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent ${errors.contactPerson ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.contactPerson && <p className="mt-1 text-sm text-red-500">{errors.contactPerson}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">联系电话</label>
              <input
                type="text"
                name="phone"
                value={formData.phone || ''}
                onChange={handleInputChange}
                placeholder="请输入联系电话"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">电子邮箱 <span className="text-red-500">*</span></label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleInputChange}
                placeholder="请输入电子邮箱"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">地址信息</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">国家 <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="country"
                value={formData.country || ''}
                onChange={handleInputChange}
                placeholder="请输入国家"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent ${errors.country ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.country && <p className="mt-1 text-sm text-red-500">{errors.country}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">省份/州</label>
              <input
                type="text"
                name="region"
                value={formData.region || ''}
                onChange={handleInputChange}
                placeholder="请输入省份或州"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">城市</label>
              <input
                type="text"
                name="city"
                value={formData.city || ''}
                onChange={handleInputChange}
                placeholder="请输入城市"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">详细地址</label>
            <textarea
              name="address"
              value={formData.address || ''}
              onChange={handleInputChange}
              rows={3}
              placeholder="请输入详细地址"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">其他信息</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">公司网址</label>
              <input
                type="text"
                name="website"
                value={formData.website || ''}
                onChange={handleInputChange}
                placeholder="请输入公司网址"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">邮政编码</label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode || ''}
                onChange={handleInputChange}
                placeholder="请输入邮政编码"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleInputChange}
              rows={4}
              placeholder="请输入经销商描述（可选）"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00F2FE] focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
          <Link
            href="/admin/distributors"
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            取消
          </Link>
          <button
            type="submit"
            className="px-6 py-2 bg-[#00F2FE] text-[#050505] rounded-lg font-semibold hover:bg-[#00C4CC] transition-colors"
          >
            创建经销商
          </button>
        </div>
      </form>
    </div>
  );
}
