export default function QuotationModule() {
  return (
    <section id="quotation" className="py-16 bg-gray-50 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-12">
          <div className="flex items-center mb-4">
            <span className="text-4xl mr-4">💰</span>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">报价管理</h2>
              <p className="text-lg text-gray-600 mt-1">PI模板、成本核算、报价策略、规则表</p>
            </div>
          </div>
        </div>

        {/* 二级导航 */}
        <div className="mb-12 bg-gray-50 rounded-xl p-4">
          <div className="flex flex-wrap gap-3">
            <a href="#pi-template" className="px-4 py-2 bg-white border border-green-200 rounded-lg text-sm font-medium text-green-600 hover:bg-green-50 transition-colors">
              📄 PI模板
            </a>
            <a href="#quotation-rules" className="px-4 py-2 bg-white border border-blue-200 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors">
              📊 规则表
            </a>
            <a href="#cost-calculation" className="px-4 py-2 bg-white border border-purple-200 rounded-lg text-sm font-medium text-purple-600 hover:bg-purple-50 transition-colors">
              🧮 成本核算
            </a>
            <a href="#pricing-strategy" className="px-4 py-2 bg-white border border-orange-200 rounded-lg text-sm font-medium text-orange-600 hover:bg-orange-50 transition-colors">
              🎯 报价策略
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* PI模板 */}
          <div id="pi-template" className="scroll-mt-24 bg-white rounded-xl border-2 border-green-200 p-6 hover:shadow-lg transition-all">
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">📄</span>
              <h3 className="text-xl font-bold text-green-600">PI模板下载</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Proforma Invoice（形式发票）模板，包含标准格式和必填项说明</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">标准PI模板（英文）</p>
                  <p className="text-xs text-gray-600">Word格式，可编辑</p>
                </div>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors">
                  下载
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">简化PI模板</p>
                  <p className="text-xs text-gray-600">适合小单快速报价</p>
                </div>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors">
                  下载
                </button>
              </div>
            </div>
          </div>

          {/* 报价规则表 */}
          <div id="quotation-rules" className="scroll-mt-24 bg-white rounded-xl border-2 border-blue-200 p-6 hover:shadow-lg transition-all">
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">📊</span>
              <h3 className="text-xl font-bold text-blue-600">报价规则表</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">上传和管理您的报价规则，包括利润率、MOQ、价格区间等</p>
            <div className="space-y-3">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m0 0l3 3" />
                </svg>
                <p className="text-sm text-gray-600">点击或拖拽上传Excel文件</p>
                <p className="text-xs text-gray-500 mt-1">支持 .xlsx, .xls 格式</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-600 font-medium">💡 建议包含：产品类别、基础价格、利润率、MOQ、折扣规则</p>
              </div>
            </div>
          </div>

          {/* 成本核算工具 */}
          <div id="cost-calculation" className="scroll-mt-24 bg-white rounded-xl border-2 border-purple-200 p-6 hover:shadow-lg transition-all">
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">🧮</span>
              <h3 className="text-xl font-bold text-purple-600">成本核算公式</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="font-semibold text-gray-900 mb-2">FOB价格计算：</p>
                <code className="text-xs text-purple-700 block">FOB = (产品成本 + 国内运费 + 港杂费) / (1 - 利润率)</code>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="font-semibold text-gray-900 mb-2">CIF价格计算：</p>
                <code className="text-xs text-purple-700 block">CIF = FOB + 海运费 + 保险费</code>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="font-semibold text-gray-900 mb-2">DDP价格计算：</p>
                <code className="text-xs text-purple-700 block">DDP = CIF + 目的港费用 + 关税 + VAT + 内陆运费</code>
              </div>
            </div>
          </div>

          {/* 报价策略 */}
          <div id="pricing-strategy" className="scroll-mt-24 bg-white rounded-xl border-2 border-orange-200 p-6 hover:shadow-lg transition-all">
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">🎯</span>
              <h3 className="text-xl font-bold text-orange-600">报价策略</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold text-gray-900 mb-2">阶梯报价：</p>
                <ul className="text-gray-600 space-y-1 ml-4">
                  <li>• MOQ数量：基础价格</li>
                  <li>• 1000+件：优惠3%</li>
                  <li>• 5000+件：优惠8%</li>
                  <li>• 10000+件：优惠12%</li>
                </ul>
              </div>
              <div className="pt-3 border-t border-orange-200">
                <p className="font-semibold text-gray-900 mb-2">注意事项：</p>
                <ul className="text-gray-600 space-y-1 ml-4">
                  <li>• 报价有效期（通常30天）</li>
                  <li>• 汇率波动条款</li>
                  <li>• 原材料价格调整机制</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
