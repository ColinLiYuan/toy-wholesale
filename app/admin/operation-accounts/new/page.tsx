'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { operationAccountService } from '@/services';
import type { OperationAccount } from '@/types';

// ============================================================
// 账号类型定义
// ============================================================
const ACCOUNT_TYPES = [
  { value: 'SOCIAL_MEDIA', label: '社交媒体', icon: '🌐' },
  { value: 'EMAIL', label: '邮箱', icon: '📧' },
  { value: 'PAYMENT', label: '支付收款', icon: '💳' },
  { value: 'B2B_PLATFORM', label: 'B2B平台', icon: '🏭' },
  { value: 'LOGISTICS', label: '物流', icon: '🚚' },
  { value: 'CUSTOMS', label: '海关报关', icon: '🛃' },
  { value: 'CLOUD_SERVICE', label: '云服务', icon: '☁️' },
  { value: 'DOMAIN', label: '域名', icon: '🔗' },
  { value: 'SERVER', label: '服务器', icon: '🖥️' },
  { value: 'DATABASE', label: '数据库', icon: '🗄️' },
  { value: 'ANALYTICS', label: '数据分析', icon: '📊' },
  { value: 'DEV_TOOL', label: '开发工具', icon: '🔧' },
  { value: 'OTHER', label: '其他', icon: '📦' },
];

// ============================================================
// 各类型对应的平台选项
// ============================================================
const PLATFORM_OPTIONS: Record<string, Array<{ value: string; label: string }>> = {
  SOCIAL_MEDIA: [
    { value: 'LINKEDIN', label: 'LinkedIn' },
    { value: 'FACEBOOK', label: 'Facebook' },
    { value: 'INSTAGRAM', label: 'Instagram' },
    { value: 'TWITTER', label: 'Twitter / X' },
    { value: 'TIKTOK', label: 'TikTok' },
    { value: 'YOUTUBE', label: 'YouTube' },
    { value: 'REDDIT', label: 'Reddit' },
    { value: 'PINTEREST', label: 'Pinterest' },
    { value: 'WHATSAPP', label: 'WhatsApp' },
    { value: 'TELEGRAM', label: 'Telegram' },
  ],
  EMAIL: [
    { value: 'GMAIL', label: 'Gmail' },
    { value: 'OUTLOOK', label: 'Outlook / Hotmail' },
    { value: 'YAHOO', label: 'Yahoo' },
    { value: '163', label: '网易163' },
    { value: 'QQ', label: 'QQ邮箱' },
    { value: 'ALIYUN_MAIL', label: '阿里云邮箱' },
    { value: 'ZOHO', label: 'Zoho' },
    { value: 'YANDEX', label: 'Yandex' },
  ],
  PAYMENT: [
    { value: 'PAYPAL', label: 'PayPal' },
    { value: 'STRIPE', label: 'Stripe' },
    { value: 'WISE', label: 'Wise' },
    { value: 'PAYONEER', label: 'Payoneer' },
    { value: 'LIANLIAN', label: '连连支付' },
    { value: 'WORLDFIRST', label: '万里汇' },
  ],
  B2B_PLATFORM: [
    { value: 'ALIBABA_INTERNATIONAL', label: '阿里巴巴国际站' },
    { value: 'ECER', label: 'ECER / 宜选网' },
    { value: 'MADE_IN_CHINA', label: '中国制造网' },
    { value: 'GLOBAL_SOURCES', label: 'Global Sources' },
  ],
  LOGISTICS: [
    { value: 'DHL', label: 'DHL' },
    { value: 'UPS', label: 'UPS' },
    { value: 'FEDEX', label: 'FedEx' },
    { value: 'YUNEXPRESS', label: '云途物流' },
    { value: 'DEX', label: '递四方' },
  ],
  CUSTOMS: [
    { value: 'CHINA_SINGLE_WINDOW', label: '中国国际贸易单一窗口' },
    { value: 'OTHER', label: '报关行/其他' },
  ],
  CLOUD_SERVICE: [
    { value: 'ALIYUN_CLOUD', label: '阿里云' },
    { value: 'CLOUDFLARE', label: 'Cloudflare' },
    { value: 'AWS', label: 'AWS' },
    { value: 'GOOGLE_CLOUD', label: 'Google Cloud' },
  ],
  DOMAIN: [
    { value: 'ALIYUN_CLOUD', label: '阿里云（万网）' },
    { value: 'CLOUDFLARE', label: 'Cloudflare Registrar' },
    { value: 'NAMECHEAP', label: 'Namecheap' },
    { value: 'GODADDY', label: 'GoDaddy' },
  ],
  SERVER: [
    { value: 'ALIYUN_CLOUD', label: '阿里云 ECS' },
    { value: 'AWS', label: 'AWS EC2' },
    { value: 'GOOGLE_CLOUD', label: 'Google Cloud VM' },
    { value: 'VERCEL', label: 'Vercel' },
    { value: 'NETLIFY', label: 'Netlify' },
  ],
  DATABASE: [
    { value: 'ALIYUN_CLOUD', label: '阿里云 RDS' },
    { value: 'AWS', label: 'AWS RDS' },
    { value: 'OTHER', label: '自建/其他' },
  ],
  ANALYTICS: [
    { value: 'GOOGLE_ANALYTICS', label: 'Google Analytics (GA4)' },
    { value: 'GOOGLE_SEARCH_CONSOLE', label: 'Google Search Console' },
    { value: 'BING_WEBMASTER', label: 'Bing Webmaster' },
    { value: 'AHREFS', label: 'Ahrefs' },
    { value: 'SEMRUSH', label: 'SEMrush' },
  ],
  DEV_TOOL: [
    { value: 'GITHUB', label: 'GitHub' },
    { value: 'GITLAB', label: 'GitLab' },
    { value: 'DOCKER', label: 'Docker Hub' },
    { value: 'VERCEL', label: 'Vercel' },
    { value: 'NPM', label: 'npm' },
    { value: 'FIGMA', label: 'Figma' },
  ],
  OTHER: [
    { value: 'GOOGLE_WORKSPACE', label: 'Google Workspace' },
    { value: 'NOTION', label: 'Notion' },
    { value: 'CANVA', label: 'Canva' },
    { value: 'OTHER', label: '其他' },
  ],
};

// 需要显示基础设施字段（API Key/端口/区域等）的类型
const INFRA_TYPES = ['CLOUD_SERVICE', 'DOMAIN', 'SERVER', 'DATABASE', 'DEV_TOOL', 'ANALYTICS', 'OTHER'];

export default function NewOperationAccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<OperationAccount>>({
    accountType: 'SOCIAL_MEDIA',
    businessLine: 'ADULT_PRODUCTS',
    platform: 'LINKEDIN',
    status: 'ACTIVE',
    twoFactorEnabled: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const cleanData: Record<string, unknown> = { ...formData };
      Object.keys(cleanData).forEach((key) => {
        if (cleanData[key] === '' || cleanData[key] === undefined) delete cleanData[key];
      });
      await operationAccountService.createAccount(cleanData as OperationAccount);
      alert('账号创建成功！');
      router.push('/admin/operation-accounts');
    } catch (error: unknown) {
      const err = error as { backendMessage?: string; message?: string };
      alert(err.backendMessage || err.message || '创建账号失败');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof OperationAccount, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const showInfraFields = INFRA_TYPES.includes(formData.accountType || '');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link href="/admin/operation-accounts" className="text-gray-600 hover:text-gray-900">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">添加运营账号</h1>
              <p className="mt-2 text-sm text-gray-600">管理社交媒体、邮箱、支付、云服务、B2B平台、服务器等所有运营账号</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ===== 基础信息 ===== */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">基础信息</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">账号类型 *</label>
                <select value={formData.accountType || 'SOCIAL_MEDIA'}
                  onChange={(e) => { handleChange('accountType', e.target.value); handleChange('platform', ''); }}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent">
                  {ACCOUNT_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.icon} {t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">业务线 *</label>
                <select value={formData.businessLine || 'ADULT_PRODUCTS'}
                  onChange={(e) => handleChange('businessLine', e.target.value)} required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent">
                  <option value="ADULT_PRODUCTS">成人用品外贸</option>
                  <option value="MYTH_TOY">MythToy零售</option>
                  <option value="ANTI_FAKE">防伪标签外贸</option>
                  <option value="GENERAL">通用</option>
                </select>
              </div>
              {formData.accountType && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">平台/服务商 *</label>
                  <select value={formData.platform || ''}
                    onChange={(e) => handleChange('platform', e.target.value)} required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent">
                    <option value="">选择平台</option>
                    {(PLATFORM_OPTIONS[formData.accountType] || PLATFORM_OPTIONS.OTHER).map((p) => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  账号标识 *
                  <span className="text-xs text-gray-400 ml-1">
                    {formData.accountType === 'SERVER' ? '(IP地址)' : formData.accountType === 'DATABASE' ? '(Host:Port)' : '(用户名/邮箱/ID)'}
                  </span>
                </label>
                <input type="text" value={formData.accountIdentifier || ''}
                  onChange={(e) => handleChange('accountIdentifier', e.target.value)} required
                  placeholder={formData.accountType === 'SERVER' ? '192.168.1.1' : '用户名/邮箱/账号ID'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">显示名称</label>
                <input type="text" value={formData.displayName || ''}
                  onChange={(e) => handleChange('displayName', e.target.value)}
                  placeholder="便于识别的备注名"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">密码</label>
                <input type="password" value={formData.password || ''}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="密码/Secret"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent" />
              </div>
              {/* 服务器/数据库专用：端口 */}
              {(formData.accountType === 'SERVER' || formData.accountType === 'DATABASE') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    端口 *
                    <span className="text-xs text-gray-400 ml-1">(SSH 22 / MySQL 3306 / Redis 6379)</span>
                  </label>
                  <input type="number" value={formData.port || ''}
                    onChange={(e) => handleChange('port', e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="22"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent" />
                </div>
              )}
            </div>
          </div>

          {/* ===== 用途和状态 ===== */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">用途和状态</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">用途</label>
                <select value={formData.purpose || ''}
                  onChange={(e) => handleChange('purpose', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent">
                  <option value="">选择用途</option>
                  <option value="MARKETING">营销推广</option>
                  <option value="CUSTOMER_SERVICE">客户服务</option>
                  <option value="SALES">销售开发</option>
                  <option value="NOTIFICATION">通知接收</option>
                  <option value="REGISTER">注册/验证</option>
                  <option value="PAYMENT">收款/付款</option>
                  <option value="INFRASTRUCTURE">基础设施</option>
                  <option value="DEVELOPMENT">开发部署</option>
                  <option value="ANALYTICS">数据分析</option>
                  <option value="LOGISTICS">物流/清关</option>
                  <option value="OTHER">其他</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">状态</label>
                <select value={formData.status || 'ACTIVE'}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent">
                  <option value="ACTIVE">正常</option>
                  <option value="INACTIVE">未激活</option>
                  <option value="BANNED">已封禁</option>
                  <option value="SUSPENDED">已暂停</option>
                </select>
              </div>
            </div>
          </div>

          {/* ===== 基础设施字段（云服务/域名/服务器/数据库/开发工具） ===== */}
          {showInfraFields && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">基础设施信息</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">API Key / Access Key ID</label>
                  <input type="text" value={formData.apiKey || ''}
                    onChange={(e) => handleChange('apiKey', e.target.value)}
                    placeholder="AccessKey ID 或 API Key"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-brand focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Secret Key</label>
                  <input type="password" value={formData.secretKey || ''}
                    onChange={(e) => handleChange('secretKey', e.target.value)}
                    placeholder="AccessKey Secret 或 API Secret"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-brand focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">登录/控制台地址</label>
                  <input type="url" value={formData.loginUrl || ''}
                    onChange={(e) => handleChange('loginUrl', e.target.value)}
                    placeholder="https://console.aliyun.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">管理后台地址</label>
                  <input type="url" value={formData.consoleUrl || ''}
                    onChange={(e) => handleChange('consoleUrl', e.target.value)}
                    placeholder="https://dash.cloudflare.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">到期时间</label>
                  <input type="date" value={formData.expiryDate || ''}
                    onChange={(e) => handleChange('expiryDate', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">区域/机房</label>
                  <input type="text" value={formData.region || ''}
                    onChange={(e) => handleChange('region', e.target.value)}
                    placeholder="cn-hangzhou / us-east-1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-transparent" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">关联URL（JSON数组）</label>
                  <input type="text" value={formData.relatedUrls || ''}
                    onChange={(e) => handleChange('relatedUrls', e.target.value)}
                    placeholder='["https://toy-wholesale.com", "https://admin.toy-wholesale.com"]'
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-brand focus:border-transparent" />
                </div>
              </div>
            </div>
          )}

          {/* ===== 附加信息 ===== */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">附加信息</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">项目/产品名称</label>
                <input type="text" value={formData.projectName || ''}
                  onChange={(e) => handleChange('projectName', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">潜客ID</label>
                <input type="number" value={formData.leadId || ''}
                  onChange={(e) => handleChange('leadId', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">备用联系方式</label>
                <input type="text" value={formData.backupContact || ''}
                  onChange={(e) => handleChange('backupContact', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">绑定手机号</label>
                <input type="tel" value={formData.phoneNumber || ''}
                  onChange={(e) => handleChange('phoneNumber', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent" />
              </div>
              {formData.accountType === 'SOCIAL_MEDIA' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">粉丝数</label>
                    <input type="number" value={formData.followersCount || 0}
                      onChange={(e) => handleChange('followersCount', parseInt(e.target.value))} min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">主页链接</label>
                    <input type="url" value={formData.profileUrl || ''}
                      onChange={(e) => handleChange('profileUrl', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent" />
                  </div>
                </>
              )}
              <div className="md:col-span-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.twoFactorEnabled || false}
                    onChange={(e) => handleChange('twoFactorEnabled', e.target.checked)}
                    className="w-4 h-4 text-brand border-gray-300 rounded focus:ring-brand" />
                  <span className="text-sm font-medium text-gray-700">启用双因素认证</span>
                </label>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">备注</label>
                <textarea value={formData.notes || ''}
                  onChange={(e) => handleChange('notes', e.target.value)} rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-transparent" />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4">
            <Link href="/admin/operation-accounts"
              className="px-6 py-2 border border-gray-300 rounded-lg text-text-primary hover:bg-surface transition-colors">取消</Link>
            <button type="submit" disabled={loading}
              className="px-6 py-2 bg-brand text-white rounded-lg hover:bg-brand-hover transition-colors disabled:opacity-50">
              {loading ? '创建中...' : '创建账号'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
