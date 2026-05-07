import Link from 'next/link';

export default function KnowledgeNav() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-5xl mx-auto">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
        知识体系导航
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/admin/trade-knowledge/basics" className="flex items-start p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg hover:shadow-md transition-all border border-blue-200">
          <span className="text-2xl mr-3">📚</span>
          <div>
            <span className="text-base font-semibold text-gray-900 block mb-1">基础知识</span>
            <span className="text-xs text-gray-600">贸易术语、出口流程、单证详解</span>
          </div>
        </Link>
        <Link href="/admin/trade-knowledge/quotation" className="flex items-start p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg hover:shadow-md transition-all border border-green-200">
          <span className="text-2xl mr-3">💰</span>
          <div>
            <span className="text-base font-semibold text-gray-900 block mb-1">报价管理</span>
            <span className="text-xs text-gray-600">PI模板、成本核算、报价策略</span>
          </div>
        </Link>
        <Link href="/admin/trade-knowledge/order-followup" className="flex items-start p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg hover:shadow-md transition-all border border-purple-200">
          <span className="text-2xl mr-3">📋</span>
          <div>
            <span className="text-base font-semibold text-gray-900 block mb-1">跟单流程</span>
            <span className="text-xs text-gray-600">订单确认、生产跟踪、质量控制</span>
          </div>
        </Link>
        <Link href="/admin/trade-knowledge/payment-risk" className="flex items-start p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg hover:shadow-md transition-all border border-orange-200">
          <span className="text-2xl mr-3">🔒</span>
          <div>
            <span className="text-base font-semibold text-gray-900 block mb-1">支付与风控</span>
            <span className="text-xs text-gray-600">付款方式、风险防范、信用证</span>
          </div>
        </Link>
        <Link href="/admin/trade-knowledge/logistics-customs" className="flex items-start p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg hover:shadow-md transition-all border border-indigo-200">
          <span className="text-2xl mr-3">🚢</span>
          <div>
            <span className="text-base font-semibold text-gray-900 block mb-1">物流与通关</span>
            <span className="text-xs text-gray-600">跨境电商、报关退税、物流方案</span>
          </div>
        </Link>
        <Link href="/admin/trade-knowledge/certifications" className="flex items-start p-4 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg hover:shadow-md transition-all border border-teal-200">
          <span className="text-2xl mr-3">✅</span>
          <div>
            <span className="text-base font-semibold text-gray-900 block mb-1">产品认证</span>
            <span className="text-xs text-gray-600">全球市场准入、合规要求</span>
          </div>
        </Link>
      </div>
    </div>
  );
}
