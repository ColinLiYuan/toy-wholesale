import axios from 'axios';
import { API_BASE_URL, BACKEND_BASE_URL } from './api-config';

// 获取后端 API 的绝对地址（用于 Server Component）
const getAbsoluteBaseUrl = () => {
  if (typeof window === 'undefined') {
    // Server Component 环境，直接使用后端地址（不走 Next.js 代理）
    // 后端接口路径是 /api/v1/xxx，所以需要加上 /api
    return `${BACKEND_BASE_URL}/api`;
  }
  // Client Component 环境，使用相对路径（走 Next.js 代理）
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
    config.headers['X-Site-Id'] = 'toy';
    
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
    return response.data;
  },
  (error) => {
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
