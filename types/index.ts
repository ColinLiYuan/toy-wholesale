// 产品分类类型 - 支持嵌套层级
export interface Category {
  name: string;
  slug: string;
  priority?: number;
  changefreq?: string;
  children?: Category[];  // 子分类
}

// 产品类型定义 - 根据后端实体 Product
export interface Product {
  id: number;
  name: string;
  title: string;
  shortDescription?: string;
  slug: string;
  brand: string;
  status: string;  // ACTIVE, INACTIVE
  image: string;
  alt: string;
  currentPrice: number;
  originalPrice?: number;
  description?: string;
  categories?: string | string[];  // JSON 字符串或数组
  colors?: string | string[];  // JSON 字符串或数组
  features?: string[];
  minOrder?: number;
  badge?: string | null;
  rating?: number;
  stock?: number;
  reviewCount?: number;
  sku?: string;
  createdAt?: string;
  updatedAt?: string;
  productSkus?: ProductSku[];
  specifications?: ProductSpecification[];
  galleries?: Gallery[];  // 产品相册（从后端直接获取）
}

// 产品 SKU 类型
export interface ProductSku {
  id?: number;
  productId?: number;
  sku: string;
  color?: string;
  image?: string;
  stock: number;
}

// 产品规格类型
export interface ProductSpecification {
  id: number;
  specKey: string;
  specValue: string;
}

// 产品相册类型 - 根据后端实体 Gallery
export interface Gallery {
  id?: number;
  productId?: number;
  imageUrl: string;
  alt?: string;
  sortOrder: number;
  isPrimary: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// API 响应数据结构 - Spring Page<T>
export interface ProductListResponse {
  content: Product[];
  currentPage: number;  // number
  pageSize: number;     // number
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  first: boolean;
  last: boolean;
}

// API 通用响应 - 对应后端 ApiResponse<T>
export interface ApiResult<T = any> {
  code: number;
  message: string;
  data: T;
}

// 兼容旧代码（success 字段映射）
export const isSuccess = (result: ApiResult<any>): boolean => result.code === 200;

// 防伪验证结果类型
export interface VerifyResult {
  isValid: boolean;
  productId?: string;
  productName?: string;
  verifyTime?: string;
  message: string;
  messageEn: string;
}

// 防伪验证请求
export interface VerifyRequest {
  code: string;
}

// 联系表单类型
export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// API 响应通用类型
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

// 博客类型定义 - 根据后端实体 BlogPost
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;  // Markdown 格式内容
  coverImage?: string;
  category: string;
  tags?: string[];  // 后端返回 JSON 数组字符串，前端解析为数组
  isPublished?: boolean;  // 后端使用 Boolean 字段
  publishedAt?: string;
  viewCount?: number;
  authorName?: string;  // 后端字段名
  authorAvatar?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  language?: string;
  createdAt?: string;
  updatedAt?: string;
}

// 博客列表响应
export interface BlogListResponse {
  content: BlogPost[];
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  first: boolean;
  last: boolean;
}
