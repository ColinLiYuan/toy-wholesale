import Link from 'next/link';

export const metadata = {
  title: 'SEO 专题 | 搜索引擎优化指南',
  description: '全面的 SEO 优化指南，包含基础知识、关键词管理、技术优化和内容策略',
};

export default function SeoKnowledgePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-purple-50 to-indigo-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              SEO 专题
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              掌握搜索引擎优化的核心技能，提升网站在 Google 等搜索引擎中的排名和流量
            </p>
          </div>
          
          {/* SEO 知识体系导航 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 max-w-5xl mx-auto">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              SEO 知识体系导航
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link href="/admin/seo-knowledge/basics" className="flex items-start p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg hover:shadow-md transition-all border border-blue-200">
                <span className="text-2xl mr-3">📚</span>
                <div>
                  <span className="text-base font-semibold text-gray-900 block mb-1">SEO 基础知识</span>
                  <span className="text-xs text-gray-600">核心概念、关键词研究、页面优化</span>
                </div>
              </Link>
              <Link href="/admin/seo-keywords" className="flex items-start p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg hover:shadow-md transition-all border border-green-200">
                <span className="text-2xl mr-3">🔍</span>
                <div>
                  <span className="text-base font-semibold text-gray-900 block mb-1">关键词管理</span>
                  <span className="text-xs text-gray-600">关键词库、搜索意图、竞争分析</span>
                </div>
              </Link>
              <Link href="/admin/seo-knowledge/technical" className="flex items-start p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg hover:shadow-md transition-all border border-purple-200">
                <span className="text-2xl mr-3">⚙️</span>
                <div>
                  <span className="text-base font-semibold text-gray-900 block mb-1">技术 SEO</span>
                  <span className="text-xs text-gray-600">网站速度、移动适配、结构化数据</span>
                </div>
              </Link>
              <Link href="/admin/seo-knowledge/content" className="flex items-start p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg hover:shadow-md transition-all border border-orange-200">
                <span className="text-2xl mr-3">✍️</span>
                <div>
                  <span className="text-base font-semibold text-gray-900 block mb-1">内容策略</span>
                  <span className="text-xs text-gray-600">博客文章、内部链接、外链建设</span>
                </div>
              </Link>
              <Link href="/admin/seo-knowledge/analytics" className="flex items-start p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg hover:shadow-md transition-all border border-indigo-200">
                <span className="text-2xl mr-3">📊</span>
                <div>
                  <span className="text-base font-semibold text-gray-900 block mb-1">数据分析</span>
                  <span className="text-xs text-gray-600">Google Analytics、Search Console、排名跟踪</span>
                </div>
              </Link>
              <Link href="/admin/seo-knowledge/international" className="flex items-start p-4 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg hover:shadow-md transition-all border border-teal-200">
                <span className="text-2xl mr-3">🌍</span>
                <div>
                  <span className="text-base font-semibold text-gray-900 block mb-1">国际化 SEO</span>
                  <span className="text-xs text-gray-600">多语言优化、hreflang、本地化策略</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">SEO 快速概览</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
              <div className="text-3xl font-bold text-blue-600 mb-2">70%</div>
              <div className="text-sm text-gray-700">用户通过搜索引擎发现新网站</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
              <div className="text-3xl font-bold text-green-600 mb-2">3x</div>
              <div className="text-sm text-gray-700">有机流量转化率高于付费广告</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
              <div className="text-3xl font-bold text-purple-600 mb-2">93%</div>
              <div className="text-sm text-gray-700">在线体验始于搜索引擎</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
              <div className="text-3xl font-bold text-orange-600 mb-2">53%</div>
              <div className="text-sm text-gray-700">网站流量来自有机搜索</div>
            </div>
          </div>
        </div>
      </section>

      {/* Getting Started Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">开始你的 SEO 之旅</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              无论你是 SEO 新手还是有经验的从业者，这里都有适合你的学习资源
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">初学者入门</h3>
              <p className="text-gray-600 text-sm mb-4">
                从 SEO 基础概念开始，了解搜索引擎工作原理和核心优化技巧
              </p>
              <Link 
                href="/admin/seo-knowledge/basics" 
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                开始学习 →
              </Link>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔧</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">实战工具</h3>
              <p className="text-gray-600 text-sm mb-4">
                使用关键词管理工具和 SEO 分析工具，优化你的网站表现
              </p>
              <Link 
                href="/admin/seo-keywords" 
                className="text-green-600 hover:text-green-700 text-sm font-medium"
              >
                查看工具 →
              </Link>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">进阶优化</h3>
              <p className="text-gray-600 text-sm mb-4">
                深入学习技术 SEO、内容策略和数据分析，提升专业水平
              </p>
              <Link 
                href="/admin/seo-knowledge/technical" 
                className="text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                深入学习 →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
