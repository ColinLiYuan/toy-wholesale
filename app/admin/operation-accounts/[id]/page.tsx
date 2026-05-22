'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { operationAccountService } from '@/services';
import type { OperationAccount } from '@/types';

export default function EditOperationAccountPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState<Partial<OperationAccount>>({});

  // 账号类型选项
  const accountTypes = [
    { value: 'SOCIAL_MEDIA', label: '社交媒体', icon: '🌐' },
    { value: 'EMAIL', label: '邮箱', icon: '📧' },
    { value: 'PAYMENT', label: '支付账号', icon: '💳' },
    { value: 'OTHER', label: '其他', icon: '📦' },
  ];

  // 业务线选项
  const businessLines = [
    { value: 'MYTH_TOY', label: 'MythToy零售' },
    { value: 'ADULT_PRODUCTS', label: '成人用品外贸' },
    { value: 'ANTI_FAKE', label: '防伪标签外贸' },
    { value: 'GENERAL', label: '通用' },
  ];

  // 社交媒体平台选项
  const socialMediaPlatforms = [
    { value: 'LINKEDIN', label: 'LinkedIn', icon: '💼' },
    { value: 'FACEBOOK', label: 'Facebook', icon: '📘' },
    { value: 'INSTAGRAM', label: 'Instagram', icon: '📷' },
    { value: 'TWITTER', label: 'Twitter', icon: '🐦' },
    { value: 'TIKTOK', label: 'TikTok', icon: '🎵' },
    { value: 'WHATSAPP', label: 'WhatsApp', icon: '💬' },
    { value: 'REDDIT', label: 'Reddit', icon: '🔴' },
  ];

  // 邮箱服务商选项
  const emailProviders = [
    { value: 'GMAIL', label: 'Gmail' },
    { value: 'OUTLOOK', label: 'Outlook/Hotmail' },
    { value: 'YAHOO', label: 'Yahoo' },
    { value: '163', label: '网易163' },
    { value: 'QQ', label: 'QQ邮箱' },
    { value: 'ALIYUN', label: '阿里云邮箱' },
    { value: 'ZOHO', label: 'Zoho' },
    { value: 'YANDEX', label: 'Yandex' },
  ];

  // 支付平台选项
  const paymentPlatforms = [
    { value: 'PAYPAL', label: 'PayPal' },
    { value: 'STRIPE', label: 'Stripe' },
    { value: 'WISE', label: 'Wise' },
  ];

  // 用途选项
  const purposes = [
    { value: 'MARKETING', label: '营销推广' },
    { value: 'CUSTOMER_SERVICE', label: '客户服务' },
    { value: 'SALES', label: '销售开发' },
    { value: 'NOTIFICATION', label: '通知接收' },
    { value: 'REGISTER', label: '注册账号' },
    { value: 'PAYMENT', label: '收款' },
    { value: 'OTHER', label: '其他' },
  ];

  const statuses = [
    { value: 'ACTIVE', label: '活跃' },
    { value: 'INACTIVE', label: '不活跃' },
    { value: 'BANNED', label: '被封禁' },
    { value: 'SUSPENDED', label: '暂停' },
  ];

  // 根据账号类型获取平台选项
  const getPlatformOptions = () => {
    switch (formData.accountType) {
      case 'SOCIAL_MEDIA':
        return socialMediaPlatforms;
      case 'EMAIL':
        return emailProviders;
      case 'PAYMENT':
        return paymentPlatforms;
      default:
        return [];
    }
  };

  useEffect(() => {
    fetchAccount();
  }, [id]);

  const fetchAccount = async () => {
    try {
      setFetching(true);
      const account = await operationAccountService.getAccountById(id);
      console.log('Fetched account data:', account);
      // 确保数据类型正确
      setFormData({
        ...account,
        followersCount: account.followersCount,
        twoFactorEnabled: account.twoFactorEnabled || false,
      });
    } catch (error) {
      console.error('Failed to fetch account:', error);
      alert('加载账号失败');
      router.push('/admin/operation-accounts');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // 清理数据：移除空值和undefined字段
      const cleanData: any = { ...formData };
      
      // 处理平台字段：空字符串转为undefined
      if (cleanData.platform === '' || cleanData.platform === undefined) {
        delete cleanData.platform;
      }
      
      // 处理数字字段
      if (cleanData.leadId === '' || cleanData.leadId === undefined) {
        delete cleanData.leadId;
      }
      if (cleanData.followersCount === 0 && cleanData.accountType !== 'SOCIAL_MEDIA') {
        delete cleanData.followersCount;
      }
      
      // 处理可选字段
      if (!cleanData.displayName) delete cleanData.displayName;
      if (!cleanData.password) delete cleanData.password;
      if (!cleanData.purpose) delete cleanData.purpose;
      if (!cleanData.projectName) delete cleanData.projectName;
      if (!cleanData.backupContact) delete cleanData.backupContact;
      if (!cleanData.phoneNumber) delete cleanData.phoneNumber;
      if (!cleanData.profileUrl) delete cleanData.profileUrl;
      if (!cleanData.notes) delete cleanData.notes;
      
      console.log('提交数据:', cleanData);
      
      await operationAccountService.updateAccount(id, cleanData);
      alert('账号更新成功！');
      router.push('/admin/operation-accounts');
    } catch (error: any) {
      console.error('Failed to update account:', error);
      console.error('Error response:', error.response?.data);
      
      // 显示更详细的错误信息
      let errorMessage = '更新账号失败，请重试。';
      
      if (error.backendMessage) {
        errorMessage = error.backendMessage;
      } else if (error.backendData?.message) {
        errorMessage = error.backendData.message;
      } else if (error.backendData?.error) {
        errorMessage = error.backendData.error;
      } else if (error.userMessage) {
        errorMessage = error.userMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // 如果有字段验证错误，显示详细信息
      if (error.backendData?.errors && Array.isArray(error.backendData.errors)) {
        const fieldErrors = error.backendData.errors.map((e: any) => 
          `${e.field || e.path}: ${e.message || e.reason}`
        ).join('\n');
        errorMessage = `更新账号失败：\n${fieldErrors}`;
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof OperationAccount, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gray-800 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/operation-accounts"
              className="text-gray-600 hover:text-gray-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">编辑运营账号</h1>
              <p className="mt-2 text-sm text-gray-600">更新运营账号信息</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-6">
          {/* 基础信息 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">基础信息</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  账号类型 *
                </label>
                <select
                  value={formData.accountType || 'SOCIAL_MEDIA'}
                  onChange={(e) => {
                    handleChange('accountType', e.target.value);
                    handleChange('platform', '');
                  }}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                >
                  {accountTypes.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.icon} {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  业务线 *
                </label>
                <select
                  value={formData.businessLine || 'GENERAL'}
                  onChange={(e) => handleChange('businessLine', e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                >
                  {businessLines.map((b) => (
                    <option key={b.value} value={b.value}>
                      {b.label}
                    </option>
                  ))}
                </select>
              </div>

              {formData.accountType && formData.accountType !== 'OTHER' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    平台/服务商 *
                  </label>
                  <select
                    value={formData.platform || ''}
                    onChange={(e) => handleChange('platform', e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                  >
                    <option value="">选择平台</option>
                    {getPlatformOptions().map((p: any) => (
                      <option key={p.value} value={p.value}>
                        {p.icon} {p.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  账号标识 *
                </label>
                <input
                  type="text"
                  value={formData.accountIdentifier || ''}
                  onChange={(e) => handleChange('accountIdentifier', e.target.value)}
                  required
                  placeholder="用户名/邮箱/账号ID"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  显示名称
                </label>
                <input
                  type="text"
                  value={formData.displayName || ''}
                  onChange={(e) => handleChange('displayName', e.target.value)}
                  placeholder="备注名称"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  密码（留空则保持现有密码）
                </label>
                <input
                  type="password"
                  value={formData.password || ''}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="输入新密码"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* 用途和状态 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">用途和状态</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  用途
                </label>
                <select
                  value={formData.purpose || ''}
                  onChange={(e) => handleChange('purpose', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                >
                  <option value="">选择用途</option>
                  {purposes.map((p) => (
                    <option key={p.value} value={p.value}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  状态
                </label>
                <select
                  value={formData.status || 'ACTIVE'}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                >
                  {statuses.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 附加信息 */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">附加信息</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  项目名称
                </label>
                <input
                  type="text"
                  value={formData.projectName || ''}
                  onChange={(e) => handleChange('projectName', e.target.value)}
                  placeholder="关联的项目名称"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  潜客ID
                </label>
                <input
                  type="number"
                  value={formData.leadId || ''}
                  onChange={(e) => handleChange('leadId', e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="可选"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  备用联系方式
                </label>
                <input
                  type="text"
                  value={formData.backupContact || ''}
                  onChange={(e) => handleChange('backupContact', e.target.value)}
                  placeholder="备用邮箱或手机号"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  绑定手机号
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber || ''}
                  onChange={(e) => handleChange('phoneNumber', e.target.value)}
                  placeholder="+86 123 4567 8900"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                />
              </div>

              {formData.accountType === 'SOCIAL_MEDIA' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      粉丝数
                    </label>
                    <input
                      type="number"
                      value={formData.followersCount || 0}
                      onChange={(e) => handleChange('followersCount', parseInt(e.target.value))}
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      主页链接
                    </label>
                    <input
                      type="url"
                      value={formData.profileUrl || ''}
                      onChange={(e) => handleChange('profileUrl', e.target.value)}
                      placeholder="https://..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                    />
                  </div>
                </>
              )}

              <div className="md:col-span-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.twoFactorEnabled || false}
                    onChange={(e) => handleChange('twoFactorEnabled', e.target.checked)}
                    className="w-4 h-4 text-gray-800 border-gray-300 rounded focus:ring-gray-800"
                  />
                  <span className="text-sm font-medium text-gray-700">启用双因素认证</span>
                </label>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  备注
                </label>
                <textarea
                  value={formData.notes || ''}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  rows={4}
                  placeholder="附加备注信息..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
            <Link
              href="/admin/operation-accounts"
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              取消
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '更新中...' : '更新账号'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
