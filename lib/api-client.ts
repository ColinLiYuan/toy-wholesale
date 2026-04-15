import axios from 'axios';
import { API_BASE_URL, BACKEND_BASE_URL } from './api-config';

// 获取后端 API 的绝对地址（用于 Server Component）
const getAbsoluteBaseUrl = () => {
  if (typeof window === 'undefined') {
    // Server Component 环境，使用环境变量中的后端地址
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
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// 自定义类型，表示已经解包的响应
export type UnwrappedAxiosResponse<T = any> = T;

export default apiClient;
