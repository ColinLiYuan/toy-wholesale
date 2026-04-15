// API 基础配置
// 使用相对路径 /api，由 Next.js rewrites 代理到真实 API
export const API_BASE_URL = '/api';

// 后端服务基础 URL（从环境变量读取，用于 SSR 环境下的 API 请求）
export const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:9356';

// Cloudflare R2 CDN 地址（从环境变量读取，用于图片等静态资源）
export const R2_CDN_URL = process.env.NEXT_PUBLIC_R2_CDN_URL || 'https://pub-e5d14c6d386c4d90979458082617517a.r2.dev';

// 格式化图片 URL：使用 R2 CDN
export const formatImageUrl = (url?: string): string => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  // 确保路径以 / 开头，然后拼接 R2 CDN
  const path = url.startsWith('/') ? url : `/${url}`;
  return `${R2_CDN_URL}${path}`;
};

// API 端点 - 根据后端 ProductController
export const API_ENDPOINTS = {
  // 防伪查询
  VERIFY_CODE: '/anti-counterfeit/verify',
  
  // 产品相关（前端公开接口）
  PRODUCTS: '/v1/products',                    // GET /v1/products?page=0&size=12
  PRODUCT_DETAIL: '/v1/products',              // GET /v1/products/{slug}
  
  // 产品管理（后台管理接口）
  ADMIN_PRODUCTS: '/v1/products/admin/list',   // GET /v1/products/admin/list?page=0&size=20
  ADMIN_PRODUCT_DETAIL: '/v1/products/admin',  // GET /v1/products/admin/{id}
  ADMIN_CREATE_PRODUCT: '/v1/products/admin',  // POST /v1/products/admin
  ADMIN_UPDATE_PRODUCT: '/v1/products/admin',  // PUT /v1/products/admin/{id}
  ADMIN_DELETE_PRODUCT: '/v1/products/admin',  // DELETE /v1/products/admin/{id}
  ADMIN_TOGGLE_STATUS: '/v1/products/admin',   // PATCH /v1/products/admin/{id}/status
  
  // 产品相册（后台管理接口）
  ADMIN_PRODUCT_GALLERIES: '/v1/products',     // GET /v1/products/{productId}/galleries
  ADMIN_GALLERIES: '/v1/products/admin',       // POST /v1/products/admin/{productId}/galleries
  ADMIN_GALLERIES_BATCH: '/v1/products/admin', // POST /v1/products/admin/{productId}/galleries/batch
  ADMIN_GALLERY_DETAIL: '/v1/products/admin/galleries', // PUT/DELETE /v1/products/admin/galleries/{id}
  ADMIN_GALLERY_SET_PRIMARY: '/v1/products/admin/galleries', // PATCH /v1/products/admin/galleries/{id}/set-primary
  ADMIN_GALLERY_SORT: '/v1/products/admin/galleries',      // PATCH /v1/products/admin/galleries/{id}/sort
  
  // 其他
  CONTACT: '/contact',
  
  // 博客相关（前端公开接口）
  BLOG_POSTS: '/v1/blog/posts',           // GET /v1/blog/posts?page=0&size=10
  BLOG_POST_DETAIL: '/v1/blog/posts',     // GET /v1/blog/posts/{slug}
  BLOG_POSTS_BY_CATEGORY: '/v1/blog/posts/category',  // GET /v1/blog/posts/category/{category}
  BLOG_POSTS_SEARCH: '/v1/blog/posts/search',  // GET /v1/blog/posts/search?keyword=xxx
  BLOG_POSTS_LATEST: '/v1/blog/posts/latest',  // GET /v1/blog/posts/latest?limit=5
  BLOG_POSTS_POPULAR: '/v1/blog/posts/popular',  // GET /v1/blog/posts/popular?limit=5
  
  // 博客管理（后台管理接口）
  ADMIN_BLOG_LIST: '/v1/blog/admin/list',  // GET /v1/blog/admin/list?page=0&size=20
  ADMIN_BLOG_BY_ID: '/v1/blog/admin',     // GET /v1/blog/admin/{id}
  ADMIN_BLOG_CREATE: '/v1/blog/posts',     // POST /v1/blog/posts
  ADMIN_BLOG_UPDATE: '/v1/blog/posts',     // PUT /v1/blog/posts/{id}
  ADMIN_BLOG_DELETE: '/v1/blog/posts',     // DELETE /v1/blog/posts/{id}
  ADMIN_BLOG_PUBLISH: '/v1/blog/posts',    // POST /v1/blog/posts/{id}/publish
} as const;
