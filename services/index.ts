import apiClient, { UnwrappedAxiosResponse } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/api-config';
import type { VerifyRequest, VerifyResult, Product, ProductListResponse, ApiResult, Gallery, BlogPost, BlogListResponse, Supplier, Distributor, AuthResponse, Lead, FollowUpRecord, LeadListResponse, FollowUpRecordListResponse, OperationAccount, OperationAccountListResponse } from '@/types';

// 防伪验证服务
export const antiCounterfeitService = {
  // 验证防伪码
  async verifyCode(code: string): Promise<VerifyResult> {
    try {
      const response: ApiResult<VerifyResult> = await apiClient.post(
        API_ENDPOINTS.VERIFY_CODE,
        { code } as VerifyRequest
      );
      return response.data;
    } catch (error) {
      console.error('Verification failed:', error);
      throw error;
    }
  },
};

// 供应商服务
export const supplierService = {
  // 获取所有活跃供应商 - GET /v1/suppliers
  async getAllSuppliers(): Promise<Supplier[]> {
    try {
      const apiResult: ApiResult<Supplier[]> = await apiClient.get(
        '/v1/suppliers',
        { params: { isActive: true } }
      );
      
      if (apiResult.code !== 200 || !apiResult.data) {
        console.warn('Supplier API returned error, using fallback data');
        return getFallbackSuppliers();
      }
      
      return apiResult.data || [];
    } catch (error) {
      // API 尚未部署或网络错误，静默使用模拟数据
      console.log('Supplier API not available, using fallback data');
      return getFallbackSuppliers();
    }
  },
};

// 模拟供应商数据（开发环境使用）
function getFallbackSuppliers(): Supplier[] {
  return [
    { id: 1, name: '东莞沃色', code: 'DWS', internalCode: 'WS', isActive: true },
    { id: 2, name: 'Premium Factory B', code: 'PF', internalCode: 'PF', isActive: true },
    { id: 3, name: 'Direct Manufacturer C', code: 'DM', internalCode: 'DM', isActive: true },
  ];
}

// 认证服务
export const authService = {
  // 经销商登录 - POST /api/v1/auth/login
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const apiResult: ApiResult<any> = await apiClient.post(
        '/v1/auth/login',
        { email, password }
      );
      
      console.log('API Result:', apiResult); // 调试日志
      
      if (apiResult.code !== 200) {
        throw new Error(apiResult.message || 'Login failed');
      }
      
      // apiResult.data 就是 AuthResponse 结构 {success, token, distributor}
      const authData = apiResult.data as AuthResponse;
      console.log('Auth data:', authData); // 调试日志
      
      // 后端返回的是 distributor 字段，不是 user
      if (!authData || !authData.token || !authData.distributor) {
        console.error('Missing required fields in auth data:', authData);
        throw new Error('Login failed: Missing token or distributor info');
      }
      
      return authData;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  // 经销商注册 - POST /api/v1/auth/register
  async register(distributor: Partial<Distributor>): Promise<AuthResponse> {
    try {
      const response: ApiResult<AuthResponse> = await apiClient.post(
        '/v1/auth/register',
        distributor
      );
      
      if (response.code !== 200 || !response.data) {
        throw new Error(response.message || 'Registration failed');
      }
      
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },

  // 获取当前用户信息 - GET /api/v1/auth/me
  async getCurrentUser(token: string): Promise<Distributor> {
    try {
      const response: ApiResult<Distributor> = await apiClient.get(
        '/v1/auth/me',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      if (response.code !== 200 || !response.data) {
        throw new Error(response.message || 'Failed to fetch user info');
      }
      
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      throw error;
    }
  },
};

// 产品服务（前端公开接口）
export const productService = {
  // 获取产品列表（支持分页）- GET /v1/products
  async getProducts(page: number = 0, size: number = 12, sortBy = 'createdAt', direction = 'DESC'): Promise<ProductListResponse> {
    try {
      const apiResult: ApiResult<ProductListResponse> = await apiClient.get(
        API_ENDPOINTS.PRODUCTS,
        { params: { page, size, sortBy, direction } }
      );
      
      if (apiResult.code !== 200 || !apiResult.data) {
        throw new Error(apiResult.message || 'Failed to fetch products');
      }
      
      return apiResult.data;
    } catch (error) {
      console.error('Failed to fetch products:', error);
      throw error;
    }
  },

  // 根据 slug 查询产品详情 - GET /v1/products/{slug}
  async getProductDetail(slug: string): Promise<Product> {
    try {
      const apiResult: ApiResult<Product> = await apiClient.get(
        `${API_ENDPOINTS.PRODUCT_DETAIL}/${slug}`
      );
      
      if (apiResult.code !== 200 || !apiResult.data) {
        throw new Error(apiResult.message || 'Failed to fetch product detail');
      }
      
      return apiResult.data;
    } catch (error) {
      console.error('Failed to fetch product detail:', error);
      throw error;
    }
  },

  // 根据分类查询产品 - GET /v1/products/category/{category}
  async getProductsByCategory(category: string, page: number = 0, size: number = 12): Promise<ProductListResponse> {
    try {
      const apiResult: ApiResult<ProductListResponse> = await apiClient.get(
        `${API_ENDPOINTS.PRODUCTS}/category/${category}`,
        { params: { page, size } }
      );
      
      if (apiResult.code !== 200 || !apiResult.data) {
        throw new Error(apiResult.message || 'Failed to fetch products by category');
      }
      
      return apiResult.data;
    } catch (error) {
      console.error('Failed to fetch products by category:', error);
      throw error;
    }
  },

  // 搜索产品 - GET /v1/products/search
  async searchProducts(keyword: string, page: number = 0, size: number = 12): Promise<ProductListResponse> {
    try {
      const apiResult: ApiResult<ProductListResponse> = await apiClient.get(
        `${API_ENDPOINTS.PRODUCTS}/search`,
        { params: { keyword, page, size } }
      );
      
      if (apiResult.code !== 200 || !apiResult.data) {
        throw new Error(apiResult.message || 'Search failed');
      }
      
      return apiResult.data;
    } catch (error) {
      console.error('Search failed:', error);
      throw error;
    }
  },
};

// 产品管理服务（后台管理接口）
export const productAdminService = {
  // 获取所有产品（管理）- GET /v1/products/admin/list
  async getAllProducts(page: number = 0, size: number = 20, sortBy = 'id', direction = 'DESC'): Promise<ProductListResponse> {
    try {
      const apiResult: ApiResult<ProductListResponse> = await apiClient.get(
        API_ENDPOINTS.ADMIN_PRODUCTS,
        { params: { page, size, sortBy, direction } }
      );
      
      if (apiResult.code !== 200 || !apiResult.data) {
        throw new Error(apiResult.message || 'Failed to fetch products');
      }
      
      return apiResult.data;
    } catch (error) {
      console.error('Failed to fetch products:', error);
      throw error;
    }
  },

  // 根据 ID 查询产品（管理）- GET /v1/products/admin/{id}
  async getProductById(id: number): Promise<Product> {
    try {
      const apiResult: ApiResult<Product> = await apiClient.get(
        `${API_ENDPOINTS.ADMIN_PRODUCT_DETAIL}/${id}`
      );
      
      if (apiResult.code !== 200 || !apiResult.data) {
        throw new Error(apiResult.message || 'Failed to fetch product');
      }
      
      return apiResult.data;
    } catch (error) {
      console.error('Failed to fetch product:', error);
      throw error;
    }
  },

  // 创建产品 - POST /v1/products/admin
  async createProduct(product: Partial<Product>): Promise<Product> {
    try {
      const apiResult: ApiResult<Product> = await apiClient.post(
        API_ENDPOINTS.ADMIN_CREATE_PRODUCT,
        product
      );
      
      if (apiResult.code !== 200 || !apiResult.data) {
        throw new Error(apiResult.message || 'Failed to create product');
      }
      
      return apiResult.data;
    } catch (error) {
      console.error('Failed to create product:', error);
      throw error;
    }
  },

  // 更新产品 - PUT /v1/products/admin/{id}
  async updateProduct(id: number, product: Partial<Product>): Promise<Product> {
    try {
      const url = `${API_ENDPOINTS.ADMIN_UPDATE_PRODUCT}/${id}`;
      const requestBody = JSON.stringify(product);
      
      console.log('updateProduct API call:', {
        url: `/api${url}`,
        method: 'PUT',
        contentType: 'application/json; charset=UTF-8',
        bodySize: requestBody.length,
        bodyPreview: requestBody.substring(0, 200),
      });
      
      // 尝试直接使用 fetch 并明确设置 charset
      const response = await fetch(`/api${url}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json',
        },
        body: requestBody,
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response body:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const apiResult = await response.json();
      console.log('updateProduct response:', apiResult);
      
      if (apiResult.code !== 200 || !apiResult.data) {
        throw new Error(apiResult.message || 'Failed to update product');
      }
      
      return apiResult.data;
    } catch (error: any) {
      console.error('Failed to update product:', error);
      throw error;
    }
  },

  // 删除产品 - DELETE /v1/products/admin/{id}
  async deleteProduct(id: number): Promise<void> {
    try {
      const apiResult: ApiResult<void> = await apiClient.delete(
        `${API_ENDPOINTS.ADMIN_DELETE_PRODUCT}/${id}`
      );
      
      if (apiResult.code !== 200) {
        throw new Error(apiResult.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
      throw error;
    }
  },

  // 切换产品状态 - PATCH /v1/products/admin/{id}/status
  async toggleProductStatus(id: number, status: string): Promise<Product> {
    try {
      const apiResult: ApiResult<Product> = await apiClient.patch(
        `${API_ENDPOINTS.ADMIN_TOGGLE_STATUS}/${id}/status`,
        null,
        { params: { status } }
      );
      
      if (apiResult.code !== 200 || !apiResult.data) {
        throw new Error(apiResult.message || 'Failed to toggle status');
      }
      
      return apiResult.data;
    } catch (error) {
      console.error('Failed to toggle status:', error);
      throw error;
    }
  },
};

// 产品相册服务（后台管理接口）
export const galleryAdminService = {
  // 获取产品相册列表 - GET /v1/products/{productId}/galleries
  async getProductGalleries(productId: number): Promise<Gallery[]> {
    try {
      const apiResult: ApiResult<Gallery[]> = await apiClient.get(
        `${API_ENDPOINTS.ADMIN_PRODUCT_GALLERIES}/${productId}/galleries`
      );
      
      if (apiResult.code !== 200 || !apiResult.data) {
        throw new Error(apiResult.message || 'Failed to fetch galleries');
      }
      
      return apiResult.data;
    } catch (error) {
      console.error('Failed to fetch galleries:', error);
      throw error;
    }
  },

  // 获取产品主图 - GET /v1/products/{productId}/primary-image
  async getProductPrimaryImage(productId: number): Promise<Gallery | null> {
    try {
      const apiResult: ApiResult<Gallery> = await apiClient.get(
        `${API_ENDPOINTS.ADMIN_PRODUCT_GALLERIES}/${productId}/primary-image`
      );
      
      if (apiResult.code !== 200) {
        throw new Error(apiResult.message || 'Failed to fetch primary image');
      }
      
      return apiResult.data || null;
    } catch (error) {
      console.error('Failed to fetch primary image:', error);
      return null;
    }
  },

  // 添加单张相册图片 - POST /v1/products/admin/{productId}/galleries
  async addGalleryImage(productId: number, gallery: Partial<Gallery>): Promise<Gallery> {
    try {
      const apiResult: ApiResult<Gallery> = await apiClient.post(
        `${API_ENDPOINTS.ADMIN_GALLERIES}/${productId}/galleries`,
        gallery
      );
      
      if (apiResult.code !== 200 || !apiResult.data) {
        throw new Error(apiResult.message || 'Failed to add gallery image');
      }
      
      return apiResult.data;
    } catch (error) {
      console.error('Failed to add gallery image:', error);
      throw error;
    }
  },

  // 批量添加相册图片 - POST /v1/products/admin/{productId}/galleries/batch
  async batchAddGalleryImages(productId: number, galleries: Partial<Gallery>[]): Promise<Gallery[]> {
    try {
      const apiResult: ApiResult<Gallery[]> = await apiClient.post(
        `${API_ENDPOINTS.ADMIN_GALLERIES_BATCH}/${productId}/galleries/batch`,
        galleries
      );
      
      if (apiResult.code !== 200 || !apiResult.data) {
        throw new Error(apiResult.message || 'Failed to batch add gallery images');
      }
      
      return apiResult.data;
    } catch (error) {
      console.error('Failed to batch add gallery images:', error);
      throw error;
    }
  },

  // 更新相册信息 - PUT /v1/products/admin/galleries/{id}
  async updateGallery(id: number, gallery: Partial<Gallery>): Promise<Gallery> {
    try {
      const apiResult: ApiResult<Gallery> = await apiClient.put(
        `${API_ENDPOINTS.ADMIN_GALLERY_DETAIL}/${id}`,
        gallery
      );
      
      if (apiResult.code !== 200 || !apiResult.data) {
        throw new Error(apiResult.message || 'Failed to update gallery');
      }
      
      return apiResult.data;
    } catch (error) {
      console.error('Failed to update gallery:', error);
      throw error;
    }
  },

  // 删除相册图片 - DELETE /v1/products/admin/galleries/{id}
  async deleteGallery(id: number): Promise<void> {
    try {
      const apiResult: UnwrappedAxiosResponse<ApiResult<void>> = await apiClient.delete(
        `${API_ENDPOINTS.ADMIN_GALLERY_DETAIL}/${id}`
      );
      
      if (apiResult.code !== 200) {
        throw new Error(apiResult.message || 'Failed to delete gallery');
      }
    } catch (error) {
      console.error('Failed to delete gallery:', error);
      throw error;
    }
  },

  // 设置主图 - PATCH /v1/products/admin/galleries/{id}/set-primary
  async setPrimaryImage(id: number): Promise<void> {
    try {
      const apiResult: UnwrappedAxiosResponse<ApiResult<void>> = await apiClient.patch(
        `${API_ENDPOINTS.ADMIN_GALLERY_SET_PRIMARY}/${id}/set-primary`
      );
      
      if (apiResult.code !== 200) {
        throw new Error(apiResult.message || 'Failed to set primary image');
      }
    } catch (error) {
      console.error('Failed to set primary image:', error);
      throw error;
    }
  },

  // 更新排序 - PATCH /v1/products/admin/galleries/{id}/sort
  async updateSortOrder(id: number, sortOrder: number): Promise<void> {
    try {
      const apiResult: UnwrappedAxiosResponse<ApiResult<void>> = await apiClient.patch(
        `${API_ENDPOINTS.ADMIN_GALLERY_SORT}/${id}/sort`,
        null,
        { params: { sortOrder } }
      );
      
      if (apiResult.code !== 200) {
        throw new Error(apiResult.message || 'Failed to update sort order');
      }
    } catch (error) {
      console.error('Failed to update sort order:', error);
      throw error;
    }
  },

  // 删除产品的所有相册 - DELETE /v1/products/admin/{productId}/galleries
  async deleteAllGalleries(productId: number): Promise<void> {
    try {
      const apiResult: UnwrappedAxiosResponse<ApiResult<void>> = await apiClient.delete(
        `${API_ENDPOINTS.ADMIN_GALLERIES}/${productId}/galleries`
      );
      
      if (apiResult.code !== 200) {
        throw new Error(apiResult.message || 'Failed to delete all galleries');
      }
    } catch (error) {
      console.error('Failed to delete all galleries:', error);
      throw error;
    }
  },
};

// 博客服务（前端公开接口）
export const blogService = {
  // 获取已发布博客列表 - GET /v1/blog/posts
  async getPublishedBlogs(page: number = 0, size: number = 10, sortBy = 'publishedAt', direction = 'DESC'): Promise<BlogListResponse> {
    try {
      const apiResult: ApiResult<BlogListResponse> = await apiClient.get(
        API_ENDPOINTS.BLOG_POSTS,
        { params: { page, size, sortBy, direction } }
      );
      
      if (apiResult.code !== 200 || !apiResult.data) {
        throw new Error(apiResult.message || 'Failed to fetch blogs');
      }
      
      return apiResult.data;
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
      throw error;
    }
  },

  // 根据分类获取博客 - GET /v1/blog/posts/category/{category}
  async getBlogsByCategory(category: string, page: number = 0, size: number = 10): Promise<BlogListResponse> {
    try {
      const apiResult: ApiResult<BlogListResponse> = await apiClient.get(
        `${API_ENDPOINTS.BLOG_POSTS_BY_CATEGORY}/${category}`,
        { params: { page, size } }
      );
      
      if (apiResult.code !== 200 || !apiResult.data) {
        throw new Error(apiResult.message || 'Failed to fetch blogs by category');
      }
      
      return apiResult.data;
    } catch (error) {
      console.error('Failed to fetch blogs by category:', error);
      throw error;
    }
  },

  // 搜索博客 - GET /v1/blog/posts/search
  async searchBlogs(keyword: string, page: number = 0, size: number = 10): Promise<BlogListResponse> {
    try {
      const apiResult: ApiResult<BlogListResponse> = await apiClient.get(
        API_ENDPOINTS.BLOG_POSTS_SEARCH,
        { params: { keyword, page, size } }
      );
      
      if (apiResult.code !== 200 || !apiResult.data) {
        throw new Error(apiResult.message || 'Search failed');
      }
      
      return apiResult.data;
    } catch (error) {
      console.error('Search failed:', error);
      throw error;
    }
  },

  // 获取博客详情（通过slug） - GET /v1/blog/posts/{slug}
  async getBlogBySlug(slug: string): Promise<BlogPost> {
    try {
      const apiResult: ApiResult<BlogPost> = await apiClient.get(
        `${API_ENDPOINTS.BLOG_POST_DETAIL}/${slug}`
      );
      
      if (apiResult.code !== 200 || !apiResult.data) {
        throw new Error(apiResult.message || 'Failed to fetch blog');
      }
      
      return apiResult.data;
    } catch (error) {
      console.error('Failed to fetch blog:', error);
      throw error;
    }
  },

  // 获取最新文章 - GET /v1/blog/posts/latest
  async getLatestBlogs(limit: number = 5): Promise<BlogPost[]> {
    try {
      const apiResult: ApiResult<BlogPost[]> = await apiClient.get(
        API_ENDPOINTS.BLOG_POSTS_LATEST,
        { params: { limit } }
      );
      
      if (apiResult.code !== 200 || !apiResult.data) {
        throw new Error(apiResult.message || 'Failed to fetch latest blogs');
      }
      
      return apiResult.data;
    } catch (error) {
      console.error('Failed to fetch latest blogs:', error);
      throw error;
    }
  },

  // 获取热门文章 - GET /v1/blog/posts/popular
  async getPopularBlogs(limit: number = 5): Promise<BlogPost[]> {
    try {
      const apiResult: ApiResult<BlogPost[]> = await apiClient.get(
        API_ENDPOINTS.BLOG_POSTS_POPULAR,
        { params: { limit } }
      );
      
      if (apiResult.code !== 200 || !apiResult.data) {
        throw new Error(apiResult.message || 'Failed to fetch popular blogs');
      }
      
      return apiResult.data;
    } catch (error) {
      console.error('Failed to fetch popular blogs:', error);
      throw error;
    }
  },
};

// 博客管理服务（后台管理接口）
export const blogAdminService = {
  // 获取所有博客（管理） - GET /v1/blog/admin/list
  async getAllBlogs(page: number = 0, size: number = 20, sortBy = 'createdAt', direction = 'DESC'): Promise<BlogListResponse> {
    try {
      const apiResult: ApiResult<BlogListResponse> = await apiClient.get(
        API_ENDPOINTS.ADMIN_BLOG_LIST,
        { params: { page, size, sortBy, direction } }
      );
      
      if (apiResult.code !== 200 || !apiResult.data) {
        throw new Error(apiResult.message || 'Failed to fetch blogs');
      }
      
      return apiResult.data;
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
      throw error;
    }
  },

  // 根据状态查询博客（管理） - GET /v1/blog/admin/list/by-status
  async getBlogsByStatus(
    isPublished: boolean,
    page: number = 0,
    size: number = 20,
    sortBy = 'createdAt',
    direction = 'DESC'
  ): Promise<BlogListResponse> {
    try {
      const apiResult: ApiResult<BlogListResponse> = await apiClient.get(
        `${API_ENDPOINTS.ADMIN_BLOG_LIST}/by-status`,
        { params: { isPublished, page, size, sortBy, direction } }
      );
      
      if (apiResult.code !== 200 || !apiResult.data) {
        throw new Error(apiResult.message || 'Failed to fetch blogs by status');
      }
      
      return apiResult.data;
    } catch (error) {
      console.error('Failed to fetch blogs by status:', error);
      throw error;
    }
  },

  // 根据 ID 查询博客（管理） - GET /v1/blog/admin/{id}
  async getBlogById(id: number): Promise<BlogPost> {
    try {
      const apiResult: ApiResult<BlogPost> = await apiClient.get(
        `${API_ENDPOINTS.ADMIN_BLOG_BY_ID}/${id}`
      );
      
      if (apiResult.code !== 200 || !apiResult.data) {
        throw new Error(apiResult.message || 'Failed to fetch blog');
      }
      
      return apiResult.data;
    } catch (error) {
      console.error('Failed to fetch blog:', error);
      throw error;
    }
  },

  // 创建博客 - POST /v1/blog/posts
  async createBlog(blog: Partial<BlogPost>): Promise<BlogPost> {
    try {
      const apiResult: ApiResult<BlogPost> = await apiClient.post(
        API_ENDPOINTS.ADMIN_BLOG_CREATE,
        blog
      );
      
      if (apiResult.code !== 200 || !apiResult.data) {
        throw new Error(apiResult.message || 'Failed to create blog');
      }
      
      return apiResult.data;
    } catch (error) {
      console.error('Failed to create blog:', error);
      throw error;
    }
  },

  // 更新博客 - PUT /v1/blog/posts/{id}
  async updateBlog(id: number, blog: Partial<BlogPost>): Promise<BlogPost> {
    try {
      const apiResult: ApiResult<BlogPost> = await apiClient.put(
        `${API_ENDPOINTS.ADMIN_BLOG_UPDATE}/${id}`,
        blog
      );
      
      if (apiResult.code !== 200 || !apiResult.data) {
        throw new Error(apiResult.message || 'Failed to update blog');
      }
      
      return apiResult.data;
    } catch (error) {
      console.error('Failed to update blog:', error);
      throw error;
    }
  },

  // 删除博客 - DELETE /v1/blog/posts/{id}
  async deleteBlog(id: number): Promise<void> {
    try {
      const apiResult: ApiResult<void> = await apiClient.delete(
        `${API_ENDPOINTS.ADMIN_BLOG_DELETE}/${id}`
      );
      
      if (apiResult.code !== 200) {
        throw new Error(apiResult.message || 'Failed to delete blog');
      }
    } catch (error) {
      console.error('Failed to delete blog:', error);
      throw error;
    }
  },

  // 发布博客 - POST /v1/blog/posts/{id}/publish
  async publishBlog(id: number): Promise<BlogPost> {
    try {
      const apiResult: ApiResult<BlogPost> = await apiClient.post(
        `${API_ENDPOINTS.ADMIN_BLOG_PUBLISH}/${id}/publish`
      );
      
      if (apiResult.code !== 200 || !apiResult.data) {
        throw new Error(apiResult.message || 'Failed to publish blog');
      }
      
      return apiResult.data;
    } catch (error) {
      console.error('Failed to publish blog:', error);
      throw error;
    }
  },
};

// 潜客管理服务（后台管理接口）
export const leadAdminService = {
  // 获取所有潜客列表 - GET /api/v1/leads
  async getAllLeads(page: number = 0, size: number = 20): Promise<LeadListResponse> {
    try {
      const apiResult: ApiResult<LeadListResponse> = await apiClient.get(
        '/v1/leads',
        { params: { page, size } }
      );
      
      if (apiResult.code !== 200 || !apiResult.data) {
        throw new Error(apiResult.message || 'Failed to fetch leads');
      }
      
      return apiResult.data;
    } catch (error) {
      console.error('Failed to fetch leads:', error);
      throw error;
    }
  },

  // 根据ID查询潜客详情 - GET /api/v1/leads/{id}
  async getLeadById(id: number): Promise<Lead> {
    try {
      const apiResult: ApiResult<Lead> = await apiClient.get(
        `/v1/leads/${id}`
      );
      
      if (apiResult.code !== 200 || !apiResult.data) {
        throw new Error(apiResult.message || 'Failed to fetch lead');
      }
      
      return apiResult.data;
    } catch (error) {
      console.error('Failed to fetch lead:', error);
      throw error;
    }
  },

  // 创建潜客 - POST /api/v1/leads
  async createLead(lead: Partial<Lead>): Promise<Lead> {
    try {
      const apiResult: ApiResult<Lead> = await apiClient.post(
        '/v1/leads',
        lead
      );
      
      if (apiResult.code !== 200 || !apiResult.data) {
        throw new Error(apiResult.message || 'Failed to create lead');
      }
      
      return apiResult.data;
    } catch (error) {
      console.error('Failed to create lead:', error);
      throw error;
    }
  },

  // 更新潜客 - PUT /api/v1/leads/{id}
  async updateLead(id: number, lead: Partial<Lead>): Promise<Lead> {
    try {
      const apiResult: ApiResult<Lead> = await apiClient.put(
        `/v1/leads/${id}`,
        lead
      );
      
      if (apiResult.code !== 200 || !apiResult.data) {
        throw new Error(apiResult.message || 'Failed to update lead');
      }
      
      return apiResult.data;
    } catch (error) {
      console.error('Failed to update lead:', error);
      throw error;
    }
  },

  // 删除潜客 - DELETE /api/v1/leads/{id}
  async deleteLead(id: number): Promise<void> {
    try {
      const apiResult: ApiResult<void> = await apiClient.delete(
        `/v1/leads/${id}`
      );
      
      if (apiResult.code !== 200) {
        throw new Error(apiResult.message || 'Failed to delete lead');
      }
    } catch (error) {
      console.error('Failed to delete lead:', error);
      throw error;
    }
  },

  // 根据状态查询潜客 - GET /api/v1/leads/status/{status}
  async getLeadsByStatus(status: string, page: number = 0, size: number = 20): Promise<LeadListResponse> {
    try {
      const apiResult: ApiResult<LeadListResponse> = await apiClient.get(
        `/v1/leads/status/${status}`,
        { params: { page, size } }
      );
      
      if (apiResult.code !== 200 || !apiResult.data) {
        throw new Error(apiResult.message || 'Failed to fetch leads by status');
      }
      
      return apiResult.data;
    } catch (error) {
      console.error('Failed to fetch leads by status:', error);
      throw error;
    }
  },

  // 搜索潜客 - GET /api/v1/leads/search
  async searchLeads(keyword: string, page: number = 0, size: number = 20): Promise<LeadListResponse> {
    try {
      const apiResult: ApiResult<LeadListResponse> = await apiClient.get(
        '/v1/leads/search',
        { params: { keyword, page, size } }
      );
      
      if (apiResult.code !== 200 || !apiResult.data) {
        throw new Error(apiResult.message || 'Search failed');
      }
      
      return apiResult.data;
    } catch (error) {
      console.error('Search failed:', error);
      throw error;
    }
  },

  // 添加跟进记录 - POST /api/v1/leads/{id}/follow-ups
  async addFollowUp(leadId: number, followUpRecord: Partial<FollowUpRecord>): Promise<FollowUpRecord> {
    try {
      const apiResult: ApiResult<FollowUpRecord> = await apiClient.post(
        `/v1/leads/${leadId}/follow-ups`,
        followUpRecord
      );
      
      if (apiResult.code !== 200 || !apiResult.data) {
        throw new Error(apiResult.message || 'Failed to add follow-up record');
      }
      
      return apiResult.data;
    } catch (error) {
      console.error('Failed to add follow-up record:', error);
      throw error;
    }
  },

  // 获取潜客的跟进记录 - GET /api/v1/leads/{id}/follow-ups
  async getFollowUpRecords(leadId: number, page: number = 0, size: number = 20): Promise<FollowUpRecordListResponse> {
    try {
      const apiResult: ApiResult<FollowUpRecordListResponse> = await apiClient.get(
        `/v1/leads/${leadId}/follow-ups`,
        { params: { page, size } }
      );
      
      if (apiResult.code !== 200 || !apiResult.data) {
        throw new Error(apiResult.message || 'Failed to fetch follow-up records');
      }
      
      return apiResult.data;
    } catch (error) {
      console.error('Failed to fetch follow-up records:', error);
      throw error;
    }
  },

  // 获取需要跟进的潜客 - GET /api/v1/leads/need-follow-up
  async getLeadsNeedFollowUp(): Promise<Lead[]> {
    try {
      const apiResult: ApiResult<Lead[]> = await apiClient.get(
        '/v1/leads/need-follow-up'
      );
      
      if (apiResult.code !== 200 || !apiResult.data) {
        throw new Error(apiResult.message || 'Failed to fetch leads need follow-up');
      }
      
      return apiResult.data;
    } catch (error) {
      console.error('Failed to fetch leads need follow-up:', error);
      throw error;
    }
  },

  // 获取长时间未跟进的潜客 - GET /api/v1/leads/without-follow-up
  async getLeadsWithoutFollowUp(days: number = 7): Promise<Lead[]> {
    try {
      const apiResult: ApiResult<Lead[]> = await apiClient.get(
        '/v1/leads/without-follow-up',
        { params: { days } }
      );
      
      if (apiResult.code !== 200 || !apiResult.data) {
        throw new Error(apiResult.message || 'Failed to fetch leads without follow-up');
      }
      
      return apiResult.data;
    } catch (error) {
      console.error('Failed to fetch leads without follow-up:', error);
      throw error;
    }
  },

  // 转化为经销商 - POST /api/v1/leads/{id}/convert
  async convertToDistributor(leadId: number, distributorId: number): Promise<Lead> {
    try {
      const apiResult: ApiResult<Lead> = await apiClient.post(
        `/v1/leads/${leadId}/convert`,
        { distributorId }
      );
      
      if (apiResult.code !== 200 || !apiResult.data) {
        throw new Error(apiResult.message || 'Failed to convert to distributor');
      }
      
      return apiResult.data;
    } catch (error) {
      console.error('Failed to convert to distributor:', error);
      throw error;
    }
  },

  // 获取统计数据 - GET /api/v1/leads/statistics
  async getStatistics(): Promise<Record<string, any>> {
    try {
      const apiResult: ApiResult<Record<string, any>> = await apiClient.get(
        '/v1/leads/statistics'
      );
      
      if (apiResult.code !== 200 || !apiResult.data) {
        throw new Error(apiResult.message || 'Failed to fetch statistics');
      }
      
      return apiResult.data;
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
      throw error;
    }
  },

  // 更新潜客状态（带状态流转验证） - PATCH /api/v1/leads/{id}/status
  async updateLeadStatus(
    id: number,
    status: string,
    changeReason: string = '',
    operator: string = 'admin'
  ): Promise<Lead> {
    try {
      const apiResult: ApiResult<Lead> = await apiClient.patch(
        `/v1/leads/${id}/status`,
        { status, changeReason, operator }
      );
      
      if (apiResult.code !== 200 || !apiResult.data) {
        throw new Error(apiResult.message || 'Failed to update lead status');
      }
      
      return apiResult.data;
    } catch (error) {
      console.error('Failed to update lead status:', error);
      throw error;
    }
  },

  // 批量更新潜客状态 - PATCH /api/v1/leads/batch/status
  async batchUpdateLeadStatus(
    leadIds: number[],
    status: string,
    changeReason: string = '',
    operator: string = 'admin'
  ): Promise<Record<string, any>> {
    try {
      const apiResult: ApiResult<Record<string, any>> = await apiClient.patch(
        '/v1/leads/batch/status',
        { leadIds, status, changeReason, operator }
      );
      
      if (apiResult.code !== 200 || !apiResult.data) {
        throw new Error(apiResult.message || 'Failed to batch update lead status');
      }
      
      return apiResult.data;
    } catch (error) {
      console.error('Failed to batch update lead status:', error);
      throw error;
    }
  },

  // 获取潜客的状态变更历史 - GET /api/v1/leads/{id}/status-history
  async getStatusHistory(
    leadId: number,
    page: number = 0,
    size: number = 20
  ): Promise<any> {
    try {
      const apiResult: ApiResult<any> = await apiClient.get(
        `/v1/leads/${leadId}/status-history`,
        { params: { page, size } }
      );
      
      if (apiResult.code !== 200 || !apiResult.data) {
        throw new Error(apiResult.message || 'Failed to fetch status history');
      }
      
      return apiResult.data;
    } catch (error) {
      console.error('Failed to fetch status history:', error);
      throw error;
    }
  },
};

// 运营账号服务（后台管理接口）
export const operationAccountService = {
  // 创建账号 - POST /api/v1/operation-accounts
  async createAccount(account: Partial<OperationAccount>): Promise<OperationAccount> {
    try {
      const apiResult: ApiResult<OperationAccount> = await apiClient.post(
        '/v1/operation-accounts',
        account
      );
      
      if (apiResult.code !== 200 || !apiResult.data) {
        throw new Error(apiResult.message || 'Failed to create account');
      }
      
      return apiResult.data;
    } catch (error) {
      console.error('Failed to create account:', error);
      throw error;
    }
  },

  // 更新账号 - PUT /api/v1/operation-accounts/{id}
  async updateAccount(id: number, account: Partial<OperationAccount>): Promise<OperationAccount> {
    try {
      const apiResult: ApiResult<OperationAccount> = await apiClient.put(
        `/v1/operation-accounts/${id}`,
        account
      );
      
      if (apiResult.code !== 200 || !apiResult.data) {
        throw new Error(apiResult.message || 'Failed to update account');
      }
      
      return apiResult.data;
    } catch (error) {
      console.error('Failed to update account:', error);
      throw error;
    }
  },

  // 获取所有账号（分页） - GET /api/v1/operation-accounts
  async getAllAccounts(page: number = 0, size: number = 20): Promise<OperationAccountListResponse> {
    try {
      const apiResult: ApiResult<OperationAccountListResponse> = await apiClient.get(
        '/v1/operation-accounts',
        { params: { page, size } }
      );
      
      if (apiResult.code !== 200 || !apiResult.data) {
        throw new Error(apiResult.message || 'Failed to fetch accounts');
      }
      
      return apiResult.data;
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
      throw error;
    }
  },

  // 根据ID查询账号 - GET /api/v1/operation-accounts/{id}
  async getAccountById(id: number): Promise<OperationAccount> {
    try {
      const apiResult: ApiResult<OperationAccount> = await apiClient.get(
        `/v1/operation-accounts/${id}`
      );
      
      if (apiResult.code !== 200 || !apiResult.data) {
        throw new Error(apiResult.message || 'Failed to fetch account');
      }
      
      return apiResult.data;
    } catch (error) {
      console.error('Failed to fetch account:', error);
      throw error;
    }
  },

  // 根据业务线查询账号 - GET /api/v1/operation-accounts/business-line/{businessLine}
  async getAccountsByBusinessLine(businessLine: string): Promise<OperationAccount[]> {
    try {
      const apiResult: ApiResult<OperationAccount[]> = await apiClient.get(
        `/v1/operation-accounts/business-line/${businessLine}`
      );
      
      if (apiResult.code !== 200 || !apiResult.data) {
        throw new Error(apiResult.message || 'Failed to fetch accounts');
      }
      
      return apiResult.data;
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
      throw error;
    }
  },

  // 根据账号类型查询 - GET /api/v1/operation-accounts/type/{accountType}
  async getAccountsByType(accountType: string): Promise<OperationAccount[]> {
    try {
      const apiResult: ApiResult<OperationAccount[]> = await apiClient.get(
        `/v1/operation-accounts/type/${accountType}`
      );
      
      if (apiResult.code !== 200 || !apiResult.data) {
        throw new Error(apiResult.message || 'Failed to fetch accounts');
      }
      
      return apiResult.data;
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
      throw error;
    }
  },

  // 根据业务线和账号类型查询 - GET /api/v1/operation-accounts/filter
  async getAccountsByFilter(businessLine: string, accountType: string): Promise<OperationAccount[]> {
    try {
      const apiResult: ApiResult<OperationAccount[]> = await apiClient.get(
        '/v1/operation-accounts/filter',
        { params: { businessLine, accountType } }
      );
      
      if (apiResult.code !== 200 || !apiResult.data) {
        throw new Error(apiResult.message || 'Failed to fetch accounts');
      }
      
      return apiResult.data;
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
      throw error;
    }
  },

  // 搜索账号 - GET /api/v1/operation-accounts/search
  async searchAccounts(keyword: string, page: number = 0, size: number = 20): Promise<OperationAccountListResponse> {
    try {
      const apiResult: ApiResult<OperationAccountListResponse> = await apiClient.get(
        '/v1/operation-accounts/search',
        { params: { keyword, page, size } }
      );
      
      if (apiResult.code !== 200 || !apiResult.data) {
        throw new Error(apiResult.message || 'Search failed');
      }
      
      return apiResult.data;
    } catch (error) {
      console.error('Search failed:', error);
      throw error;
    }
  },

  // 删除账号 - DELETE /api/v1/operation-accounts/{id}
  async deleteAccount(id: number): Promise<void> {
    try {
      const apiResult: ApiResult<void> = await apiClient.delete(
        `/v1/operation-accounts/${id}`
      );
      
      if (apiResult.code !== 200) {
        throw new Error(apiResult.message || 'Failed to delete account');
      }
    } catch (error) {
      console.error('Failed to delete account:', error);
      throw error;
    }
  },

  // 获取统计数据 - GET /api/v1/operation-accounts/statistics
  async getStatistics(): Promise<Record<string, any>> {
    try {
      const apiResult: ApiResult<Record<string, any>> = await apiClient.get(
        '/v1/operation-accounts/statistics'
      );
      
      if (apiResult.code !== 200 || !apiResult.data) {
        throw new Error(apiResult.message || 'Failed to fetch statistics');
      }
      
      return apiResult.data;
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
      throw error;
    }
  },
};
