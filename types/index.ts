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
  country?: string;
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
  features?: Record<string, unknown> | string[];  // 特性（可以是键值对对象或字符串数组）
  featuresParsed?: Record<string, unknown> | string[];  // 解析后的特性
  
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
  priority?: number;  // 排序优先级（越大越靠前）

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
  siteId?: string;  // 站点标识（用于多租户隔离）
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

// 运营账号类型 - 统一管理所有业务线的运营账号
// 包括：社交媒体、邮箱、支付、云服务、域名、服务器、数据库、B2B平台、物流等
export interface OperationAccount {
  id?: number;
  accountType?: string;  // SOCIAL_MEDIA | EMAIL | PAYMENT | CLOUD_SERVICE | DOMAIN | SERVER | DATABASE | ANALYTICS | DEV_TOOL | B2B_PLATFORM | LOGISTICS | CUSTOMS | OTHER
  businessLine?: string;  // MYTH_TOY | ADULT_PRODUCTS | ANTI_FAKE | GENERAL
  platform?: string;  // 平台/服务商
  accountIdentifier?: string;  // 账号标识（用户名/邮箱/账号ID）
  displayName?: string;  // 显示名称/备注名
  password?: string;
  purpose?: string;  // MARKETING | CUSTOMER_SERVICE | SALES | NOTIFICATION | REGISTER | PAYMENT | INFRASTRUCTURE | DEVELOPMENT | ANALYTICS | LOGISTICS | OTHER
  projectName?: string;
  leadId?: number;
  status?: string;  // ACTIVE | INACTIVE | BANNED | SUSPENDED
  backupContact?: string;
  phoneNumber?: string;
  twoFactorEnabled?: boolean;
  lastLoginAt?: string;
  lastActiveAt?: string;
  followersCount?: number;
  profileUrl?: string;
  // 基础设施/云服务扩展字段
  apiKey?: string;       // API Key / Access Key ID
  secretKey?: string;    // Secret Key
  loginUrl?: string;     // 登录/控制台地址
  consoleUrl?: string;   // 管理后台地址
  expiryDate?: string;   // 到期时间
  port?: number;         // 端口号
  region?: string;       // 区域/机房
  relatedUrls?: string;  // 关联URL（JSON数组）
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
  name?: string;  // 客户姓名（提交时使用）
  email?: string;  // 邮箱（提交时使用）
  phone?: string;  // 电话（提交时使用）
  company?: string;  // 公司名称（提交时使用）
  country?: string;  // 国家（提交时使用）
  customerName?: string;  // 客户姓名（后端实体字段）
  customerEmail?: string;  // 邮箱（后端实体字段）
  customerPhone?: string;  // 电话（后端实体字段）
  companyName?: string;  // 公司名称（后端实体字段）
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
  items?: InquiryItem[];
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
  specifications?: Record<string, unknown> | string;  // 对象格式（前端）或 JSON 字符串（API）
  notes?: string;
}

// 询盘车（前端本地存储）
export interface InquiryCart {
  items: InquiryCartItem[];
  itemCount: number;
}

// ==================== 订单相关类型 ====================

// 订单状态枚举
export type OrderStatus = 
  | 'CREATED'        // 已创建
  | 'CONFIRMED'      // 已确认
  | 'PRODUCING'      // 生产中
  | 'READY_TO_SHIP'  // 待发货
  | 'SHIPPED'        // 已发货
  | 'DELIVERED'      // 已送达
  | 'COMPLETED'      // 已完成
  | 'CANCELLED'      // 已取消
  | 'REFUNDED';      // 已退款

// 支付状态枚举
export type PaymentStatus = 
  | 'PENDING'    // 待支付
  | 'PAID'       // 已支付
  | 'PARTIALLY_PAID'    // 部分支付
  | 'REFUNDED'   // 已退款
  | 'FAILED';    // 支付失败

// 物流状态枚举
export type ShippingStatus = 
  | 'NOT_SHIPPED'  // 未发货
  | 'IN_TRANSIT'     // 运输中
  | 'SHIPPED'      // 已发货
  | 'DELIVERED'    // 已送达
  | 'RETURNED';    // 已退回

// 销售订单项
export interface SalesOrderItem {
  id?: number;
  orderId?: number;
  productId?: number;
  productName?: string;
  productSku?: string;
  quantity: number;
  unitPrice: number;
  totalPrice?: number;
  weightWithBox?: number;  // 单件重量（kg）
  notes?: string;
}

// 支付记录
export interface PaymentRecord {
  id: number;
  transactionId?: string;
  amount: number;
  paymentMethod?: string;  // BANK_TRANSFER, PAYPAL, CREDIT_CARD, ALIPAY, WECHAT
  status?: PaymentStatus;
  paidAt?: string;
  notes?: string;
  operator?: string;
  createdAt: string;
}

// 物流记录
export interface ShipmentRecord {
  id: number;
  carrier: string;
  trackingNumber: string;
  status?: ShippingStatus;
  shippedAt?: string;
  estimatedDeliveryAt?: string;
  deliveredAt?: string;
  notes?: string;
  operator?: string;
  createdAt: string;
}

// 销售订单
export interface SalesOrder {
  id?: number;
  siteId?: string;
  orderNumber: string;
  distributorId?: number;
  distributor?: Distributor;
  supplierId?: number;
  supplier?: Supplier;
  status: OrderStatus;
  paymentStatus?: PaymentStatus;
  shippingStatus?: ShippingStatus;
  totalAmount: number;
  paidAmount?: number;
  totalWeight?: number;
  receiverName?: string;
  receiverPhone?: string;
  shippingAddress?: string;
  shippingCity?: string;
  shippingRegion?: string;
  shippingCountry?: string;
  shippingZipCode?: string;
  carrier?: string;
  trackingNumber?: string;
  estimatedShipDate?: string;
  shippedAt?: string;
  deliveredAt?: string;
  paidAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancelReason?: string;
  purchaseDate?: string;
  productionCompleteDate?: string;
  alertBeforeDays?: number;
  alertSent?: boolean;
  notes?: string;
  internalNotes?: string;
  inquiryOrderId?: number;
  createdAt?: string;
  updatedAt?: string;
  items?: SalesOrderItem[];
  paymentRecords?: PaymentRecord[];
  shipmentRecords?: ShipmentRecord[];
  followUpRecords?: FollowUpRecord[];
}

// 订单列表响应
export interface SalesOrderListResponse {
  content: SalesOrder[];
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  first: boolean;
  last: boolean;
}

// SEO关键词库类型 - 根据后端实体 SeoKeywordLibrary
export interface SeoKeyword {
  id: number;
  siteId?: string;  // 站点标识（多租户隔离）
  keyword: string;  // 关键词（唯一）
  volume?: number;  // 月搜索量
  kd?: number;  // 关键词难度 (0-100)
  intent?: string;  // 搜索意图: C(Commercial), T(Transaction), I(Informational), N(Navigational)
  category?: string;  // 关键词分类: core(核心词), long_tail(定制长尾词), article(信息文章词), brand(品牌词)
  topic?: string;  // SEO主题/话题分类（用于内容组织和分组）
  status?: number;  // 使用状态: 0-未使用 (Unused), 1-已使用 (Used)
  usedInType?: number;  // 应用页面类型: 0-无, 1-产品详情页, 2-博客文章, 3-其他
  usedInId?: number;  // 关联的页面 ID（产品ID 或 博客文章ID）
  notes?: string;  // 备注/观察记录
  addedAt?: string;  // 添加时间
  lastUpdatedAt?: string;  // 最后更新时间
}

// SEO关键词详情（包含关联的URL列表）
export interface KeywordDetailDTO {
  id: number;
  keyword: string;
  volume?: number;
  kd?: number;
  intent?: string;
  category?: string;
  status?: number;
  urls?: string[];  // 关联的URL列表
  addedAt?: string;
  lastUpdatedAt?: string;
}

// 关键词关联请求
export interface LinkKeywordRequest {
  pageUrl: string;  // 页面URL
  pageType?: number;  // 页面类型: 0-未指定, 1-产品页, 2-博客文章, 3-分类页, 4-其他
  keywordIds: number[];  // 关键词ID列表
}

// SEO关键词列表响应
export interface SeoKeywordListResponse {
  content: SeoKeyword[];
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  first: boolean;
  last: boolean;
}

// ==================== 报价单相关类型 ====================

// 报价单状态
export type QuotationStatus = 'DRAFT' | 'SENT' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED';

// 报价单项
export interface QuotationItem {
  id?: number;
  productId: number;
  productName?: string;
  productSku?: string;
  productImage?: string;
  quantity: number;
  unitPrice: number;
  subtotal?: number;
  notes?: string;
}

// 报价单
export interface Quotation {
  id?: number;
  siteId?: string;
  quotationNumber: string;
  distributorId?: number;
  distributor?: Distributor;
  title?: string;
  status: QuotationStatus;
  totalAmount: number;
  validUntil?: string;
  tradeTerms?: string;
  sellerCompanyName?: string;
  sellerAddress?: string;
  sellerContactPerson?: string;
  sellerPhone?: string;
  sellerEmail?: string;
  notes?: string;
  internalNotes?: string;
  createdAt?: string;
  updatedAt?: string;
  items?: QuotationItem[];
}

// 报价单列表响应
export interface QuotationListResponse {
  content: Quotation[];
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  first: boolean;
  last: boolean;
}

// ==================== 访问记录相关类型 ====================

// 访问记录类型
export interface VisitRecord {
  id?: number;
  siteId?: string;
  visitType: 'SUPPLIER_VISIT' | 'CUSTOMER_VISIT';
  supplierId?: number;
  supplier?: { id: number; name: string };
  distributorId?: number;
  distributor?: { id: number; name: string; country?: string };
  visitedPerson?: string;
  visitedPosition?: string;
  visitedContact?: string;
  visitDate?: string;
  location?: string;
  purpose?: string;
  summary?: string;
  nextAction?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

// 访问记录列表响应
export interface VisitRecordListResponse {
  content: VisitRecord[];
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  first: boolean;
  last: boolean;
}
