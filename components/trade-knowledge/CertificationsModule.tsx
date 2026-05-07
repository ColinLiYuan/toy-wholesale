export default function CertificationsModule() {
  return (
    <section id="certifications" className="py-16 bg-gray-50 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-12">
          <div className="flex items-center mb-4">
            <span className="text-4xl mr-4">✅</span>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">产品认证</h2>
              <p className="text-lg text-gray-600 mt-1">全球市场准入、合规要求</p>
            </div>
          </div>
        </div>

        {/* 二级导航 */}
        <div className="mb-12 bg-gray-50 rounded-xl p-4">
          <div className="flex flex-wrap gap-3">
            <a href="#eu-cert" className="px-4 py-2 bg-white border border-blue-200 rounded-lg text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors">
              🇪🇺 欧盟认证
            </a>
            <a href="#us-cert" className="px-4 py-2 bg-white border border-red-200 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
              🇺🇸 美国认证
            </a>
            <a href="#jp-cert" className="px-4 py-2 bg-white border border-purple-200 rounded-lg text-sm font-medium text-purple-600 hover:bg-purple-50 transition-colors">
              🇯🇵 日本认证
            </a>
            <a href="#iso-cert" className="px-4 py-2 bg-white border border-green-200 rounded-lg text-sm font-medium text-green-600 hover:bg-green-50 transition-colors">
              📋 ISO体系
            </a>
          </div>
        </div>

        {/* 主要市场认证 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* 欧盟认证 */}
          <div id="eu-cert" className="scroll-mt-24 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-6 hover:shadow-lg transition-all">
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">🇪🇺</span>
              <h3 className="text-xl font-bold text-blue-600">欧盟市场</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold text-gray-900 mb-2">必备认证：</p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <div>
                      <p className="font-medium text-gray-900">CE认证</p>
                      <p className="text-gray-600 text-xs">电子产品、玩具强制要求</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <div>
                      <p className="font-medium text-gray-900">RoHS指令</p>
                      <p className="text-gray-600 text-xs">限制有害物质使用</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <div>
                      <p className="font-medium text-gray-900">REACH法规</p>
                      <p className="text-gray-600 text-xs">化学品注册、评估、许可</p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="pt-3 border-t border-blue-200">
                <p className="text-xs text-blue-600 font-medium">💡 成人用品需特别注意材质安全证明</p>
              </div>
            </div>
          </div>

          {/* 美国认证 */}
          <div id="us-cert" className="scroll-mt-24 bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 rounded-xl p-6 hover:shadow-lg transition-all">
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">🇺🇸</span>
              <h3 className="text-xl font-bold text-red-600">美国市场</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold text-gray-900 mb-2">必备认证：</p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">✓</span>
                    <div>
                      <p className="font-medium text-gray-900">FCC认证</p>
                      <p className="text-gray-600 text-xs">电子设备电磁兼容性</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">✓</span>
                    <div>
                      <p className="font-medium text-gray-900">FDA注册</p>
                      <p className="text-gray-600 text-xs">医疗器械类必需（部分成人用品）</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-600 mr-2">✓</span>
                    <div>
                      <p className="font-medium text-gray-900">CPC证书</p>
                      <p className="text-gray-600 text-xs">儿童产品证书（如适用）</p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="pt-3 border-t border-red-200">
                <p className="text-xs text-red-600 font-medium">💡 各州可能有额外要求，如加州65号提案</p>
              </div>
            </div>
          </div>

          {/* 日本认证 */}
          <div id="jp-cert" className="scroll-mt-24 bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl p-6 hover:shadow-lg transition-all">
            <div className="flex items-center mb-4">
              <span className="text-3xl mr-3">🇯🇵</span>
              <h3 className="text-xl font-bold text-purple-600">日本市场</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold text-gray-900 mb-2">必备认证：</p>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">✓</span>
                    <div>
                      <p className="font-medium text-gray-900">PSE认证</p>
                      <p className="text-gray-600 text-xs">电气用品安全法强制要求</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-600 mr-2">✓</span>
                    <div>
                      <p className="font-medium text-gray-900">TELEC认证</p>
                      <p className="text-gray-600 text-xs">无线电设备（蓝牙/WiFi产品）</p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="pt-3 border-t border-purple-200">
                <p className="text-xs text-purple-600 font-medium">💡 日本市场对质量要求极高</p>
              </div>
            </div>
          </div>
        </div>

        {/* 通用认证 */}
        <div id="iso-cert" className="scroll-mt-24 bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">通用质量管理体系认证</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                  <span className="text-2xl mr-2">📋</span>
                  ISO 9001
                </h4>
                <p className="text-sm text-gray-600 mb-2">质量管理体系认证</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• 国际通用的质量管理标准</li>
                  <li>• 提升客户信任度</li>
                  <li>• 大客户通常要求</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                  <span className="text-2xl mr-2">🌿</span>
                  ISO 14001
                </h4>
                <p className="text-sm text-gray-600 mb-2">环境管理体系认证</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• 环保管理国际标准</li>
                  <li>• 欧美客户重视</li>
                  <li>• 体现社会责任</li>
                </ul>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <h4 className="font-bold text-gray-900 mb-2 flex items-center">
                  <span className="text-2xl mr-2">👥</span>
                  BSCI/Sedex
                </h4>
                <p className="text-sm text-gray-600 mb-2">社会责任审核</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• 商业社会标准认证</li>
                  <li>• 欧洲零售商广泛认可</li>
                  <li>• 审核劳工权益、工作环境</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
