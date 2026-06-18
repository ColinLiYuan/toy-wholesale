'use client';

import { useState, useEffect } from 'react';
import apiClient from '@/lib/api-client';
import { BACKEND_BASE_URL } from '@/lib/api-config';

export default function DebugPage() {
  const [info, setInfo] = useState<any>({});
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 收集环境信息
    setInfo({
      windowDefined: typeof window !== 'undefined',
      backendBaseUrl: BACKEND_BASE_URL,
      location: typeof window !== 'undefined' ? window.location.href : 'N/A',
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'N/A',
    });
  }, []);

  const testApiConnection = async () => {
    setLoading(true);
    try {
      
      // 测试一个简单的 API 调用
      const response = await apiClient.get('/v1/products', {
        params: { page: 0, size: 1 }
      });
      
      setTestResult({
        success: true,
        data: response,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      console.error('[Debug] API Test Error:', error);
      setTestResult({
        success: false,
        error: {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url,
          baseURL: error.config?.baseURL,
        },
        timestamp: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔧 API 调试工具</h1>

        {/* 环境信息 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">📋 环境信息</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(info, null, 2)}
          </pre>
        </div>

        {/* API 测试 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">🧪 API 连接测试</h2>
          <button
            onClick={testApiConnection}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? '测试中...' : '测试 API 连接'}
          </button>

          {testResult && (
            <div className="mt-4">
              <div className={`p-4 rounded ${testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <p className="font-semibold mb-2">
                  {testResult.success ? '✅ 测试成功' : '❌ 测试失败'}
                </p>
                <pre className="text-sm overflow-auto max-h-96">
                  {JSON.stringify(testResult, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* 使用说明 */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">📖 使用说明</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>点击"测试 API 连接"按钮</li>
            <li>打开浏览器控制台（F12）查看详细日志</li>
            <li>查看测试结果中的 baseURL 和 url</li>
            <li>如果失败，检查错误信息中的状态码和响应数据</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
