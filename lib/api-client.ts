import axios from 'axios';
import { API_BASE_URL, BACKEND_BASE_URL } from './api-config';

// 动态站点标识（多租户隔离），支持运行时切换。
// 平台不再预埋任何站点：未选择时为空（不携带 X-Site-Id，由后端默认处理）
let currentSiteId = '';

// 站点合法值集合：由 site-service 从后端 /v1/sites 注册覆盖；
// 初始仅放回 localStorage 恢复的站点，避免刷新后选择丢失
let supportedSites = new Set<string>();

/** 由站点服务注册后端返回的站点编码集合（空数组同样生效——平台新库无站点） */
export function registerSupportedSites(siteIds: string[]) {
  if (Array.isArray(siteIds)) {
    supportedSites = new Set(siteIds);
  }
}

export function setSiteId(siteId: string) {
  if (supportedSites.has(siteId)) {
    currentSiteId = siteId;
  } else {
    console.warn(`Site ID "${siteId}" is not supported. Supported sites: ${[...supportedSites].join(', ')}`);
  }
}

export function getSiteId(): string {
  return currentSiteId;
}

// 客户端初始化：从 localStorage 恢复上次选择的站点（不再预埋站点白名单）
if (typeof window !== 'undefined') {
  const saved = localStorage.getItem('admin_site_id');
  if (saved) {
    currentSiteId = saved;
    supportedSites.add(saved);
  }
}

// 服务端组件环境：无 localStorage，站点由部署配置决定（NEXT_PUBLIC_SITE_ID）
// 否则公共页服务端渲染的请求不带 X-Site-Id，后端按站点过滤时返回空数据
if (typeof window === 'undefined') {
  const envSiteId = process.env.NEXT_PUBLIC_SITE_ID || '';
  if (envSiteId) {
    currentSiteId = envSiteId;
    supportedSites.add(envSiteId);
  }
}

// 获取后端 API 的绝对地址（用于 Server Component）
const getAbsoluteBaseUrl = () => {
  if (typeof window === 'undefined') {
    // Server Component 环境，直接使用后端地址（不走 Next.js 代理）
    // 后端接口路径是 /api/v1/xxx，所以需要加上 /api
    const baseUrl = `${BACKEND_BASE_URL}/api`;
    return baseUrl;
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

/**
 * 选择认证令牌：管理端优先 admin_token（后台管理接口），
 * 否则回退分销商 token（前台 token）。本仓库前台与后台共用同一客户端，
 * 后台管理页请求必须携带 admin_token，否则 RBAC 会按 401 拒绝。
 */
function resolveAuthToken(): { token: string | null; type: 'admin' | 'distributor' } {
  const adminToken = localStorage.getItem('admin_token');
  if (adminToken) {
    return { token: adminToken, type: 'admin' };
  }
  return { token: localStorage.getItem('token'), type: 'distributor' };
}

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 添加多租户标识（未选择站点时不携带，由后端默认处理）
    if (currentSiteId) {
      config.headers['X-Site-Id'] = currentSiteId;
    }

    // 注入认证信息（注意：Server Component 中无法使用 localStorage）
    if (typeof window !== 'undefined') {
      const { token, type } = resolveAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        // 标记本次请求使用的令牌类型，401 时据此决定刷新/跳转策略
        (config as any)._authType = type;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ---- 管理端 401 自动续期（单飞队列：并发 401 只触发一次刷新请求）----
let refreshPromise: Promise<string | null> | null = null;

/**
 * 用 admin refresh token 换取新的 access token（轮换：后端同步返回新的 refresh token）
 * 用裸 axios 直连刷新接口，避免走本实例的响应拦截器造成递归。
 */
async function refreshAdminSession(): Promise<string | null> {
  const refreshToken = localStorage.getItem('admin_refresh_token');
  if (!refreshToken) {
    return null;
  }
  try {
    const resp = await axios.post(
      `${apiClient.defaults.baseURL}/v1/admin/refresh`,
      { refreshToken },
      { timeout: 10000 }
    );
    const body = resp.data;
    const token = body?.data?.token;
    if (body?.code === 200 && token) {
      localStorage.setItem('admin_token', token);
      if (body.data.refreshToken) {
        localStorage.setItem('admin_refresh_token', body.data.refreshToken);
      }
      return token;
    }
    return null;
  } catch (e) {
    console.warn('[Auth] 刷新令牌失败:', e);
    return null;
  }
}

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
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
      const config = error.config || {};

      // 管理端请求：先尝试刷新令牌并重试一次
      if (config._authType === 'admin') {
        if (!config._retried) {
          config._retried = true;
          // 单飞：并发请求的 401 共享同一次刷新
          refreshPromise = refreshPromise ?? refreshAdminSession().finally(() => {
            refreshPromise = null;
          });
          const newToken = await refreshPromise;
          if (newToken) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${newToken}`;
            return apiClient(config);
          }
        }
        // 刷新失败 / 重试仍 401 → 清除管理端登录态 → 跳管理端登录页
        console.warn('Admin authentication failed, redirecting to admin login...');
        if (typeof window !== 'undefined') {
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_refresh_token');
          localStorage.removeItem('admin_info');
          if (!window.location.pathname.includes('/admin/login')) {
            window.location.href = '/admin/login';
          }
        }
        return Promise.reject(error);
      }

      // 分销商（或已重试仍失败）：清除前台登录态 → 跳前台登录页
      console.warn('Authentication failed, redirecting to login...');
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
