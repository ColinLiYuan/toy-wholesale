export default function PaymentRiskModule() {
  return (
    <section id="payment-risk" className="py-16 bg-gray-50 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-12">
          <div className="flex items-center mb-4">
            <span className="text-4xl mr-4">🔒</span>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">支付与风控</h2>
              <p className="text-lg text-gray-600 mt-1">付款方式、风险防范、信用证操作、诈骗识别</p>
            </div>
          </div>
        </div>

        {/* 二级导航 */}
        <div className="mb-12 bg-gray-50 rounded-xl p-4">
          <div className="flex flex-wrap gap-3">
            <a href="#payment-methods" className="px-4 py-2 bg-white border border-orange-200 rounded-lg text-sm font-medium text-orange-600 hover:bg-orange-50 transition-colors">
              💳 付款方式
            </a>
            <a href="#risk-prevention" className="px-4 py-2 bg-white border border-red-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
              ⚠️ 风险防范
            </a>
            <a href="#lc-operation" className="px-4 py-2 bg-white border border-blue-200 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors">
              📋 信用证操作
            </a>
            <a href="#fraud-alert" className="px-4 py-2 bg-white border border-yellow-200 rounded-lg text-sm font-medium text-yellow-600 hover:bg-yellow-50 transition-colors">
              🚨 诈骗识别
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* 付款方式对比 */}
          <div id="payment-methods" className="scroll-mt-24 bg-white rounded-xl border-2 border-orange-200 p-6">
            <h3 className="text-xl font-bold text-orange-600 mb-4">常见付款方式对比</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-orange-50">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-gray-900">方式</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-900">风险</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-900">适用</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr><td className="px-3 py-2 font-medium">T/T 前TT</td><td className="px-3 py-2 text-green-600">最低</td><td className="px-3 py-2">样品单、小单</td></tr>
                  <tr><td className="px-3 py-2 font-medium">T/T 30%定金</td><td className="px-3 py-2 text-green-600">低</td><td className="px-3 py-2">最常用</td></tr>
                  <tr><td className="px-3 py-2 font-medium">L/C 信用证</td><td className="px-3 py-2 text-yellow-600">中</td><td className="px-3 py-2">大额订单</td></tr>
                  <tr><td className="px-3 py-2 font-medium">D/P 付款交单</td><td className="px-3 py-2 text-red-600">高</td><td className="px-3 py-2">老客户</td></tr>
                  <tr><td className="px-3 py-2 font-medium">O/A 赊销</td><td className="px-3 py-2 text-red-600">最高</td><td className="px-3 py-2">跨国公司</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 风险防范要点 */}
          <div id="risk-prevention" className="scroll-mt-24 bg-white rounded-xl border-2 border-red-200 p-6">
            <h3 className="text-xl font-bold text-red-600 mb-4">⚠️ 风险防范要点</h3>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-red-50 rounded-lg">
                <p className="font-semibold text-gray-900 mb-2">客户资信调查：</p>
                <ul className="text-gray-600 space-y-1 ml-4">
                  <li>• 查询公司注册信息</li>
                  <li>• 检查官方网站和社交媒体</li>
                  <li>• 通过海关数据验证</li>
                  <li>• 要求提供银行推荐信</li>
                </ul>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <p className="font-semibold text-gray-900 mb-2">常见诈骗手法：</p>
                <ul className="text-gray-600 space-y-1 ml-4">
                  <li>• 钓鱼邮件冒充客户</li>
                  <li>• 篡改银行账户信息</li>
                  <li>• 虚假付款凭证</li>
                  <li>• 第三方付款陷阱</li>
                </ul>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-xs text-yellow-800 font-medium">💡 重要提醒：任何变更银行账户的要求，必须通过电话二次确认！</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
