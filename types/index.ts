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
  code?: string;  // 供应商编码（用于SKU生成）
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
  
  // SEO 字段
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  
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
  customerType?: string;  // REGULAR-正规经销商, SMALL_BUSINESS-小B商户, INDIVIDUAL-个人客户
  accountCreatedBy?: string;  // ADMIN-管理员创建, SELF_REGISTER-自助注册
  registrationRequired?: boolean;  // 是否需要完整注册流程
  createdAt?: string;
  updatedAt?: string;
}

// 管理员类型 - 根据后端实体 Admin
export interface Admin {
  id?: number;
  username: string;
  email?: string;
  realName?: string;
  role?: string;  // SUPER_ADMIN, ADMIN, OPERATOR
  status?: string;  // ACTIVE, INACTIVE
  lastLoginAt?: string;
  loginFailCount?: number;
  lockedUntil?: string;
  remark?: string;
  createdAt?: string;
  updatedAt?: string;
}

// 管理员登录响应类型
export interface AdminLoginResponse {
  success: boolean;
  message?: string;
  token?: string;
  admin?: Admin;
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

// 潜在客户类型 - 根据后端实体 Lead
export interface Lead {
  id: number;
  companyName?: string;
  contactPerson?: string;
  position?: string;
  email?: string;
  phone?: string;
  imAccount?: string;  // WhatsApp/微信等即时通讯工具
  country?: string;
  region?: string;
  city?: string;
  website?: string;
  source?: string;  // EMAIL-邮件开发, EXHIBITION-展会, WEBSITE-网站询盘, REFERRAL-推荐, COLD_CALL-电话开发, MYTH_TOY-MythToy
  status?: string;  // NEW-新线索, CONTACTED-已联系, INTERESTED-有意向, QUOTED-已报价, NEGOTIATING-谈判中, CONVERTED-已成交, INVALID-无效
  priority?: string;  // HIGH-高, MEDIUM-中, LOW-低
  interestedCategories?: string;  // JSON数组字符串
  estimatedQuantity?: number;
  budgetRange?: string;
  lastFollowUpAt?: string;
  nextFollowUpAt?: string;
  followUpCount?: number;
  notes?: string;
  isConverted?: boolean;
  convertedDistributorId?: number;
  convertedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  followUpRecords?: FollowUpRecord[];
}

// 跟进记录类型 - 根据后端实体 FollowUpRecord
export interface FollowUpRecord {
  id: number;
  leadId?: number;
  followUpType?: string;  // EMAIL-邮件, PHONE-电话, MEETING-会议, IM-即时通讯, OTHER-其他
  content?: string;
  result?: string;  // NO_RESPONSE-无回复, INTERESTED-有兴趣, REQUEST_QUOTE-要求报价, NEGOTIATING-谈判中, REJECTED-拒绝
  nextAction?: string;
  attachments?: string;  // JSON数组字符串
  followUpBy?: string;
  createdAt?: string;
}

// 潜客列表响应
export interface LeadListResponse {
  content: Lead[];
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  first: boolean;
  last: boolean;
}

// 跟进记录列表响应
export interface FollowUpRecordListResponse {
  content: FollowUpRecord[];
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  first: boolean;
  last: boolean;
}

// 运营账号类型 - 根据后端实体 OperationAccount
// 统一管理所有业务线的运营账号，包括：社交媒体、邮箱、支付账号等
export interface OperationAccount {
  id?: number;
  accountType?: string;  // SOCIAL_MEDIA-社交媒体, EMAIL-邮箱, PAYMENT-支付账号, OTHER-其他
  businessLine?: string;  // MYTH_TOY-MythToy零售, ADULT_PRODUCTS-成人用品外贸, ANTI_FAKE-防伪标签外贸, GENERAL-通用
  platform?: string;  // 平台/服务商
  accountIdentifier?: string;  // 账号标识（用户名/邮箱/账号ID）
  displayName?: string;  // 显示名称/备注名
  password?: string;
  purpose?: string;  // MARKETING-营销推广, CUSTOMER_SERVICE-客户服务, SALES-销售开发, NOTIFICATION-通知接收, REGISTER-注册账号, PAYMENT-收款, OTHER-其他
  projectName?: string;
  leadId?: number;
  status?: string;  // ACTIVE-活跃, INACTIVE-不活跃, BANNED-被封禁, SUSPENDED-暂停
  backupContact?: string;  // 备用联系方式
  phoneNumber?: string;
  twoFactorEnabled?: boolean;
  lastLoginAt?: string;
  lastActiveAt?: string;
  followersCount?: number;  // 粉丝数/关注人数（社交媒体）
  profileUrl?: string;  // 账号主页URL
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

// 运营账号列表响应
export interface OperationAccountListResponse {
  content: OperationAccount[];
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  first: boolean;
  last: boolean;
}

// ==================== 询盘相关类型 ====================

// 询单项 - 对应后端 InquiryItem
export interface InquiryItem {
  id?: number;
  productId: number;
  skuId?: number;
  quantity: number;
  productName?: string;
  productImage?: string;
  specifications?: string;  // JSON字符串
  notes?: string;
}

// 询盘实体 - 对应后端 Inquiry
export interface Inquiry {
  id?: number;
  inquiryNumber?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  companyName?: string;
  country?: string;
  distributorId?: number;
  status?: string;  // NEW, CONTACTED, QUOTING, NEGOTIATING, CONVERTED, CLOSED
  source?: string;  // WEBSITE_FORM, EMAIL, ALIBABA, WHATSAPP, TRADE_SHOW
  message?: string;
  assignedTo?: string;
  contactedAt?: string;
  convertedAt?: string;
  closedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  items: InquiryItem[];
}

// 询盘车商品项（前端临时存储）
export interface InquiryCartItem {
  id?: number;
  productId: number;
  productName: string;
  productImage: string;
  skuId?: number;
  skuCode?: string;
  color?: string;
  quantity: number;
  specifications?: Record<string, any>;
  notes?: string;
}

// 询盘车（前端本地存储）
export interface InquiryCart {
  items: InquiryCartItem[];
  itemCount: number;
}
