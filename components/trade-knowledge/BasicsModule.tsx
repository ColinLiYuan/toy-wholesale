export default function BasicsModule() {
  return (
    <section id="basics" className="py-16 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-12">
          <div className="flex items-center mb-4">
            <span className="text-4xl mr-4">📚</span>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">基础知识</h2>
              <p className="text-lg text-gray-600 mt-1">国际贸易术语、出口流程、单证详解</p>
            </div>
          </div>
        </div>

        {/* 二级导航 */}
        <div className="mb-12 bg-gray-50 rounded-xl p-4">
          <div className="flex flex-wrap gap-3">
            <a href="#trade-terms" className="px-4 py-2 bg-white border border-blue-200 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors">
              📋 贸易术语
            </a>
            <a href="#export-modes" className="px-4 py-2 bg-white border border-red-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
              🚀 出口方式
            </a>
            <a href="#customs-codes" className="px-4 py-2 bg-white border border-orange-200 rounded-lg text-sm font-medium text-orange-600 hover:bg-orange-50 transition-colors">
              🏛️ 监管代码
            </a>
            <a href="#logistics" className="px-4 py-2 bg-white border border-green-200 rounded-lg text-sm font-medium text-green-600 hover:bg-green-50 transition-colors">
              🚚 国际物流
            </a>
            <a href="#documents" className="px-4 py-2 bg-white border border-pink-200 rounded-lg text-sm font-medium text-pink-600 hover:bg-pink-50 transition-colors">
              📄 单证管理
            </a>
          </div>
        </div>

        {/* Trade Terms */}
        <div id="trade-terms" className="mb-16 scroll-mt-24">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
            国际贸易术语（成交方式）
          </h3>

          {/* 术语说明 */}
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6 mb-8">
            <h4 className="font-bold text-blue-900 mb-2 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              名词解释
            </h4>
            <div className="text-sm text-blue-800 space-y-2">
              <p><strong>官方名称：</strong>国际贸易术语（Incoterms - International Commercial Terms）</p>
              <p><strong>行业俗称：</strong>成交方式、贸易条款、价格条款</p>
              <p><strong>发布机构：</strong>国际商会（ICC）</p>
              <p><strong>最新版本：</strong>Incoterms® 2020</p>
              <p className="mt-3 pt-3 border-t border-blue-200">
                <strong>💡 为什么有两个名字？</strong>国际贸易中称为“术语”，规定了买卖双方的责任、风险和费用划分；国内财务和业务习惯称为“成交方式”，用于报价和做账。
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* EXW */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-blue-600">EXW</h3>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">工厂交货</span>
              </div>
              <p className="text-sm text-gray-600 mb-4 font-medium">Ex Works (named place)</p>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-gray-900 mb-1">卖方责任：</p>
                  <p className="text-gray-600">在工厂或仓库将货物准备好，买方负责所有运输和出口手续</p>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">💡 价格最低，但买方承担最多风险和责任</p>
                </div>
              </div>
            </div>

            {/* FOB */}
            <div className="bg-white border-2 border-blue-500 rounded-xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-blue-600">FOB</h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">最常用</span>
              </div>
              <p className="text-sm text-gray-600 mb-4 font-medium">Free On Board (named port of shipment)</p>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-gray-900 mb-1">卖方责任：</p>
                  <p className="text-gray-600">负责将货物运到装运港并装上船，承担装船前的所有费用和风险</p>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">💡 中国出口最常用的贸易术语</p>
                </div>
              </div>
            </div>

            {/* CIF */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-blue-600">CIF</h3>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">成本+保险+运费</span>
              </div>
              <p className="text-sm text-gray-600 mb-4 font-medium">Cost, Insurance and Freight</p>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-gray-900 mb-1">卖方责任：</p>
                  <p className="text-gray-600">负责货物运到目的港的运费和保险费，但风险在装运港装船后转移</p>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">💡 适合买方不熟悉海运保险的情况</p>
                </div>
              </div>
            </div>

            {/* CFR */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-blue-600">CFR</h3>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">成本+运费</span>
              </div>
              <p className="text-sm text-gray-600 mb-4 font-medium">Cost and Freight</p>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-gray-900 mb-1">卖方责任：</p>
                  <p className="text-gray-600">负责货物运到目的港的运费，但不包括保险</p>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">💡 介于FOB和CIF之间</p>
                </div>
              </div>
            </div>

            {/* DDP */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-blue-600">DDP</h3>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">完税后交货</span>
              </div>
              <p className="text-sm text-gray-600 mb-4 font-medium">Delivered Duty Paid</p>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-gray-900 mb-1">卖方责任：</p>
                  <p className="text-gray-600">负责将所有费用和风险承担到买方指定地点，包括进口清关和关税</p>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">💡 卖方承担最大责任和风险，价格最高</p>
                </div>
              </div>
            </div>

            {/* DAP */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-blue-600">DAP</h3>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">目的地交货</span>
              </div>
              <p className="text-sm text-gray-600 mb-4 font-medium">Delivered at Place</p>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-gray-900 mb-1">卖方责任：</p>
                  <p className="text-gray-600">负责将货物运到买方指定地点，但不负责进口清关和关税</p>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">💡 比DDP简单，卖方不负责进口国的税费</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Export Modes */}
        <div id="export-modes" className="mb-16 scroll-mt-24">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
            出口方式对比（谁来做出口）
          </h3>

          {/* 概念说明 */}
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 mb-8">
            <h4 className="font-bold text-red-900 mb-2 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              什么是出口方式？
            </h4>
            <p className="text-sm text-red-800 mb-2">
              出口方式指的是<strong>谁来做出口业务</strong>，即由谁来办理出口手续、谁来承担出口责任。
            </p>
            <p className="text-sm text-red-800">
              <strong>关键区别：</strong>出口方式决定报关单上的"经营单位"和"发货单位"如何填写，以及退税款的归属。
            </p>
          </div>

          <div className="overflow-x-auto mb-8">
            <table className="min-w-full text-sm">
              <thead className="bg-red-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">对比项</th>
                  <th className="px-4 py-3 text-center font-semibold text-green-700">自营出口</th>
                  <th className="px-4 py-3 text-center font-semibold text-blue-700">代理出口</th>
                  <th className="px-4 py-3 text-center font-semibold text-orange-700">1039市场采购</th>
                  <th className="px-4 py-3 text-center font-semibold text-red-700">买单出口</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-3 font-medium">定义</td>
                  <td className="px-4 py-3 text-center text-sm">自己公司有进出口权，自己办理出口</td>
                  <td className="px-4 py-3 text-center text-sm">委托外贸代理公司代办出口</td>
                  <td className="px-4 py-3 text-center text-sm">在市场集聚区采购，由符合条件的经营者出口</td>
                  <td className="px-4 py-3 text-center text-sm">借用他人进出口权出口（灰色）</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 font-medium">货主（实际所有者）</td>
                  <td className="px-4 py-3 text-center text-sm">自己公司</td>
                  <td className="px-4 py-3 text-center text-sm">自己公司（委托方）</td>
                  <td className="px-4 py-3 text-center text-sm">市场采购经营者</td>
                  <td className="px-4 py-3 text-center text-sm">不确定（通常隐瞒）</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">报关单经营单位</td>
                  <td className="px-4 py-3 text-center text-sm">自己公司</td>
                  <td className="px-4 py-3 text-center text-sm">代理公司</td>
                  <td className="px-4 py-3 text-center text-sm">市场采购经营者</td>
                  <td className="px-4 py-3 text-center text-sm">卖单方（非实际货主）</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 font-medium">报关单发货单位</td>
                  <td className="px-4 py-3 text-center text-sm">自己公司</td>
                  <td className="px-4 py-3 text-center text-sm">自己公司（实际货主）</td>
                  <td className="px-4 py-3 text-center text-sm">市场采购经营者</td>
                  <td className="px-4 py-3 text-center text-sm">与经营单位一致（虚假）</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">合法性</td>
                  <td className="px-4 py-3 text-center text-green-600 font-semibold">✅ 合法</td>
                  <td className="px-4 py-3 text-center text-green-600 font-semibold">✅ 合法（需代理协议）</td>
                  <td className="px-4 py-3 text-center text-green-600 font-semibold">✅ 政策支持</td>
                  <td className="px-4 py-3 text-center text-red-600 font-semibold">❌ 灰色/违法</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 font-medium">退税</td>
                  <td className="px-4 py-3 text-center text-green-600 font-semibold">✅ 可退（退给自己）</td>
                  <td className="px-4 py-3 text-center text-green-600 font-semibold">✅ 可退（代理代退后转交）</td>
                  <td className="px-4 py-3 text-center text-orange-600 font-semibold">⚠️ 免征不退</td>
                  <td className="px-4 py-3 text-center text-red-600 font-semibold">❌ 不可退</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">增值税票要求</td>
                  <td className="px-4 py-3 text-center">必须有</td>
                  <td className="px-4 py-3 text-center">必须有</td>
                  <td className="px-4 py-3 text-center text-orange-600">无需</td>
                  <td className="px-4 py-3 text-center text-red-600">通常无票</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 font-medium">资金流向</td>
                  <td className="px-4 py-3 text-center text-sm">客户→自己公司</td>
                  <td className="px-4 py-3 text-center text-sm">客户→代理→自己公司</td>
                  <td className="px-4 py-3 text-center text-sm">客户→市场采购经营者</td>
                  <td className="px-4 py-3 text-center text-sm">私下转账（不透明）</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium">适用场景</td>
                  <td className="px-4 py-3 text-center text-sm">有进出口权的大中型企业</td>
                  <td className="px-4 py-3 text-center text-sm">无进出口权的小型企业 ⭐推荐</td>
                  <td className="px-4 py-3 text-center text-sm">小商品市场、无票货物</td>
                  <td className="px-4 py-3 text-center text-sm text-red-600 font-semibold">❌ 不推荐，有风险</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-3 font-medium">对应报关方式</td>
                  <td className="px-4 py-3 text-center"><span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">0110</span></td>
                  <td className="px-4 py-3 text-center"><span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">0110</span></td>
                  <td className="px-4 py-3 text-center"><span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">1039</span></td>
                  <td className="px-4 py-3 text-center text-red-600">不确定</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 代理出口详细说明 */}
          <div className="bg-blue-50 rounded-lg p-5 border-2 border-blue-300 mb-8">
            <h4 className="font-bold text-blue-900 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              💡 重点说明：代理出口的单证关系
            </h4>
            <div className="space-y-3 text-sm text-blue-900">
              <p><strong>为什么代理出口是合法的？</strong></p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>报关单双单位制：</strong>经营单位填代理公司，发货单位填实际货主（自己公司），两者都如实申报</li>
                <li><strong>正式代理协议：</strong>签订《代理出口协议》，明确双方权利义务，税务局认可</li>
                <li><strong>单证可追溯：</strong>通过代理协议将报关单、增值税发票、收汇凭证关联起来</li>
                <li><strong>资金流清晰：</strong>外汇→代理公司→扣除代理费→转给实际货主，全程可查</li>
              </ul>
              
              <div className="mt-4 bg-white rounded-lg p-4 border border-blue-200">
                <p className="font-semibold mb-2">📋 代理出口完整流程示例：</p>
                <ol className="list-decimal list-inside space-y-2 ml-4">
                  <li>A公司（无进出口权）与B代理公司签订《代理出口协议》</li>
                  <li>B公司以自己名义报关，报关单显示：经营单位=B公司，发货单位=A公司</li>
                  <li>A公司提供增值税发票（开票方=A公司或A的供应商）</li>
                  <li>国外客户付款到B公司账户，B公司结汇</li>
                  <li>B公司向税务局申请退税（提交：报关单+增值税票+代理协议）</li>
                  <li>退税款到B公司账户，B扣除代理费（1-3%）后将余款转给A公司</li>
                </ol>
              </div>

              <div className="mt-4 bg-yellow-50 rounded-lg p-4 border border-yellow-300">
                <p className="font-semibold text-yellow-900 mb-2">⚠️ 代理出口 vs 买单出口的本质区别：</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold text-green-700 mb-2">✅ 代理出口（合法）：</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>有正式代理协议</li>
                      <li>报关单如实填写两个单位</li>
                      <li>增值税发票抬头与发货单位一致</li>
                      <li>资金通过代理公司正规流转</li>
                      <li>可以正常退税</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-red-700 mb-2">❌ 买单出口（非法）：</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>无协议或虚假协议</li>
                      <li>只写卖单方，隐瞒实际货主</li>
                      <li>发票抬头与报关单不一致或无票</li>
                      <li>私下转账，无法监管</li>
                      <li>无法退税，有税务风险</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customs Codes */}
        <div id="customs-codes" className="mb-16 scroll-mt-24">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
            海关监管代码（报关方式）
          </h3>

          {/* 监管代码说明 */}
          <div className="bg-orange-50 border-l-4 border-orange-500 rounded-lg p-6 mb-8">
            <h4 className="font-bold text-orange-900 mb-2 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              名词解释
            </h4>
            <div className="text-sm text-orange-800 space-y-2">
              <p><strong>官方名称：</strong>海关监管方式代码（Customs Supervision Code）</p>
              <p><strong>行业俗称：</strong>报关方式、贸易方式、出口模式</p>
              <p><strong>发布机构：</strong>中国海关总署</p>
              <p className="mt-3 pt-3 border-t border-orange-200">
                <strong>💡 为什么有两个名字？</strong>海关为了统计和监管，给不同的进出口行为编了代码；企业关心的是“我怎么报关能退税”，所以习惯叫“报关方式”。
              </p>
            </div>
          </div>

          {/* 监管代码卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* 0110 */}
            <div className="bg-white border-2 border-orange-500 rounded-xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-orange-600">0110</h3>
                <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-full">最常用</span>
              </div>
              <p className="text-sm text-gray-600 mb-4 font-medium">一般贸易</p>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-gray-900 mb-1">适用场景：</p>
                  <p className="text-gray-600">传统B2B贸易，有进出口权的企业，正规报关退税</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">特点：</p>
                  <ul className="text-gray-600 list-disc list-inside">
                    <li>需要增值税发票</li>
                    <li>可享受出口退税</li>
                    <li>报关手续完整</li>
                  </ul>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-orange-600 font-semibold">💡 玩具批发B2B首选方式</p>
                </div>
              </div>
            </div>

            {/* 9610 */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-orange-500 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-orange-600">9610</h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">跨境电商B2C</span>
              </div>
              <p className="text-sm text-gray-600 mb-4 font-medium">跨境贸易电子商务</p>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-gray-900 mb-1">适用场景：</p>
                  <p className="text-gray-600">跨境电商零售出口，碎片化订单，小包发货</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">特点：</p>
                  <ul className="text-gray-600 list-disc list-inside">
                    <li>清单核放、汇总申报</li>
                    <li>无票免税政策</li>
                    <li>需要三单对碰</li>
                  </ul>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">⚠️ 仅适用于B2C，不适合传统B2B</p>
                </div>
              </div>
            </div>

            {/* 9710 */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-orange-500 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-orange-600">9710</h3>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">跨境电商B2B直接出口</span>
              </div>
              <p className="text-sm text-gray-600 mb-4 font-medium">跨境电商B2B直接出口</p>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-gray-900 mb-1">适用场景：</p>
                  <p className="text-gray-600">跨境电商企业通过跨境电商平台达成的交易，直接出口给境外企业</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">特点：</p>
                  <ul className="text-gray-600 list-disc list-inside">
                    <li>适用于B2B模式</li>
                    <li>可通过跨境电商平台交易</li>
                    <li>享受便利化措施</li>
                  </ul>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">💡 适合跨境电商B2B业务</p>
                </div>
              </div>
            </div>

            {/* 9810 */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-orange-500 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-orange-600">9810</h3>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full">跨境电商出口海外仓</span>
              </div>
              <p className="text-sm text-gray-600 mb-4 font-medium">跨境电商出口海外仓</p>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-gray-900 mb-1">适用场景：</p>
                  <p className="text-gray-600">跨境电商企业将货物出口至海外仓，通过跨境电商平台销售</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">特点：</p>
                  <ul className="text-gray-600 list-disc list-inside">
                    <li>批量出口至海外仓</li>
                    <li>境外本地发货</li>
                    <li>适合亚马逊FBA等模式</li>
                  </ul>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">💡 适合海外仓备货模式</p>
                </div>
              </div>
            </div>

            {/* 1039 */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-orange-500 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-orange-600">1039</h3>
                <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm rounded-full">市场采购</span>
              </div>
              <p className="text-sm text-gray-600 mb-4 font-medium">市场采购贸易方式</p>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-gray-900 mb-1">适用场景：</p>
                  <p className="text-gray-600">在国家认定的市场集聚区采购商品，由符合条件的经营者出口</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">特点：</p>
                  <ul className="text-gray-600 list-disc list-inside">
                    <li>免征不退（免增值税、消费税，但不退税）</li>
                    <li>无需增值税发票</li>
                    <li>允许无票出口</li>
                  </ul>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-orange-600 font-semibold">⚠️ 限试点地区（义乌、广州等）</p>
                </div>
              </div>
            </div>

            {/* 1210 */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-orange-500 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-orange-600">1210</h3>
                <span className="px-3 py-1 bg-teal-100 text-teal-700 text-sm rounded-full">保税电商</span>
              </div>
              <p className="text-sm text-gray-600 mb-4 font-medium">保税跨境贸易电子商务</p>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold text-gray-900 mb-1">适用场景：</p>
                  <p className="text-gray-600">货物先入保税区，再根据订单清关配送给消费者</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 mb-1">特点：</p>
                  <ul className="text-gray-600 list-disc list-inside">
                    <li>保税备货模式</li>
                    <li>快速配送（国内发货）</li>
                    <li>需保税区仓库资质</li>
                  </ul>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">💡 适合跨境电商进口业务</p>
                </div>
              </div>
            </div>
          </div>


        </div>

        {/* International Logistics */}
        <div id="logistics" className="mb-16 scroll-mt-24">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">4</span>
            国际物流方式详解
          </h3>

          {/* 物流方式说明 */}
          <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-6 mb-8">
            <h4 className="font-bold text-green-900 mb-2 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              重要概念区分
            </h4>
            <div className="text-sm text-green-800 space-y-3">
              <p><strong>国际专线 ≠ 9610</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><strong>国际专线</strong>是物流方式（货代整合资源的运输线路）</li>
                <li><strong>9610</strong>是海关监管代码（报关方式）</li>
                <li>国际专线可以配合9610或0110等任何监管方式使用</li>
              </ul>
              <p className="mt-3 pt-3 border-t border-green-200">
                <strong> 玩具批发B2B建议：</strong>国际专线（运输）+ 0110一般贸易（报关）= 最优方案
              </p>
            </div>
          </div>

          {/* 物流方式卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* 国际快递 */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-green-500 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-green-600">国际快递</h3>
                <span className="text-2xl">✈️</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">DHL / FedEx / UPS / TNT</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">时效：</span>
                  <span className="font-semibold">3-7天</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">成本：</span>
                  <span className="font-semibold">¥80-150/kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">适合重量：</span>
                  <span className="font-semibold">&lt;30kg</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500">✅ 适合样品、紧急小件</p>
              </div>
            </div>

            {/* 空派专线 */}
            <div className="bg-white border-2 border-blue-500 rounded-xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-blue-600">空派专线</h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">推荐</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">空运+当地派送</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">时效：</span>
                  <span className="font-semibold">7-15天</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">成本：</span>
                  <span className="font-semibold">¥30-60/kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">适合重量：</span>
                  <span className="font-semibold">10-500kg</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-200">
                <p className="text-xs text-blue-600 font-semibold">✅ 性价比高，适合中等批量B2B订单</p>
              </div>
            </div>

            {/* 海派专线 */}
            <div className="bg-white border-2 border-green-500 rounded-xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-green-600">海派专线</h3>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">最常用</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">海运+当地派送</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">时效：</span>
                  <span className="font-semibold">20-35天</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">成本：</span>
                  <span className="font-semibold">¥8-15/kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">适合重量：</span>
                  <span className="font-semibold">&gt;100kg</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-200">
                <p className="text-xs text-green-600 font-semibold">✅ 成本最低，适合大批量B2B订单</p>
              </div>
            </div>

            {/* 海运整柜FCL */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-green-500 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-green-600">海运整柜FCL</h3>
                <span className="text-2xl">🚢</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">Full Container Load</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">时效：</span>
                  <span className="font-semibold">20-40天</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">成本：</span>
                  <span className="font-semibold">$1500-4000/柜</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">适合体积：</span>
                  <span className="font-semibold">&gt;15CBM</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500">✅ 适合超大批量订单，单位成本最低</p>
              </div>
            </div>

            {/* 海运拼箱LCL */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-green-500 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-green-600">海运拼箱LCL</h3>
                <span className="text-2xl">📦</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">Less than Container Load</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">时效：</span>
                  <span className="font-semibold">25-40天</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">成本：</span>
                  <span className="font-semibold">¥10-18/kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">适合体积：</span>
                  <span className="font-semibold">1-15CBM</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500">✅ 适合中小批量海运，比整柜灵活</p>
              </div>
            </div>

            {/* 中欧班列 */}
            <div className="bg-white border-2 border-purple-200 rounded-xl p-6 hover:border-purple-500 hover:shadow-lg transition-all">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-purple-600">中欧班列</h3>
                <span className="text-2xl">🚂</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">铁路联运</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">时效：</span>
                  <span className="font-semibold">12-18天</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">成本：</span>
                  <span className="font-semibold">¥20-35/kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">适合重量：</span>
                  <span className="font-semibold">&gt;500kg</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-200">
                <p className="text-xs text-purple-600 font-semibold">✅ 时效和成本的平衡，适合欧洲市场</p>
              </div>
            </div>
          </div>

          {/* 完整物流方式对比表 */}
          <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-8">
            <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              完整物流方式对比表
            </h4>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-green-50">
                  <tr>
                    <th className="px-3 py-3 text-left font-semibold">物流方式</th>
                    <th className="px-3 py-3 text-center font-semibold">时效</th>
                    <th className="px-3 py-3 text-center font-semibold">成本</th>
                    <th className="px-3 py-3 text-center font-semibold">适合重量/体积</th>
                    <th className="px-3 py-3 text-center font-semibold">可退税</th>
                    <th className="px-3 py-3 text-center font-semibold">适用场景</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="bg-green-50">
                    <td className="px-3 py-3 font-medium">国际快递</td>
                    <td className="px-3 py-3 text-center">3-7天</td>
                    <td className="px-3 py-3 text-center text-red-600">¥80-150/kg</td>
                    <td className="px-3 py-3 text-center">&lt;30kg</td>
                    <td className="px-3 py-3 text-center text-green-600">✅ 可退</td>
                    <td className="px-3 py-3 text-center text-xs">样品、紧急小件</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-3 font-medium">空派专线 ⭐</td>
                    <td className="px-3 py-3 text-center">7-15天</td>
                    <td className="px-3 py-3 text-center text-orange-600">¥30-60/kg</td>
                    <td className="px-3 py-3 text-center">10-500kg</td>
                    <td className="px-3 py-3 text-center text-green-600">✅ 可退</td>
                    <td className="px-3 py-3 text-center text-xs">中等批量B2B ⭐推荐</td>
                  </tr>
                  <tr className="bg-green-50">
                    <td className="px-3 py-3 font-medium">海派专线</td>
                    <td className="px-3 py-3 text-center">20-35天</td>
                    <td className="px-3 py-3 text-center text-green-600">¥8-15/kg</td>
                    <td className="px-3 py-3 text-center">&gt;100kg</td>
                    <td className="px-3 py-3 text-center text-green-600">✅ 可退</td>
                    <td className="px-3 py-3 text-center text-xs">大批量B2B ⭐最常用</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-3 font-medium">海运整柜FCL</td>
                    <td className="px-3 py-3 text-center">20-40天</td>
                    <td className="px-3 py-3 text-center text-green-600">$1500-4000/柜</td>
                    <td className="px-3 py-3 text-center">&gt;15CBM</td>
                    <td className="px-3 py-3 text-center text-green-600">✅ 可退</td>
                    <td className="px-3 py-3 text-center text-xs">超大批量订单</td>
                  </tr>
                  <tr className="bg-green-50">
                    <td className="px-3 py-3 font-medium">海运拼箱LCL</td>
                    <td className="px-3 py-3 text-center">25-40天</td>
                    <td className="px-3 py-3 text-center text-green-600">¥10-18/kg</td>
                    <td className="px-3 py-3 text-center">1-15CBM</td>
                    <td className="px-3 py-3 text-center text-green-600">✅ 可退</td>
                    <td className="px-3 py-3 text-center text-xs">中小批量海运</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-3 font-medium">中欧班列</td>
                    <td className="px-3 py-3 text-center">12-18天</td>
                    <td className="px-3 py-3 text-center text-blue-600">¥20-35/kg</td>
                    <td className="px-3 py-3 text-center">&gt;500kg</td>
                    <td className="px-3 py-3 text-center text-green-600">✅ 可退</td>
                    <td className="px-3 py-3 text-center text-xs">欧洲市场大宗货物</td>
                  </tr>
                  <tr className="bg-yellow-50">
                    <td className="px-3 py-3 font-medium">双清包税专线</td>
                    <td className="px-3 py-3 text-center">15-30天</td>
                    <td className="px-3 py-3 text-center text-orange-600">¥15-40/kg</td>
                    <td className="px-3 py-3 text-center">&gt;50kg</td>
                    <td className="px-3 py-3 text-center text-red-600 font-semibold">❌ 不可退</td>
                    <td className="px-3 py-3 text-center text-xs">无进出口权企业</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 bg-green-50 rounded-lg p-4 border border-green-200">
              <p className="text-sm text-green-900">
                <strong>💡 玩具批发建议：</strong>最常用的组合是 <span className="px-2 py-1 bg-green-100 text-green-700 rounded">海派 + 0110一般贸易</span>，
                成本低、可退税、时效适中。如果客户急需，可以选择 <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">空派 + 0110一般贸易</span>。
              </p>
            </div>
          </div>

          {/* 双清包税说明 */}
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6 mb-8">
            <h4 className="text-lg font-bold text-yellow-900 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              关于“双清包税”专线
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-semibold text-green-700 mb-2">✅ 优点</h5>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li>省事，货代代清关</li>
                  <li>成本可控，运费=全包价</li>
                  <li>适合无进出口权的企业</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-red-700 mb-2"> 缺点</h5>
                <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                  <li><strong>无法退税</strong>（不是您自己报关）</li>
                  <li>无法抵扣进项税</li>
                  <li>财务不透明</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-yellow-200">
              <p className="text-sm text-yellow-900 font-semibold">
                ⚠️ 重要提醒：如果您的目的是退税，不要走双清包税！应该自己找报关行按0110一般贸易报关。
              </p>
            </div>
          </div>


        </div>



        {/* Documents Management */}
        <div id="documents" className="scroll-mt-24">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="w-8 h-8 bg-pink-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">5</span>
            出口单证管理
          </h3>

          {/* 核心单证 */}
          <div className="bg-white rounded-xl border-2 border-blue-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold text-blue-600 flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                核心单证（每票必用）
              </h4>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                下载所有模板
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-start mb-3">
                  <span className="text-2xl mr-3">📄</span>
                  <div className="flex-1">
                    <h5 className="font-bold text-gray-900 mb-1">商业发票 (Commercial Invoice)</h5>
                    <p className="text-xs text-gray-500 mb-2">CI - Commercial Invoice</p>
                  </div>
                  <button className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors flex-shrink-0">
                    下载模板
                  </button>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="font-semibold text-gray-700">用途：</p>
                    <p className="text-gray-600">货物价值证明，用于海关申报、银行结汇、客户清关</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">包含内容：</p>
                    <ul className="text-gray-600 list-disc list-inside ml-2">
                      <li>买卖双方信息</li>
                      <li>货物描述、数量、单价、总价</li>
                      <li>贸易术语（FOB/CIF等）</li>
                      <li>付款方式</li>
                      <li>发票号码和日期</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-start mb-3">
                  <span className="text-2xl mr-3">📦</span>
                  <div className="flex-1">
                    <h5 className="font-bold text-gray-900 mb-1">装箱单 (Packing List)</h5>
                    <p className="text-xs text-gray-500 mb-2">PL - Packing List</p>
                  </div>
                  <button className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors flex-shrink-0">
                    下载模板
                  </button>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="font-semibold text-gray-700">用途：</p>
                    <p className="text-gray-600">详细列明货物包装情况，便于清点和查验</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">包含内容：</p>
                    <ul className="text-gray-600 list-disc list-inside ml-2">
                      <li>箱号、每箱内容物</li>
                      <li>毛重、净重</li>
                      <li>包装尺寸（长×宽×高）</li>
                      <li>总体积（CBM）</li>
                      <li>唛头（Shipping Mark）</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-start mb-3">
                  <span className="text-2xl mr-3">🚢</span>
                  <div className="flex-1">
                    <h5 className="font-bold text-gray-900 mb-1">提单 (Bill of Lading)</h5>
                    <p className="text-xs text-gray-500 mb-2">B/L - Bill of Lading</p>
                  </div>
                  <button className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors flex-shrink-0">
                    下载模板
                  </button>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="font-semibold text-gray-700">用途：</p>
                    <p className="text-gray-600">货物所有权凭证、运输合同证明、收货凭证（最重要单据）</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">类型：</p>
                    <ul className="text-gray-600 list-disc list-inside ml-2">
                      <li><strong>正本提单 (Original B/L)</strong>：需邮寄给客户</li>
                      <li><strong>电放提单 (Telex Release)</strong>：电子放货，无需正本</li>
                      <li><strong>海运单 (Sea Waybill)</strong>：不可转让，直接放货</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-start mb-3">
                  <span className="text-2xl mr-3">📋</span>
                  <div className="flex-1">
                    <h5 className="font-bold text-gray-900 mb-1">销售合同 (Sales Contract)</h5>
                    <p className="text-xs text-gray-500 mb-2">SC / PI - Sales Contract / Proforma Invoice</p>
                  </div>
                  <button className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors flex-shrink-0">
                    下载模板
                  </button>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="font-semibold text-gray-700">用途：</p>
                    <p className="text-gray-600">买卖双方权利义务约定，法律依据</p>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">包含内容：</p>
                    <ul className="text-gray-600 list-disc list-inside ml-2">
                      <li>产品规格、数量、价格</li>
                      <li>交货期、付款方式</li>
                      <li>质量标准、检验方式</li>
                      <li>违约责任、争议解决</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 认证与产地单证 */}
          <div className="bg-white rounded-xl border-2 border-green-200 p-6 mb-8">
            <h4 className="text-lg font-bold text-green-600 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              认证与产地单证（按需使用）
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
                <div className="flex items-start mb-3">
                  <span className="text-2xl mr-3">🌍</span>
                  <div className="flex-1">
                    <h5 className="font-bold text-gray-900 mb-1">原产地证 (CO)</h5>
                    <p className="text-xs text-gray-500 mb-2">Certificate of Origin</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">证明货物原产国，享受关税优惠</p>
                  <ul className="text-gray-600 list-disc list-inside ml-2">
                    <li><strong>一般原产地证</strong>：通用</li>
                    <li><strong>Form A</strong>：普惠制（发达国家）</li>
                    <li><strong>Form E</strong>：中国-东盟</li>
                    <li><strong>中韩FTA</strong>：韩国</li>
                  </ul>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
                <div className="flex items-start mb-3">
                  <span className="text-2xl mr-3">✅</span>
                  <div className="flex-1">
                    <h5 className="font-bold text-gray-900 mb-1">质量检验证书</h5>
                    <p className="text-xs text-gray-500 mb-2">Inspection Certificate</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">证明货物符合质量标准</p>
                  <ul className="text-gray-600 list-disc list-inside ml-2">
                    <li><strong>工厂自检报告</strong>：内部QC</li>
                    <li><strong>第三方检验</strong>：SGS/BV/Intertek</li>
                    <li><strong>商检证书</strong>：法定检验商品</li>
                  </ul>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors">
                <div className="flex items-start mb-3">
                  <span className="text-2xl mr-3">⚖️</span>
                  <div className="flex-1">
                    <h5 className="font-bold text-gray-900 mb-1">保险单</h5>
                    <p className="text-xs text-gray-500 mb-2">Insurance Policy</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">货物运输保险凭证，理赔依据</p>
                  <ul className="text-gray-600 list-disc list-inside ml-2">
                    <li><strong>平安险 (FPA)</strong>：基本险</li>
                    <li><strong>水渍险 (WPA)</strong>：中等险</li>
                    <li><strong>一切险 (All Risks)</strong>：全险</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* 报关与退税单证 */}
          <div className="bg-white rounded-xl border-2 border-purple-200 p-6">
            <h4 className="text-lg font-bold text-purple-600 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              报关与退税单证
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                <div className="flex items-start mb-3">
                  <span className="text-2xl mr-3">📑</span>
                  <div className="flex-1">
                    <h5 className="font-bold text-gray-900 mb-1">出口货物报关单</h5>
                    <p className="text-xs text-gray-500 mb-2">Customs Declaration Form</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">向海关申报出口，获取出口证明</p>
                  <ul className="text-gray-600 list-disc list-inside ml-2">
                    <li>收发货人信息</li>
                    <li>商品信息（HS编码）</li>
                    <li>数量、金额、币制</li>
                    <li>贸易方式、征免性质</li>
                  </ul>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 transition-colors">
                <div className="flex items-start mb-3">
                  <span className="text-2xl mr-3">💰</span>
                  <div className="flex-1">
                    <h5 className="font-bold text-gray-900 mb-1">增值税专用发票</h5>
                    <p className="text-xs text-gray-500 mb-2">VAT Invoice</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">采购凭证，申请出口退税的核心单据</p>
                  <ul className="text-gray-600 list-disc list-inside ml-2">
                    <li>必须是专用发票</li>
                    <li>品名与报关单一致</li>
                    <li>数量、金额匹配</li>
                    <li>在有效期内认证</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
