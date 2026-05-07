import KnowledgeNav from '@/components/trade-knowledge/KnowledgeNav';

export const metadata = {
  title: '外贸知识库 | 系统化外贸实战指南',
  description: '系统化的外贸实战指南，涵盖基础知识、报价管理、跟单流程、支付风控、物流通关、产品认证',
};

export default function TradeKnowledgePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-50 to-indigo-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              外贸知识库
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              系统化的外贸实战指南，从入门到精通
            </p>
          </div>
          
          {/* 知识体系导航 */}
          <KnowledgeNav />
        </div>
      </section>
    </div>
  );
}
