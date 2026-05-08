export default function LogisticsCustomsModule() {
  return (
    <div className="p-6 lg:p-8">
      {/* 模块标题 */}
      <div className="mb-8 pb-6 border-b border-gray-200">
        <div className="flex items-center mb-3">
          <span className="text-4xl mr-4">🚢</span>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">物流与通关</h2>
            <p className="text-lg text-gray-600 mt-1">跨境电商、报关退税、物流方案、试点政策</p>
          </div>
        </div>
      </div>

      {/* 二级菜单 */}
      <div className="mb-8 bg-gray-50 rounded-xl p-4">
        <div className="flex flex-wrap gap-3">
          <a href="#export-modes" className="px-4 py-2 bg-white border border-red-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
            🚀 出口方式
          </a>
          <a href="#customs-codes" className="px-4 py-2 bg-white border border-indigo-200 rounded-lg text-sm font-medium text-indigo-600 hover:bg-indigo-50 transition-colors">
            ️ 报关方式
          </a>
          <a href="#customs-declaration" className="px-4 py-2 bg-white border border-purple-200 rounded-lg text-sm font-medium text-purple-600 hover:bg-purple-50 transition-colors">
            📋 报关流程
          </a>
          <a href="#logistics-plan" className="px-4 py-2 bg-white border border-blue-200 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors">
            ✈️ 物流方案
          </a>
          <a href="#tax-refund" className="px-4 py-2 bg-white border border-teal-200 rounded-lg text-sm font-medium text-teal-600 hover:bg-teal-50 transition-colors">
            💰 退税指南
          </a>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="space-y-8">
        {/* 1. 报关方式对比（怎么报关） */}
        <div id="customs-codes" className="bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-xl p-6">
          <h3 className="text-xl font-bold text-indigo-900 mb-4">️ 报关方式对比（怎么报关）</h3>
          
          {/* 概念说明 */}
          <div className="bg-indigo-50 rounded-lg p-4 mb-6 border-l-4 border-indigo-500">
            <h4 className="font-semibold text-indigo-900 mb-2 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              什么是报关方式？
            </h4>
            <p className="text-sm text-indigo-800">
              报关方式指的是<strong>用什么监管代码报关</strong>，即向海关申报时使用的贸易方式。
              不同的报关方式对应不同的海关监管代码（如0110、9610等），决定了报关流程、单证要求和退税政策。
            </p>
          </div>

          {/* 报关方式详细对比表 */}
          <div className="bg-white rounded-lg p-5 border-2 border-gray-200 mb-6">
            <h4 className="font-bold text-gray-900 mb-4">📊 报关方式详细对比表</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-indigo-50">
                  <tr>
                    <th className="px-3 py-3 text-left font-semibold">监管代码</th>
                    <th className="px-3 py-3 text-center font-semibold">名称</th>
                    <th className="px-3 py-3 text-center font-semibold">退税情况</th>
                    <th className="px-3 py-3 text-center font-semibold">增值税票</th>
                    <th className="px-3 py-3 text-center font-semibold">适合物流</th>
                    <th className="px-3 py-3 text-center font-semibold">适用场景</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="bg-green-50">
                    <td className="px-3 py-3 font-medium"><span className="px-2 py-1 bg-red-100 text-red-700 rounded">0110</span></td>
                    <td className="px-3 py-3 text-center">一般贸易</td>
                    <td className="px-3 py-3 text-center text-green-600 font-semibold">✅ 可退税</td>
                    <td className="px-3 py-3 text-center">必须有</td>
                    <td className="px-3 py-3 text-center text-sm">海运/空派/海派</td>
                    <td className="px-3 py-3 text-center text-sm">传统B2B批发 ⭐</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-3 font-medium"><span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">9610</span></td>
                    <td className="px-3 py-3 text-center">跨境电商B2C</td>
                    <td className="px-3 py-3 text-center text-green-600 font-semibold">✅ 可退税</td>
                    <td className="px-3 py-3 text-center">需要</td>
                    <td className="px-3 py-3 text-center text-sm">国际快递/空派</td>
                    <td className="px-3 py-3 text-center text-sm">小额零售直邮</td>
                  </tr>
                  <tr className="bg-green-50">
                    <td className="px-3 py-3 font-medium"><span className="px-2 py-1 bg-green-100 text-green-700 rounded">9710</span></td>
                    <td className="px-3 py-3 text-center">跨境电商B2B</td>
                    <td className="px-3 py-3 text-center text-green-600 font-semibold">✅ 可退税</td>
                    <td className="px-3 py-3 text-center">需要</td>
                    <td className="px-3 py-3 text-center text-sm">海运/空派/海派</td>
                    <td className="px-3 py-3 text-center text-sm">电商平台B2B订单</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-3 font-medium"><span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">9810</span></td>
                    <td className="px-3 py-3 text-center">海外仓模式</td>
                    <td className="px-3 py-3 text-center text-green-600 font-semibold">✅ 可退税</td>
                    <td className="px-3 py-3 text-center">需要</td>
                    <td className="px-3 py-3 text-center text-sm">海运整柜/拼箱</td>
                    <td className="px-3 py-3 text-center text-sm">亚马逊FBA备货</td>
                  </tr>
                  <tr className="bg-yellow-50">
                    <td className="px-3 py-3 font-medium"><span className="px-2 py-1 bg-orange-100 text-orange-700 rounded">1039</span></td>
                    <td className="px-3 py-3 text-center">市场采购</td>
                    <td className="px-3 py-3 text-center text-orange-600 font-semibold">⚠️ 免征不退</td>
                    <td className="px-3 py-3 text-center text-orange-600">无需</td>
                    <td className="px-3 py-3 text-center text-sm">海运/陆运</td>
                    <td className="px-3 py-3 text-center text-sm">无票小商品出口</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-3 font-medium"><span className="px-2 py-1 bg-teal-100 text-teal-700 rounded">1210</span></td>
                    <td className="px-3 py-3 text-center">保税电商</td>
                    <td className="px-3 py-3 text-center text-green-600 font-semibold">✅ 可退税</td>
                    <td className="px-3 py-3 text-center">需要</td>
                    <td className="px-3 py-3 text-center text-sm">保税区内配送</td>
                    <td className="px-3 py-3 text-center text-sm">保税备货模式</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 报关方式选择建议 */}
          <div className="bg-white rounded-lg p-5 border-2 border-gray-200">
            <h4 className="font-bold text-gray-900 mb-4">🎯 报关方式选择建议</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">业务场景</th>
                    <th className="px-4 py-3 text-center font-semibold">推荐报关方式</th>
                    <th className="px-4 py-3 text-left font-semibold">原因</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="bg-green-50">
                    <td className="px-4 py-3 font-medium">传统B2B玩具批发 ⭐</td>
                    <td className="px-4 py-3 text-center"><span className="px-2 py-1 bg-red-100 text-red-700 rounded">0110</span></td>
                    <td className="px-4 py-3 text-sm">有增值税票，可退税，流程成熟</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">跨境电商B2C零售</td>
                    <td className="px-4 py-3 text-center"><span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">9610</span></td>
                    <td className="px-4 py-3 text-sm">小额高频，清单核放，通关快</td>
                  </tr>
                  <tr className="bg-green-50">
                    <td className="px-4 py-3 font-medium">跨境电商B2B订单</td>
                    <td className="px-4 py-3 text-center"><span className="px-2 py-1 bg-green-100 text-green-700 rounded">9710</span></td>
                    <td className="px-4 py-3 text-sm">简化申报，优先查验</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">亚马逊FBA备货</td>
                    <td className="px-4 py-3 text-center"><span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">9810</span></td>
                    <td className="px-4 py-3 text-sm">批量出口至海外仓，合规</td>
                  </tr>
                  <tr className="bg-yellow-50">
                    <td className="px-4 py-3 font-medium">无票小商品出口</td>
                    <td className="px-4 py-3 text-center"><span className="px-2 py-1 bg-orange-100 text-orange-700 rounded">1039</span></td>
                    <td className="px-4 py-3 text-sm">免征不退，无需增值税票</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 报关流程详解 */}
        <div id="customs-declaration" className="bg-white border-2 border-purple-200 rounded-xl p-6">
          <h3 className="text-xl font-bold text-purple-900 mb-4">📋 报关流程详解</h3>
          <div className="space-y-6">
            {/* 不同贸易术语下的报关责任 */}
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">不同贸易术语下的报关责任：</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-white rounded-lg p-3">
                  <p className="font-bold text-blue-600 mb-2">FOB / CIF / CFR</p>
                  <p className="text-gray-600">卖方负责出口报关，买方负责进口清关</p>
                  <p className="text-xs text-green-600 mt-1">✅ 最常用</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="font-bold text-blue-600 mb-2">EXW</p>
                  <p className="text-gray-600">买方负责所有报关手续（进出口）</p>
                  <p className="text-xs text-yellow-600 mt-1">⚠️ 卖方责任最小</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="font-bold text-blue-600 mb-2">DAP / DDU</p>
                  <p className="text-gray-600">卖方负责出口报关，运到目的地但不负责进口清关</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="font-bold text-blue-600 mb-2">DDP</p>
                  <p className="text-gray-600">卖方负责所有报关手续（包括进口国）</p>
                  <p className="text-xs text-red-600 mt-1">⚠️ 最复杂</p>
                </div>
              </div>
            </div>

            {/* 出口报关流程 */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">出口报关5步流程：</h4>
              <div className="space-y-3">
                <div className="flex items-start">
                  <span className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">1</span>
                  <div>
                    <p className="font-medium text-gray-900">准备报关资料</p>
                    <p className="text-sm text-gray-600">合同、发票、装箱单、报关委托书、许可证（如需）</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">2</span>
                  <div>
                    <p className="font-medium text-gray-900">电子申报</p>
                    <p className="text-sm text-gray-600">通过中国国际贸易单一窗口录入报关数据，提交电子报关单</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">3</span>
                  <div>
                    <p className="font-medium text-gray-900">海关审单</p>
                    <p className="text-sm text-gray-600">海关审核申报数据（HS编码、价格、数量等），决定是否查验</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">4</span>
                  <div>
                    <p className="font-medium text-gray-900">现场交单/查验</p>
                    <p className="text-sm text-gray-600">如需查验，配合海关开箱检查；查验率通常3-5%</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">5</span>
                  <div>
                    <p className="font-medium text-gray-900">放行装船</p>
                    <p className="text-sm text-gray-600">海关放行后，货物装船出口；1-3天后可打印报关单证明联</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 关键要点 */}
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <h4 className="font-semibold text-gray-900 mb-2">⚠️ 报关关键要点：</h4>
              <ul className="text-sm text-gray-700 space-y-1 ml-4">
                <li>• <strong>HS编码</strong>决定关税税率和退税率，必须准确</li>
                <li>• 报关金额必须与实际交易金额一致</li>
                <li>• 报关单上的商品名称、数量、金额必须与发票一致</li>
                <li>• 旺季提前1-2周订舱，避免舱位紧张</li>
                <li>• 特殊货物（带电、液体、粉末）需提前说明</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 3. 物流方案（含订舱流程） */}
        <div id="logistics-plan" className="bg-white border-2 border-blue-200 rounded-xl p-6">
          <h3 className="text-xl font-bold text-blue-900 mb-4">✈️ 物流方案与订舱流程</h3>
          
          {/* 物流方式详细对比表 */}
          <div className="bg-white rounded-lg p-5 border-2 border-gray-200 mb-8">
            <h4 className="font-bold text-gray-900 mb-4">📊 物流方式详细对比表</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-3 py-3 text-left font-semibold">物流方式</th>
                    <th className="px-3 py-3 text-center font-semibold">时效</th>
                    <th className="px-3 py-3 text-center font-semibold">成本</th>
                    <th className="px-3 py-3 text-center font-semibold">适合重量</th>
                    <th className="px-3 py-3 text-center font-semibold">可退税</th>
                    <th className="px-3 py-3 text-center font-semibold">报关要求</th>
                    <th className="px-3 py-3 text-center font-semibold">适用场景</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="bg-green-50">
                    <td className="px-3 py-3 font-medium">国际快递</td>
                    <td className="px-3 py-3 text-center">3-7天</td>
                    <td className="px-3 py-3 text-center text-red-600">¥50-100/kg</td>
                    <td className="px-3 py-3 text-center">&lt;50kg</td>
                    <td className="px-3 py-3 text-center text-green-600">✅ 可退</td>
                    <td className="px-3 py-3 text-center text-xs">9610/0110</td>
                    <td className="px-3 py-3 text-center text-xs">样品、紧急小包裹</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-3 font-medium">空派专线 ⭐</td>
                    <td className="px-3 py-3 text-center">7-15天</td>
                    <td className="px-3 py-3 text-center text-orange-600">¥30-60/kg</td>
                    <td className="px-3 py-3 text-center">10-500kg</td>
                    <td className="px-3 py-3 text-center text-green-600">✅ 可退</td>
                    <td className="px-3 py-3 text-center text-xs">0110一般贸易</td>
                    <td className="px-3 py-3 text-center text-xs">中等批量B2B ⭐推荐</td>
                  </tr>
                  <tr className="bg-green-50">
                    <td className="px-3 py-3 font-medium">海派专线</td>
                    <td className="px-3 py-3 text-center">20-35天</td>
                    <td className="px-3 py-3 text-center text-green-600">¥8-15/kg</td>
                    <td className="px-3 py-3 text-center">&gt;100kg</td>
                    <td className="px-3 py-3 text-center text-green-600">✅ 可退</td>
                    <td className="px-3 py-3 text-center text-xs">0110一般贸易</td>
                    <td className="px-3 py-3 text-center text-xs">大批量B2B ⭐最常用</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-3 font-medium">海运整柜FCL</td>
                    <td className="px-3 py-3 text-center">20-40天</td>
                    <td className="px-3 py-3 text-center text-green-600">$1500-4000/柜</td>
                    <td className="px-3 py-3 text-center">&gt;15CBM</td>
                    <td className="px-3 py-3 text-center text-green-600">✅ 可退</td>
                    <td className="px-3 py-3 text-center text-xs">0110一般贸易</td>
                    <td className="px-3 py-3 text-center text-xs">超大批量订单</td>
                  </tr>
                  <tr className="bg-yellow-50">
                    <td className="px-3 py-3 font-medium">双清包税专线</td>
                    <td className="px-3 py-3 text-center">15-30天</td>
                    <td className="px-3 py-3 text-center text-orange-600">¥15-40/kg</td>
                    <td className="px-3 py-3 text-center">&gt;50kg</td>
                    <td className="px-3 py-3 text-center text-red-600 font-semibold">❌ 不可退</td>
                    <td className="px-3 py-3 text-center text-xs text-red-600">货代代报</td>
                    <td className="px-3 py-3 text-center text-xs">无进出口权企业</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-3 font-medium">中欧班列</td>
                    <td className="px-3 py-3 text-center">12-18天</td>
                    <td className="px-3 py-3 text-center text-blue-600">¥20-35/kg</td>
                    <td className="px-3 py-3 text-center">&gt;500kg</td>
                    <td className="px-3 py-3 text-center text-green-600">✅ 可退</td>
                    <td className="px-3 py-3 text-center text-xs">0110一般贸易</td>
                    <td className="px-3 py-3 text-center text-xs">欧洲市场大宗货物</td>
                  </tr>
                  <tr className="bg-green-50">
                    <td className="px-3 py-3 font-medium">海运拼箱LCL</td>
                    <td className="px-3 py-3 text-center">25-40天</td>
                    <td className="px-3 py-3 text-center text-green-600">¥10-18/kg</td>
                    <td className="px-3 py-3 text-center">1-15CBM</td>
                    <td className="px-3 py-3 text-center text-green-600">✅ 可退</td>
                    <td className="px-3 py-3 text-center text-xs">0110一般贸易</td>
                    <td className="px-3 py-3 text-center text-xs">中小批量海运</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>💡 提示：</strong>玩具批发最常用的组合是 <span className="px-2 py-1 bg-green-100 text-green-700 rounded">海派 + 0110一般贸易</span>，
                成本低、可退税、时效适中。如果客户急需，可以选择 <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">空派 + 0110一般贸易</span>。
              </p>
            </div>
          </div>

          {/* 空派 vs 海派对比 */}
          <div className="mb-8">
            <h4 className="font-bold text-gray-900 mb-4">📊 空派 vs 海派对比</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 空派 */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-5 border-2 border-blue-200">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">✈️</span>
                  <div>
                    <h4 className="text-lg font-bold text-blue-700">空派（空运+派送）</h4>
                    <p className="text-xs text-gray-600">Air Freight + Local Delivery</p>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-blue-200 pb-2">
                    <span className="text-gray-600">全程时效：</span>
                    <span className="font-bold text-blue-700">7-15天</span>
                  </div>
                  <div className="flex justify-between border-b border-blue-200 pb-2">
                    <span className="text-gray-600">运输成本：</span>
                    <span className="font-bold">¥30-60/kg</span>
                  </div>
                  <div className="flex justify-between border-b border-blue-200 pb-2">
                    <span className="text-gray-600">适合重量：</span>
                    <span className="font-bold">10-500kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">适合场景：</span>
                    <span className="font-bold text-green-600">中等批量B2B</span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-blue-300">
                  <p className="text-xs text-gray-700"><strong>流程：</strong>国内仓 → 空运到目的国 → 清关 → 当地快递/卡车派送</p>
                </div>
              </div>

              {/* 海派 */}
              <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-lg p-5 border-2 border-green-200">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">🚢</span>
                  <div>
                    <h4 className="text-lg font-bold text-green-700">海派（海运+派送）</h4>
                    <p className="text-xs text-gray-600">Sea Freight + Local Delivery</p>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-green-200 pb-2">
                    <span className="text-gray-600">全程时效：</span>
                    <span className="font-bold text-green-700">20-35天</span>
                  </div>
                  <div className="flex justify-between border-b border-green-200 pb-2">
                    <span className="text-gray-600">运输成本：</span>
                    <span className="font-bold">¥8-15/kg</span>
                  </div>
                  <div className="flex justify-between border-b border-green-200 pb-2">
                    <span className="text-gray-600">适合重量：</span>
                    <span className="font-bold">100kg以上</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">适合场景：</span>
                    <span className="font-bold text-green-600">大批量B2B</span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-green-300">
                  <p className="text-xs text-gray-700"><strong>流程：</strong>国内仓 → 海运到目的港 → 清关 → 当地快递/卡车派送</p>
                </div>
              </div>
            </div>
          </div>

          {/* 双清包税说明 */}
          <div className="bg-yellow-50 rounded-lg p-5 border-2 border-yellow-300 mb-8">
            <h4 className="font-bold text-yellow-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              关于“双清包税”专线的重要说明
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-semibold text-green-700 mb-3">✅ 优点</h5>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• 省事：货代代清关，不用自己找报关行</li>
                  <li>• 成本可控：运费=全包价（含关税）</li>
                  <li>• 适合无进出口权的企业</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-red-700 mb-3">❌ 缺点</h5>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li>• <strong>无法退税</strong>（因为不是您自己报关）</li>
                  <li>• 无法抵扣进项税</li>
                  <li>• 财务不透明，无法取得报关单</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-yellow-300 bg-white rounded-lg p-4">
              <p className="text-sm text-red-700 font-bold">
                ⚠️ 重要提醒：如果您的目的是退税，<strong>不要走双清包税</strong>！必须自己报关（0110一般贸易）。
              </p>
            </div>
          </div>

          {/* 订舱流程 */}
          <div className="bg-white border-2 border-green-200 rounded-xl p-6">
            <h4 className="text-xl font-bold text-green-900 mb-4">📦 订舱流程详解</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h5 className="font-semibold text-gray-900 mb-3">订舱步骤：</h5>
                <ol className="space-y-2 ml-4">
                  <li>① 选择货代（对比价格、服务）</li>
                  <li>② 提交订舱委托书</li>
                  <li>③ 货代向船公司订舱</li>
                  <li>④ 获取S/O（装货单）</li>
                  <li>⑤ 安排拖车提货</li>
                  <li>⑥ 报关装船</li>
                </ol>
              </div>
              <div>
                <h5 className="font-semibold text-gray-900 mb-3">关键时间节点：</h5>
                <ul className="space-y-2 ml-4">
                  <li>• <strong>截关时间</strong>：必须在此时间前进场</li>
                  <li>• <strong>截单时间</strong>：提交提单补料截止</li>
                  <li>• <strong>开船时间 (ETD)</strong>：预计开船日期</li>
                  <li>• <strong>到港时间 (ETA)</strong>：预计到港日期</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 物流方案选择建议 */}
          <div className="mt-8 bg-blue-50 rounded-lg p-5 border-2 border-blue-200">
            <h4 className="font-bold text-blue-900 mb-4">📋 物流方案选择建议</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-white">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">订单类型</th>
                    <th className="px-4 py-3 text-center font-semibold">推荐方案</th>
                    <th className="px-4 py-3 text-center font-semibold">报关方式</th>
                    <th className="px-4 py-3 text-center font-semibold">时效</th>
                    <th className="px-4 py-3 text-center font-semibold">是否可退税</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-200">
                  <tr className="bg-white">
                    <td className="px-4 py-3 font-medium">样品/小包裹</td>
                    <td className="px-4 py-3 text-center">国际快递</td>
                    <td className="px-4 py-3 text-center">9610或0110</td>
                    <td className="px-4 py-3 text-center">3-7天</td>
                    <td className="px-4 py-3 text-center text-green-600">✅ 可退</td>
                  </tr>
                  <tr className="bg-green-50">
                    <td className="px-4 py-3 font-medium">中等批量B2B ⭐</td>
                    <td className="px-4 py-3 text-center">空派专线</td>
                    <td className="px-4 py-3 text-center">0110一般贸易</td>
                    <td className="px-4 py-3 text-center">7-15天</td>
                    <td className="px-4 py-3 text-center text-green-600">✅ 可退</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-4 py-3 font-medium">大批量B2B</td>
                    <td className="px-4 py-3 text-center">海派专线</td>
                    <td className="px-4 py-3 text-center">0110一般贸易</td>
                    <td className="px-4 py-3 text-center">20-35天</td>
                    <td className="px-4 py-3 text-center text-green-600">✅ 可退</td>
                  </tr>
                  <tr className="bg-yellow-50">
                    <td className="px-4 py-3 font-medium">亚马逊FBA</td>
                    <td className="px-4 py-3 text-center">海派/空派</td>
                    <td className="px-4 py-3 text-center">9810海外仓</td>
                    <td className="px-4 py-3 text-center">7-35天</td>
                    <td className="px-4 py-3 text-center text-green-600">✅ 可退</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 退税指南 */}
        <div id="tax-refund" className="bg-white border-2 border-teal-200 rounded-xl p-6">
          <h3 className="text-xl font-bold text-teal-900 mb-4">💰 出口退税完全指南</h3>
          <div className="space-y-6">
            {/* 什么是退税 */}
            <div className="bg-teal-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">什么是出口退税？</h4>
              <p className="text-sm text-gray-600 mb-3">
                出口退税是国家为了鼓励出口，将企业在生产环节已经缴纳的增值税退还给企业的政策。
                简单说，就是把你买原材料时交的税退给你，让你的产品以不含税价格参与国际竞争。
              </p>
              <div className="bg-white rounded-lg p-3">
                <p className="text-sm font-semibold text-gray-900 mb-2">举例说明：</p>
                <ul className="text-sm text-gray-700 space-y-1 ml-4">
                  <li>• 你花113元买原材料（其中13元是增值税）</li>
                  <li>• 加工后以200元出口</li>
                  <li>• 如果退税率是13%，你可以退回13元的增值税</li>
                  <li>• 实际成本变成100元，利润增加13元</li>
                </ul>
              </div>
            </div>

            {/* 退税流程 */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">退税7步操作流程：</h4>
              <div className="space-y-3">
                <div className="flex items-start">
                  <span className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">1</span>
                  <div>
                    <p className="font-medium text-gray-900">取得增值税专用发票</p>
                    <p className="text-sm text-gray-600">从供应商处购买原材料时，必须索取增值税专用发票</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">2</span>
                  <div>
                    <p className="font-medium text-gray-900">出口报关并取得报关单</p>
                    <p className="text-sm text-gray-600">货物出口后，海关签发出口货物报关单证明联</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">3</span>
                  <div>
                    <p className="font-medium text-gray-900">收汇并办理外汇核销</p>
                    <p className="text-sm text-gray-600">收到外汇货款后，在银行办理结汇和外汇核销手续</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">4</span>
                  <div>
                    <p className="font-medium text-gray-900">增值税专用发票认证</p>
                    <p className="text-sm text-gray-600">在增值税发票综合服务平台认证进项发票（必须在开具之日起360日内）</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">5</span>
                  <div>
                    <p className="font-medium text-gray-900">准备退税申报材料</p>
                    <p className="text-sm text-gray-600">报关单、增值税专用发票、出口销售合同、银行收汇水单等</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">6</span>
                  <div>
                    <p className="font-medium text-gray-900">电子申报退税</p>
                    <p className="text-sm text-gray-600">通过电子税务局或单一窗口提交退税申报数据</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">7</span>
                  <div>
                    <p className="font-medium text-gray-900">税务审核与退税到账</p>
                    <p className="text-sm text-gray-600">税务局审核（1-3个月），审核通过后退税款打入企业账户</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 退税要点提醒 */}
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <h4 className="font-semibold text-gray-900 mb-2">❗ 退税要点提醒：</h4>
              <ul className="text-sm text-gray-700 space-y-1 ml-4">
                <li>• 必须在报关出口之日起次年4月30日前申报退税</li>
                <li>• 增值税专用发票必须在开具之日起360日内认证</li>
                <li>• 不同商品的退税率不同（0%-13%不等），需提前查询</li>
                <li>• 首次退税可能会实地核查（1-2个月）</li>
                <li>• 报关单上的信息必须与发票完全一致</li>
              </ul>
            </div>

            {/* 退税计算 */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">💡 退税金额计算：</h4>
              <div className="bg-white rounded-lg p-3 text-sm">
                <p className="font-mono text-gray-900 mb-2">退税额 = 增值税专用发票金额 × 退税率</p>
                <p className="text-gray-600">例如：100元的发票，退税率13%，可退13元</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border-2 border-blue-200 rounded-xl p-6">
            <h4 className="font-bold text-blue-600 mb-3">✈️ 国际快递</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li><strong>时效：</strong>3-7天</li>
              <li><strong>适用：</strong>样品、小包裹</li>
              <li><strong>代表：</strong>DHL、FedEx、UPS</li>
            </ul>
          </div>
          <div className="bg-white border-2 border-green-200 rounded-xl p-6">
            <h4 className="font-bold text-green-600 mb-3"> 海运</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li><strong>时效：</strong>20-40天</li>
              <li><strong>适用：</strong>大宗货物</li>
              <li><strong>代表：</strong>FCL整柜、LCL拼箱</li>
            </ul>
          </div>
          <div className="bg-white border-2 border-purple-200 rounded-xl p-6">
            <h4 className="font-bold text-purple-600 mb-3">🚂 中欧班列</h4>
            <ul className="text-sm text-gray-600 space-y-2">
              <li><strong>时效：</strong>12-18天</li>
              <li><strong>适用：</strong>欧洲市场</li>
              <li><strong>代表：</strong>渝新欧、义新欧</li>
            </ul>
          </div>
        </div>

        {/* 国际专线详解 */}
        <div id="logistics-plan" className="bg-white border-2 border-indigo-200 rounded-xl p-6">
          <h3 className="text-xl font-bold text-indigo-900 mb-4">✈️ 国际专线详解（空派/海派）</h3>
          
          {/* 重要概念区分 */}
          <div className="bg-indigo-50 rounded-lg p-4 mb-6 border-l-4 border-indigo-500">
            <h4 className="font-semibold text-indigo-900 mb-2 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              重要概念：国际专线 ≠ 9610
            </h4>
            <ul className="text-sm text-indigo-800 space-y-1 ml-4">
              <li>• <strong>国际专线</strong>是物流方式（货代整合资源的运输线路）</li>
              <li>• <strong>9610</strong>是海关监管代码（报关方式）</li>
              <li>• 国际专线可以配合9610或0110等任何监管方式使用</li>
            </ul>
          </div>

          {/* 空派 vs 海派对比 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* 空派 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-5 border-2 border-blue-200">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">✈️</span>
                <div>
                  <h4 className="text-lg font-bold text-blue-700">空派（空运+派送）</h4>
                  <p className="text-xs text-gray-600">Air Freight + Local Delivery</p>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-blue-200 pb-2">
                  <span className="text-gray-600">全程时效：</span>
                  <span className="font-bold text-blue-700">7-15天</span>
                </div>
                <div className="flex justify-between border-b border-blue-200 pb-2">
                  <span className="text-gray-600">运输成本：</span>
                  <span className="font-bold">¥30-60/kg</span>
                </div>
                <div className="flex justify-between border-b border-blue-200 pb-2">
                  <span className="text-gray-600">适合重量：</span>
                  <span className="font-bold">10-500kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">适合场景：</span>
                  <span className="font-bold text-green-600">中等批量B2B</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-blue-300">
                <p className="text-xs text-gray-700"><strong>流程：</strong>国内仓 → 空运到目的国 → 清关 → 当地快递/卡车派送</p>
              </div>
            </div>

            {/* 海派 */}
            <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-lg p-5 border-2 border-green-200">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">🚢</span>
                <div>
                  <h4 className="text-lg font-bold text-green-700">海派（海运+派送）</h4>
                  <p className="text-xs text-gray-600">Sea Freight + Local Delivery</p>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-green-200 pb-2">
                  <span className="text-gray-600">全程时效：</span>
                  <span className="font-bold text-green-700">20-35天</span>
                </div>
                <div className="flex justify-between border-b border-green-200 pb-2">
                  <span className="text-gray-600">运输成本：</span>
                  <span className="font-bold">¥8-20/kg</span>
                </div>
                <div className="flex justify-between border-b border-green-200 pb-2">
                  <span className="text-gray-600">适合重量：</span>
                  <span className="font-bold">100kg-整柜</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">适合场景：</span>
                  <span className="font-bold text-green-600">大批量B2B</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-green-300">
                <p className="text-xs text-gray-700"><strong>流程：</strong>国内仓 → 海运到目的港 → 清关 → 当地卡车派送</p>
              </div>
            </div>
          </div>

          {/* 双清包税详解 */}
          <div className="bg-yellow-50 rounded-lg p-5 border-2 border-yellow-300 mb-6">
            <h4 className="font-bold text-yellow-900 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              关于"双清包税"专线的重要说明
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-semibold text-green-700 mb-3">✅ 优点</h5>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span>省事：货代代清关，不用自己找报关行</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span>成本可控：运费=全包价（含关税）</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">•</span>
                    <span>适合无进出口权的企业</span>
                  </li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-red-700 mb-3"> 缺点</h5>
                <ul className="text-sm text-gray-700 space-y-2">
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">•</span>
                    <span><strong>无法退税</strong>（因为不是您自己报关）</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">•</span>
                    <span>无法抵扣进项税</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">•</span>
                    <span>财务不透明，无法取得报关单</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-yellow-300 bg-white rounded-lg p-4">
              <p className="text-sm text-red-700 font-bold flex items-start">
                <span className="text-xl mr-2">️</span>
                <span>重要提醒：如果您的目的是退税，<strong>不要走双清包税</strong>！应该自己找报关行按0110一般贸易报关，取得报关单和增值税发票后申请退税。</span>
              </p>
            </div>
          </div>

          {/* 物流方案选择建议 */}
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h4 className="font-bold text-gray-900 mb-4"> 玩具批发物流方案选择建议</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-white">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">订单类型</th>
                    <th className="px-4 py-3 text-center font-semibold">推荐方案</th>
                    <th className="px-4 py-3 text-center font-semibold">报关方式</th>
                    <th className="px-4 py-3 text-center font-semibold">时效</th>
                    <th className="px-4 py-3 text-center font-semibold">是否可退税</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="bg-white">
                    <td className="px-4 py-3 font-medium">样品/小批量</td>
                    <td className="px-4 py-3 text-center">国际快递</td>
                    <td className="px-4 py-3 text-center">快递报关</td>
                    <td className="px-4 py-3 text-center">3-7天</td>
                    <td className="px-4 py-3 text-center text-yellow-600">视情况</td>
                  </tr>
                  <tr className="bg-green-50">
                    <td className="px-4 py-3 font-medium text-green-700">中等批量B2B </td>
                    <td className="px-4 py-3 text-center font-bold text-green-700">空派专线</td>
                    <td className="px-4 py-3 text-center font-bold text-green-700">0110一般贸易</td>
                    <td className="px-4 py-3 text-center">7-15天</td>
                    <td className="px-4 py-3 text-center text-green-600 font-bold">✅ 可退税</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-4 py-3 font-medium">大批量B2B</td>
                    <td className="px-4 py-3 text-center">海派专线</td>
                    <td className="px-4 py-3 text-center">0110一般贸易</td>
                    <td className="px-4 py-3 text-center">20-35天</td>
                    <td className="px-4 py-3 text-center text-green-600">✅ 可退税</td>
                  </tr>
                  <tr className="bg-yellow-50">
                    <td className="px-4 py-3 font-medium">亚马逊FBA</td>
                    <td className="px-4 py-3 text-center">空派/海派专线</td>
                    <td className="px-4 py-3 text-center">9710/9810</td>
                    <td className="px-4 py-3 text-center">7-35天</td>
                    <td className="px-4 py-3 text-center text-green-600">✅ 可退税</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800 font-semibold"> 最优方案：国际专线（运输）+ 0110一般贸易（报关）= 性价比最高 + 可退税</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
