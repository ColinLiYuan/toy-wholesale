import axios from 'axios';
import { API_BASE_URL, BACKEND_BASE_URL } from './api-config';

// 动态站点标识（多租户隔离），支持运行时切换
let currentSiteId = 'toy';

// 支持的站点列表
const SUPPORTED_SITES = ['toy', 'myth', 'seric'];

export function setSiteId(siteId: string) {
  if (SUPPORTED_SITES.includes(siteId)) {
    currentSiteId = siteId;
  } else {
    console.warn(`Site ID "${siteId}" is not supported. Supported sites: ${SUPPORTED_SITES.join(', ')}`);
  }
}

export function getSiteId(): string {
  return currentSiteId;
}

// 客户端初始化：从 localStorage 恢复上次选择的站点
if (typeof window !== 'undefined') {
  const saved = localStorage.getItem('admin_site_id');
  if (saved && SUPPORTED_SITES.includes(saved)) {
    currentSiteId = saved;
  }
}

// 获取后端 API 的绝对地址（用于 Server Component）
const getAbsoluteBaseUrl = () => {
  if (typeof window === 'undefined') {
    // Server Component 环境，直接使用后端地址（不走 Next.js 代理）
    // 后端接口路径是 /api/v1/xxx，所以需要加上 /api
    const baseUrl = `${BACKEND_BASE_URL}/api`;
    console.log('[Server] API Base URL:', baseUrl);
    return baseUrl;
  }
  // Client Component 环境，使用相对路径（走 Next.js 代理）
  console.log('[Client] API Base URL: /api');
  return '/api';
};

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: getAbsoluteBaseUrl(),
  timeout: 30000,  // 增加超时时间到30秒
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 添加多租户标识
    config.headers['X-Site-Id'] = currentSiteId;
    
    // 调试日志：输出请求信息
    console.log('[API Request]', {
      method: config.method?.toUpperCase(),
      url: (config.baseURL || '') + config.url,
      headers: config.headers,
    });
    
    // 可以在这里添加 token 等认证信息
    // 注意：Server Component 中无法使用 localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    // 调试日志：输出响应信息
    console.log('[API Response]', {
      status: response.status,
      url: response.config?.url,
      data: response.data,
    });
    return response.data;
  },
  (error) => {
    // 调试日志：输出错误信息
    console.error('[API Error]', {
      message: error.message,
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data,
    });
    
    // 处理 HTTP 错误
    if (error.response) {
      const status = error.response.status;
      const responseData = error.response.data;
      
      // 为所有错误添加友好的中文提示
      if (status === 400) {
        // 400 错误：请求参数错误，显示后端返回的具体信息
        const errorMsg = responseData?.message || responseData?.error || '请求参数错误';
        error.userMessage = errorMsg;
      } else if (status === 401) {
        error.userMessage = '认证失败，请重新登录';
      } else if (status === 403) {
        error.userMessage = '权限不足，无法执行此操作';
      } else if (status === 404) {
        error.userMessage = '请求的资源不存在';
      } else if (status === 409) {
        error.userMessage = responseData?.message || '数据冲突，可能已存在';
      } else if (status === 500) {
        error.userMessage = '服务器错误，请稍后重试';
      } else {
        error.userMessage = responseData?.message || `请求失败 (${status})`;
      }
    } else if (error.request) {
      // 请求已发送但没有收到响应（网络错误）
      error.userMessage = '网络连接失败，请检查网络后重试';
    } else {
      // 请求配置出错
      error.userMessage = error.message || '请求失败';
    }
    
    // 处理 401 未授权错误（token 过期或无效）
    if (error.response && error.response.status === 401) {
      console.warn('Authentication failed, redirecting to login...');
      
      // 清除本地存储的 token 和用户信息
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // 如果不是已经在登录页，则跳转到登录页
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    } else {
      console.error('API Error:', error);
    }
    
    return Promise.reject(error);
  }
);

// 自定义类型，表示已经解包的响应（拦截器返回 response.data，即 ApiResult 结构）
export type UnwrappedAxiosResponse<T = any> = {
  code: number;
  message: string;
  data: T;
};

export default apiClient as any;
