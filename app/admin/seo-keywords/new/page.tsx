'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { seoKeywordService } from '@/services';

export default function NewSeoKeywordPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  // 表单数据
  const [formData, setFormData] = useState({
    keyword: '',
    volume: '' as string | number,
    kd: '' as string | number,
    intent: '',
    category: '',
    notes: '',
  });

  // 搜索意图选项
  const intentOptions = [
    { value: 'C', label: '商业 (Commercial)' },
    { value: 'T', label: '交易 (Transactional)' },
    { value: 'I', label: '信息 (Informational)' },
    { value: 'N', label: '导航 (Navigational)' },
  ];

  // 分类选项
  const categoryOptions = [
    { value: 'core', label: '核心词' },
    { value: 'long_tail', label: '长尾词' },
    { value: 'article', label: '文章词' },
    { value: 'brand', label: '品牌词' },
  ];

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 必填字段验证
    if (!formData.keyword.trim()) {
      alert('请输入关键词');
      return;
    }

    if (!confirm('确定要创建此关键词吗？')) {
      return;
    }

    setSaving(true);
    try {
      const keywordData: any = {
        keyword: formData.keyword.trim(),
        siteId: 'toy', // 默认站点
      };

      // 可选字段
      if (formData.volume && Number(formData.volume) > 0) {
        keywordData.volume = Number(formData.volume);
      }
      if (formData.kd && Number(formData.kd) >= 0 && Number(formData.kd) <= 100) {
        keywordData.kd = Number(formData.kd);
      }
      if (formData.intent) {
        keywordData.intent = formData.intent;
      }
      if (formData.category) {
        keywordData.category = formData.category;
      }
      if (formData.notes) {
        keywordData.notes = formData.notes;
      }

      await seoKeywordService.createKeyword(keywordData);
      alert('关键词创建成功！');
      router.push('/admin/seo-keywords');
    } catch (error: any) {
      console.error('Failed to create keyword:', error);
      alert('创建失败：' + (error.message || '未知错误'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/seo-keywords" className="text-blue-600 hover:underline mb-2 inline-block">
            ← 返回关键词列表
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">新建 SEO 关键词</h1>
          <p className="text-gray-600 mt-1">添加新的 SEO 关键词到库中</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 基本信息 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">基本信息</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                关键词 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.keyword}
                onChange={(e) => setFormData({ ...formData, keyword: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="例如：adult toys wholesale"
                required
              />
              <p className="mt-1 text-xs text-gray-500">关键词将作为唯一标识，不能重复</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">月搜索量</label>
              <input
                type="number"
                value={formData.volume}
                onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="例如：1000"
                min="0"
              />
              <p className="mt-1 text-xs text-gray-500">来自 SEO 工具的月均搜索量</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">关键词难度 (KD)</label>
              <input
                type="number"
                value={formData.kd}
                onChange={(e) => setFormData({ ...formData, kd: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0-100"
                min="0"
                max="100"
              />
              <p className="mt-1 text-xs text-gray-500">范围：0-100，数值越低越容易排名</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">搜索意图</label>
              <select
                value={formData.intent}
                onChange={(e) => setFormData({ ...formData, intent: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">请选择</option>
                {intentOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">分类</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">请选择</option>
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">备注</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="观察记录、优化建议等..."
              />
            </div>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex justify-end gap-4">
          <Link
            href="/admin/seo-keywords"
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            取消
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </form>
    </div>
  );
}
