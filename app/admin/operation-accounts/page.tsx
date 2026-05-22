'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { operationAccountService } from '@/services';
import type { OperationAccount, OperationAccountListResponse } from '@/types';

export default function SocialMediaAccountsPage() {
  const [accounts, setAccounts] = useState<OperationAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0,
  });
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedAccountType, setSelectedAccountType] = useState<string>('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  const [visiblePasswords, setVisiblePasswords] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchAccounts();
  }, [pagination.currentPage, selectedAccountType, selectedPlatform]);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      let response: OperationAccountListResponse;

      if (searchKeyword) {
        response = await operationAccountService.searchAccounts(
          searchKeyword,
          pagination.currentPage,
          20
        );
      } else if (selectedPlatform) {
        // 如果有平台筛选，使用 filter 接口
        const data = await operationAccountService.getAccountsByFilter(
          selectedAccountType || 'GENERAL',
          selectedPlatform
        );
        response = {
          content: data,
          currentPage: 0,
          totalPages: 1,
          totalElements: data.length,
          hasNext: false,
          hasPrevious: false,
          first: true,
          last: true,
          pageSize: 20,
        };
      } else if (selectedAccountType) {
        const data = await operationAccountService.getAccountsByType(selectedAccountType);
        response = {
          content: data,
          currentPage: 0,
          totalPages: 1,
          totalElements: data.length,
          hasNext: false,
          hasPrevious: false,
          first: true,
          last: true,
          pageSize: 20,
        };
      } else {
        response = await operationAccountService.getAllAccounts(
          pagination.currentPage,
          20
        );
      }

      setAccounts(response.content);
      setPagination({
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        totalElements: response.totalElements,
      });
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination({ ...pagination, currentPage: 0 });
    fetchAccounts();
  };

  // 根据账号类型获取平台选项
  const getPlatformOptions = () => {
    const platforms: Record<string, Array<{ value: string; label: string }>> = {
      SOCIAL_MEDIA: [
        { value: 'LINKEDIN', label: 'LinkedIn' },
        { value: 'FACEBOOK', label: 'Facebook' },
        { value: 'INSTAGRAM', label: 'Instagram' },
        { value: 'TWITTER', label: 'Twitter' },
        { value: 'TIKTOK', label: 'TikTok' },
        { value: 'WHATSAPP', label: 'WhatsApp' },
        { value: 'REDDIT', label: 'Reddit' },
      ],
      EMAIL: [
        { value: 'GMAIL', label: 'Gmail' },
        { value: 'OUTLOOK', label: 'Outlook' },
        { value: 'YAHOO', label: 'Yahoo' },
        { value: '163', label: '网易163' },
        { value: 'QQ', label: 'QQ邮箱' },
        { value: 'ALIYUN', label: '阿里云邮箱' },
        { value: 'ZOHO', label: 'Zoho' },
        { value: 'YANDEX', label: 'Yandex' },
      ],
      PAYMENT: [
        { value: 'PAYPAL', label: 'PayPal' },
        { value: 'STRIPE', label: 'Stripe' },
        { value: 'WISE', label: 'Wise' },
      ],
    };
    return platforms[selectedAccountType] || [];
  };

  const handleAccountTypeChange = (value: string) => {
    setSelectedAccountType(value);
    // 切换账号类型时清空平台筛选
    setSelectedPlatform('');
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除此账号吗？')) return;

    try {
      await operationAccountService.deleteAccount(id);
      fetchAccounts();
      alert('删除成功');
    } catch (error) {
      console.error('Failed to delete account:', error);
      alert('删除失败');
    }
  };

  const togglePasswordVisibility = (id: number) => {
    setVisiblePasswords(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getAccountTypeIcon = (accountType?: string) => {
    const icons: Record<string, string> = {
      SOCIAL_MEDIA: '🌐',
      EMAIL: '📧',
      PAYMENT: '💳',
      OTHER: '📦',
    };
    return icons[accountType || 'OTHER'] || '📦';
  };

  const getAccountTypeText = (accountType?: string) => {
    const typeMap: Record<string, string> = {
      SOCIAL_MEDIA: '社交媒体',
      EMAIL: '邮箱',
      PAYMENT: '支付账号',
      OTHER: '其他',
    };
    return typeMap[accountType || 'OTHER'] || accountType || '其他';
  };

  const getBusinessLineText = (businessLine?: string) => {
    const lineMap: Record<string, string> = {
      MYTH_TOY: 'MythToy零售',
      ADULT_PRODUCTS: '成人用品外贸',
      ANTI_FAKE: '防伪标签外贸',
      GENERAL: '通用',
    };
    return lineMap[businessLine || 'GENERAL'] || businessLine || '通用';
  };

  const getPlatformIcon = (platform?: string) => {
    const icons: Record<string, string> = {
      // 社交媒体
      LINKEDIN: '💼',
      FACEBOOK: '📘',
      INSTAGRAM: '📷',
      TWITTER: '🐦',
      TIKTOK: '🎵',
      WHATSAPP: '💬',
      REDDIT: '🔴',
      // 邮箱
      GMAIL: '📧',
      OUTLOOK: '📧',
      YAHOO: '📧',
      '163': '📧',
      QQ: '📧',
      ALIYUN: '📧',
      ZOHO: '📧',
      YANDEX: '📧',
      // 支付
      PAYPAL: '💳',
      STRIPE: '💳',
      WISE: '💳',
    };
    return icons[platform || ''] || '🌐';
  };

  const getPlatformText = (platform?: string) => {
    const platformMap: Record<string, string> = {
      // 社交媒体
      LINKEDIN: 'LinkedIn',
      FACEBOOK: 'Facebook',
      INSTAGRAM: 'Instagram',
      TWITTER: 'Twitter',
      TIKTOK: 'TikTok',
      WHATSAPP: 'WhatsApp',
      REDDIT: 'Reddit',
      // 邮箱
      GMAIL: 'Gmail',
      OUTLOOK: 'Outlook',
      YAHOO: 'Yahoo',
      '163': '网易163',
      QQ: 'QQ邮箱',
      ALIYUN: '阿里云邮箱',
      ZOHO: 'Zoho',
      YANDEX: 'Yandex',
      // 支付
      PAYPAL: 'PayPal',
      STRIPE: 'Stripe',
      WISE: 'Wise',
    };
    return platformMap[platform || ''] || platform || '-';
  };

  const getStatusText = (status?: string) => {
    const statusMap: Record<string, string> = {
      ACTIVE: '正常',
      INACTIVE: '未激活',
      BANNED: '已封禁',
      SUSPENDED: '已暂停',
    };
    return statusMap[status || 'ACTIVE'] || status || '正常';
  };

  const getPurposeText = (purpose?: string) => {
    const purposeMap: Record<string, string> = {
      MARKETING: '营销',
      CUSTOMER_SERVICE: '客服',
      SALES: '销售',
      BRANDING: '品牌',
    };
    return purposeMap[purpose || ''] || purpose || '-';
  };

  const getEmailProviderText = (provider?: string) => {
    const providerMap: Record<string, string> = {
      GMAIL: 'Gmail',
      OUTLOOK: 'Outlook/Hotmail',
      YAHOO: 'Yahoo',
      '163': '网易163',
      QQ: 'QQ邮箱',
      ALIYUN: '阿里云邮箱',
      ZOHO: 'Zoho',
      OTHER: '其他',
    };
    return providerMap[provider || ''] || provider || '-';
  };

  const getStatusColor = (status?: string) => {
    const colors: Record<string, string> = {
      ACTIVE: 'bg-green-100 text-green-800',
      INACTIVE: 'bg-gray-100 text-gray-800',
      BANNED: 'bg-red-100 text-red-800',
      SUSPENDED: 'bg-yellow-100 text-yellow-800',
    };
    return colors[status || 'ACTIVE'] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">运营账号</h1>
              <p className="mt-2 text-sm text-gray-600">管理所有业务线的运营账号，包括社交媒体、邮箱、支付账号等</p>
            </div>
            <Link
              href="/admin/operation-accounts/new"
              className="inline-flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              添加账号
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <input
                type="text"
                placeholder="搜索账号..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
              />
            </div>
            <div>
              <select
                value={selectedAccountType}
                onChange={(e) => handleAccountTypeChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
              >
                <option value="">所有账号类型</option>
                <option value="SOCIAL_MEDIA">🌐 社交媒体</option>
                <option value="EMAIL">📧 邮箱</option>
                <option value="PAYMENT">💳 支付账号</option>
                <option value="OTHER">📦 其他</option>
              </select>
            </div>
            {selectedAccountType && selectedAccountType !== 'OTHER' && (
              <div>
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent"
                >
                  <option value="">所有平台</option>
                  {getPlatformOptions().map((platform) => (
                    <option key={platform.value} value={platform.value}>
                      {platform.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <button
                onClick={handleSearch}
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
              >
                搜索
              </button>
            </div>
          </div>
        </div>

        {/* Accounts List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {accounts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">没有找到账号</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      账号类型
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      业务线
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      平台/服务商
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      账号标识
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      显示名称
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      密码
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      备注
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {accounts.map((account) => (
                    <tr key={account.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-2xl mr-2">{getAccountTypeIcon(account.accountType)}</span>
                          <span className="text-sm font-medium text-gray-900">
                            {getAccountTypeText(account.accountType)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {getBusinessLineText(account.businessLine)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-lg mr-2">{getPlatformIcon(account.platform)}</span>
                          <span className="text-sm font-medium text-gray-900">
                            {getPlatformText(account.platform)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900 font-mono">
                          {account.accountIdentifier || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-600">
                          {account.displayName || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {account.password ? (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-900 font-mono">
                              {visiblePasswords.has(account.id!) ? account.password : '••••••••'}
                            </span>
                            <button
                              onClick={() => account.id && togglePasswordVisibility(account.id)}
                              className="text-gray-500 hover:text-gray-700 transition-colors"
                              title={visiblePasswords.has(account.id!) ? '隐藏密码' : '显示密码'}
                            >
                              {visiblePasswords.has(account.id!) ? (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                              ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              )}
                            </button>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">未设置</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {account.notes || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/admin/operation-accounts/${account.id}`}
                          className="text-gray-600 hover:text-gray-900 mr-4"
                        >
                          编辑
                        </Link>
                        <button
                          onClick={() => account.id && handleDelete(account.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          删除
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="text-sm text-gray-700">
                显示 {accounts.length} 条，共 {pagination.totalElements} 条
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage - 1 })}
                  disabled={pagination.currentPage === 0}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  上一页
                </button>
                <button
                  onClick={() => setPagination({ ...pagination, currentPage: pagination.currentPage + 1 })}
                  disabled={pagination.currentPage >= pagination.totalPages - 1}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  下一页
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
