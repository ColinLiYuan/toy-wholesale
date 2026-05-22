'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { seoKeywordService, SeoKeyword } from '@/services';

export default function EditSeoKeywordPage() {
  const router = useRouter();
  const params = useParams();
  const keywordId = Number(params.id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [keyword, setKeyword] = useState<SeoKeyword | null>(null);
  const [associatedUrls, setAssociatedUrls] = useState<string[]>([]);

  // 表单数据
  const [formData, setFormData] = useState({
    keyword: '',
    volume: '' as string | number,
    kd: '' as string | number,
    intent: '',
    category: '',
    topic: '',
    status: 0,
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

  // 主题选项（SEO话题分类）
  const topicOptions = [
    { value: 'CLIT', label: '阴蒂相关 (Clit)' },
    { value: 'ANAL', label: '肛门相关 (Anal)' },
    { value: 'DILDO', label: '假阳具 (Dildo)' },
    { value: 'COUPLES', label: '情侣用品 (Couples)' },
    { value: 'BEGINNER', label: '初学者 (Beginner)' },
    { value: 'PREMATURE', label: '早泄相关 (Premature)' },
    { value: 'STAMINA', label: '耐力持久 (Stamina)' },
    { value: 'WAND', label: '按摩棒 (Wand)' },
    { value: 'BULLET', label: '跳蛋/迷你震动器 (Bullet)' },
    { value: 'RABBIT', label: '兔型双震 (Rabbit)' },
    { value: 'GSPOT', label: 'G点震动器 (GSpot)' },
    { value: 'MASTURBATOR', label: '男用自慰器 (Masturbator)' },
    { value: 'COCKRING', label: '阴茎环 (CockRing)' },
    { value: 'PROSTATE', label: '前列腺玩具 (Prostate)' },
    { value: 'DISCREET', label: '隐蔽/静音 (Discreet)' },
    { value: 'LUBE', label: '润滑液 (Lube)' },
    { value: 'CLEANER', label: '玩具清洁 (Cleaner)' },
    { value: 'BODYSAFE', label: '身体安全材料 (BodySafe)' },
    { value: 'PELVIC', label: '盆底肌训练 (Pelvic)' },
    { value: 'LIBIDO', label: '女性性欲 (Libido)' },
    { value: 'ORGASM', label: '女性高潮 (Orgasm)' },
    { value: 'NIPPLE', label: '乳头玩具 (Nipple)' },
    { value: 'EDUCATION', label: '性教育科普 (Education)' },
  ];

  // 状态选项
  const statusOptions = [
    { value: 0, label: '未使用' },
    { value: 1, label: '已使用' },
  ];

  // 加载关键词详情
  useEffect(() => {
    const loadKeyword = async () => {
      try {
        setLoading(true);
        const data = await seoKeywordService.getKeywordById(keywordId);
        setKeyword(data);
        
        // 填充表单
        setFormData({
          keyword: data.keyword || '',
          volume: data.volume || '',
          kd: data.kd !== undefined && data.kd !== null ? data.kd : '',
          intent: data.intent || '',
          category: data.category || '',
          topic: data.topic || '',
          status: data.status || 0,
          notes: data.notes || '',
        });
        
        // 加载关联的URL列表
        try {
          const urls = await seoKeywordService.getUrlsByKeywordId(keywordId);
          setAssociatedUrls(urls);
        } catch (error) {
          console.error('Failed to load associated URLs:', error);
        }
      } catch (error) {
        console.error('Failed to load keyword:', error);
        alert('加载关键词失败');
        router.push('/admin/seo-keywords');
      } finally {
        setLoading(false);
      }
    };

    loadKeyword();
  }, [keywordId, router]);

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 必填字段验证
    if (!formData.keyword.trim()) {
      alert('请输入关键词');
      return;
    }

    if (!confirm('确定要更新此关键词吗？')) {
      return;
    }

    setSaving(true);
    try {
      const keywordData: any = {
        keyword: formData.keyword.trim(),
      };

      // 可选字段
      if (formData.volume && Number(formData.volume) > 0) {
        keywordData.volume = Number(formData.volume);
      } else {
        keywordData.volume = null;
      }
      
      if (formData.kd && Number(formData.kd) >= 0 && Number(formData.kd) <= 100) {
        keywordData.kd = Number(formData.kd);
      } else {
        keywordData.kd = null;
      }
      
      if (formData.intent) {
        keywordData.intent = formData.intent;
      } else {
        keywordData.intent = null;
      }
      
      if (formData.category) {
        keywordData.category = formData.category;
      } else {
        keywordData.category = null;
      }
      
      if (formData.topic) {
        keywordData.topic = formData.topic;
      } else {
        keywordData.topic = null;
      }
      
      keywordData.status = formData.status;
      
      if (formData.notes) {
        keywordData.notes = formData.notes;
      } else {
        keywordData.notes = null;
      }

      await seoKeywordService.updateKeyword(keywordId, keywordData);
      alert('关键词更新成功！');
      router.push('/admin/seo-keywords');
    } catch (error: any) {
      console.error('Failed to update keyword:', error);
      alert('更新失败：' + (error.message || '未知错误'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (!keyword) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <p className="text-gray-500">关键词不存在</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/seo-keywords" className="text-blue-600 hover:underline mb-2 inline-block">
            ← 返回关键词列表
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">编辑 SEO 关键词</h1>
          <p className="text-gray-600 mt-1">ID: {keyword.id}</p>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">SEO主题</label>
              <select
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">请选择</option>
                {topicOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">用于SEO内容组织和分组</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">使用状态</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statusOptions.map((option) => (
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

        {/* 元信息 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">元信息</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">添加时间</label>
              <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-600">
                {keyword.addedAt ? new Date(keyword.addedAt).toLocaleString('zh-CN') : '-'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">最后更新</label>
              <p className="px-4 py-2 bg-gray-50 rounded-lg text-gray-600">
                {keyword.lastUpdatedAt ? new Date(keyword.lastUpdatedAt).toLocaleString('zh-CN') : '-'}
              </p>
            </div>
          </div>
        </div>

        {/* URL 关联 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">关联的页面 URL</h2>
            <span className="text-sm text-gray-500">共 {associatedUrls.length} 个</span>
          </div>
          
          {associatedUrls.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>暂无关联的页面</p>
              <p className="text-sm mt-2">可以在产品或博客编辑页面关联此关键词</p>
            </div>
          ) : (
            <div className="space-y-2">
              {associatedUrls.map((url, index) => (
                <div key={index} className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg">
                  <a 
                    href={url.startsWith('http') ? url : `/${url.replace(/^\//, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline truncate flex-1 mr-4"
                  >
                    {url}
                  </a>
                  <span className="text-xs text-gray-400">{index + 1}</span>
                </div>
              ))}
            </div>
          )}
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
