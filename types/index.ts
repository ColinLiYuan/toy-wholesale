// 产品分类类型 - 支持嵌套层级
export interface Category {
  name: string;
  slug: string;
  priority?: number;
  changefreq?: string;
  children?: Category[];  // 子分类
}

// 供应商类型
export interface Supplier {
  id: number;
  name: string;
  internalCode?: string;  // 供应商内部编码，如 WS, PF, DM
  contactPerson?: string;
  phone?: string;
  address?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// 产品类型定义 - 根据后端实体 Product
export interface Product {
  id: number;
  name: string;
  title: string;
  sku?: string;  // 简单 SKU（兼容旧代码）
  shortDescription?: string;  // 短描述（VARCHAR 500）
  slug: string;
  brand: string;
  status: string;  // ACTIVE, INACTIVE
  image: string;
  alt: string;
  currentPrice: number;
  originalPrice?: number;  // 原价（划线价）
  description?: string;  // 长描述（TEXT）
  categories?: string | string[];  // JSON 字符串或数组
  colors?: string | string[];  // JSON 字符串或数组
  tags?: string | string[];  // 标签（JSON数组，用于前端多选搜索）
  features?: Record<string, any>;  // 特性（JSON对象）
  featuresParsed?: Record<string, any>;  // 解析后的特性对象（前端用）
  minOrder?: number;
  
  // B2B 外贸属性
  material?: string;  // 材质（VARCHAR 100）
  netWeight?: number;  // 净重（kg, DECIMAL 10,3）
  supplierSku?: string;  // 厂家货号（VARCHAR 100）
  supplierId?: number;  // 供应商 ID
  supplierName?: string;  // 供应商名称（冗余字段）
  badge?: string;  // 产品标签（如 NEW, HOT, SALE）
  
  createdAt?: string;
  updatedAt?: string;
  productSkus?: ProductSku[];
  specifications?: ProductSpecification[];  // 规格（独立表）
  galleries?: Gallery[];  // 产品相册（从后端直接获取）
}

// 产品相册类型别名（用于向后兼容）
export type ProductGallery = Gallery;

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

// 经销商类型 - 根据后端实体 Distributor
export interface Distributor {
  id: number;
  name: string;
  code: string;  // 经销商编码（唯一）
  type?: string;  // AUTHORIZED, PARTNER, AGENT
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
  country?: string;
  region?: string;
  city?: string;
  zipCode?: string;
  website?: string;
  description?: string;
  status?: string;  // ACTIVE, INACTIVE, SUSPENDED, BLACKLISTED
  level?: string;  // GOLD, SILVER, BRONZE
  creditRating?: string;
  serviceRegions?: string;  // JSON 数组
  createdAt?: string;
  updatedAt?: string;
}

// 认证响应类型
export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  distributor?: Distributor;  // 后端返回的字段名是 distributor
  user?: Distributor;  // 兼容别名
}

// 购物车项目类型 - 根据后端实体 CartItem
export interface CartItem {
  id: number;
  cartId?: number;
  sku: ProductSku;
  quantity: number;
  priceAtAdd: number;  // 加入购物车时的价格快照
  productName?: string;
  productImage?: string;
  createdAt?: string;
  updatedAt?: string;
}

// 购物车类型 - 根据后端实体 ShoppingCart
export interface ShoppingCart {
  id: number;
  distributorId?: number;
  items: CartItem[];
  createdAt?: string;
  updatedAt?: string;
}
