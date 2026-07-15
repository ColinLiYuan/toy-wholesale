// API 基础配置
// 使用相对路径 /api，由 Next.js rewrites 代理到真实 API
// 这样可以解决 Vercel HTTPS 与后端 HTTP 的混合内容问题
export const API_BASE_URL = '/api';

// 后端服务基础 URL（用于 SSR/服务端组件环境下的 API 请求）
// 注意：在服务端组件中，axios 默认会使用相对路径，
// 但如果需要直接调用后端，可以使用此变量
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
  
  // 潜客管理（后台管理接口）
  ADMIN_LEADS: '/v1/leads',                          // GET /v1/leads
  ADMIN_LEAD_DETAIL: '/v1/leads',                    // GET /v1/leads/{id}
  ADMIN_LEAD_CREATE: '/v1/leads',                    // POST /v1/leads
  ADMIN_LEAD_UPDATE: '/v1/leads',                    // PUT /v1/leads/{id}
  ADMIN_LEAD_DELETE: '/v1/leads',                    // DELETE /v1/leads/{id}
  ADMIN_LEADS_BY_STATUS: '/v1/leads/status',         // GET /v1/leads/status/{status}
  ADMIN_LEADS_SEARCH: '/v1/leads/search',            // GET /v1/leads/search?keyword=xxx
  ADMIN_LEAD_FOLLOW_UPS: '/v1/leads',                // POST /v1/leads/{id}/follow-ups
  ADMIN_LEAD_CONVERT: '/v1/leads',                   // POST /v1/leads/{id}/convert
  ADMIN_LEAD_STATISTICS: '/v1/leads/statistics',     // GET /v1/leads/statistics
  ADMIN_LEAD_STATUS_UPDATE: '/v1/leads',             // PATCH /v1/leads/{id}/status
  ADMIN_LEAD_STATUS_HISTORY: '/v1/leads',            // GET /v1/leads/{id}/status-history
  
  // 经销商管理（后台管理接口）
  ADMIN_DISTRIBUTORS: '/v1/distributors',            // GET /v1/distributors
  ADMIN_DISTRIBUTOR_DETAIL: '/v1/distributors',      // GET /v1/distributors/{id}
  ADMIN_DISTRIBUTOR_CREATE: '/v1/distributors',      // POST /v1/distributors
  ADMIN_DISTRIBUTOR_UPDATE: '/v1/distributors',      // PUT /v1/distributors/{id}
  ADMIN_DISTRIBUTOR_DELETE: '/v1/distributors',      // DELETE /v1/distributors/{id}
  
  // 订单管理（后台管理接口）
  ADMIN_ORDERS: '/v1/inquiry-orders',                // GET /v1/inquiry-orders
  ADMIN_ORDER_DETAIL: '/v1/inquiry-orders',          // GET /v1/inquiry-orders/{id}
  ADMIN_ORDER_CREATE: '/v1/inquiry-orders',          // POST /v1/inquiry-orders
  ADMIN_ORDER_UPDATE: '/v1/inquiry-orders',          // PUT /v1/inquiry-orders/{id}
  ADMIN_ORDER_DELETE: '/v1/inquiry-orders',          // DELETE /v1/inquiry-orders/{id}
  ADMIN_ORDER_STATUS: '/v1/inquiry-orders',          // PATCH /v1/inquiry-orders/{id}/status
  ADMIN_ORDERS_BY_DISTRIBUTOR: '/v1/inquiry-orders/distributor',  // GET /v1/inquiry-orders/distributor/{id}
  ADMIN_ORDERS_BY_STATUS: '/v1/inquiry-orders/status',  // GET /v1/inquiry-orders/status/{status}
  
  // 灵活订单管理（潜客转化和快速下单）
  FLEXIBLE_QUICK_CONVERT: '/v1/flexible-orders/leads',  // POST /v1/flexible-orders/leads/{id}/quick-convert
  FLEXIBLE_CREATE_ORDER: '/v1/flexible-orders/create-direct',  // POST /v1/flexible-orders/create-direct

  // 报价单管理（后台管理接口）
  ADMIN_QUOTATIONS: '/v1/quotations',                    // GET /v1/quotations?page=&size=&status=
  ADMIN_QUOTATION_DETAIL: '/v1/quotations',              // GET /v1/quotations/{id}
  ADMIN_QUOTATION_CREATE: '/v1/quotations',              // POST /v1/quotations
  ADMIN_QUOTATION_UPDATE: '/v1/quotations',              // PUT /v1/quotations/{id}
  ADMIN_QUOTATION_DELETE: '/v1/quotations',              // DELETE /v1/quotations/{id}
  ADMIN_QUOTATION_STATUS: '/v1/quotations',              // PATCH /v1/quotations/{id}/status
  ADMIN_QUOTATION_SEND: '/v1/quotations',                // PATCH /v1/quotations/{id}/send
  ADMIN_QUOTATION_BY_NUMBER: '/v1/quotations/number',    // GET /v1/quotations/number/{number}
  ADMIN_QUOTATION_BY_DISTRIBUTOR: '/v1/quotations/distributor',  // GET /v1/quotations/distributor/{id}

  // 供应商管理
  ADMIN_SUPPLIERS: '/v1/suppliers',
  ADMIN_SUPPLIER_DETAIL: '/v1/suppliers',
  ADMIN_SUPPLIER_CREATE: '/v1/suppliers',
  ADMIN_SUPPLIER_UPDATE: '/v1/suppliers',
  ADMIN_SUPPLIER_DELETE: '/v1/suppliers',

  // 访问记录管理
  ADMIN_VISIT_RECORDS: '/v1/visit-records',
  ADMIN_VISIT_RECORD_DETAIL: '/v1/visit-records',
  ADMIN_VISIT_RECORD_CREATE: '/v1/visit-records',
  ADMIN_VISIT_RECORD_UPDATE: '/v1/visit-records',
  ADMIN_VISIT_RECORD_DELETE: '/v1/visit-records',
} as const;
