import apiClient, { UnwrappedAxiosResponse } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/api-config';
import type { VerifyRequest, VerifyResult, Product, ProductListResponse, ApiResult, Gallery, BlogPost, BlogListResponse } from '@/types';

// 防伪验证服务
export const antiCounterfeitService = {
  // 验证防伪码
  async verifyCode(code: string): Promise<VerifyResult> {
    try {
      const response = await apiClient.post<ApiResult<VerifyResult>>(
        API_ENDPOINTS.VERIFY_CODE,
        { code } as VerifyRequest
      );
      return response.data.data;
    } catch (error) {
      console.error('Verification failed:', error);
      throw error;
    }
  },
};

// 产品服务（前端公开接口）
export const productService = {
  // 获取产品列表（支持分页）- GET /v1/products
  async getProducts(page: number = 0, size: number = 12, sortBy = 'createdAt', direction = 'DESC'): Promise<ProductListResponse> {
    try {
      const apiResult: UnwrappedAxiosResponse<ApiResult<ProductListResponse>> = await apiClient.get(
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
      const apiResult: UnwrappedAxiosResponse<ApiResult<Product>> = await apiClient.get(
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
      const apiResult: UnwrappedAxiosResponse<ApiResult<ProductListResponse>> = await apiClient.get(
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
      const apiResult: UnwrappedAxiosResponse<ApiResult<ProductListResponse>> = await apiClient.get(
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
      const apiResult: UnwrappedAxiosResponse<ApiResult<ProductListResponse>> = await apiClient.get(
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
      const apiResult: UnwrappedAxiosResponse<ApiResult<Product>> = await apiClient.get(
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
      const apiResult: UnwrappedAxiosResponse<ApiResult<Product>> = await apiClient.post(
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
      console.log('updateProduct API call:', {
        url,
        product,
        fullUrl: `http://localhost:3000/api${url}`,
      });
      
      const apiResult: UnwrappedAxiosResponse<ApiResult<Product>> = await apiClient.put(
        url,
        product
      );
      
      console.log('updateProduct response:', apiResult);
      
      if (apiResult.code !== 200 || !apiResult.data) {
        throw new Error(apiResult.message || 'Failed to update product');
      }
      
      return apiResult.data;
    } catch (error) {
      console.error('Failed to update product:', error);
      throw error;
    }
  },

  // 删除产品 - DELETE /v1/products/admin/{id}
  async deleteProduct(id: number): Promise<void> {
    try {
      const apiResult: UnwrappedAxiosResponse<ApiResult<void>> = await apiClient.delete(
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
      const apiResult: UnwrappedAxiosResponse<ApiResult<Product>> = await apiClient.patch(
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
      const apiResult: UnwrappedAxiosResponse<ApiResult<Gallery[]>> = await apiClient.get(
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
      const apiResult: UnwrappedAxiosResponse<ApiResult<Gallery>> = await apiClient.get(
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
      const apiResult: UnwrappedAxiosResponse<ApiResult<Gallery>> = await apiClient.post(
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
      const apiResult: UnwrappedAxiosResponse<ApiResult<Gallery[]>> = await apiClient.post(
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
      const apiResult: UnwrappedAxiosResponse<ApiResult<Gallery>> = await apiClient.put(
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
      const apiResult: UnwrappedAxiosResponse<ApiResult<BlogListResponse>> = await apiClient.get(
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
      const apiResult: UnwrappedAxiosResponse<ApiResult<BlogListResponse>> = await apiClient.get(
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
      const apiResult: UnwrappedAxiosResponse<ApiResult<BlogListResponse>> = await apiClient.get(
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
      const apiResult: UnwrappedAxiosResponse<ApiResult<BlogPost>> = await apiClient.get(
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
      const apiResult: UnwrappedAxiosResponse<ApiResult<BlogPost[]>> = await apiClient.get(
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
      const apiResult: UnwrappedAxiosResponse<ApiResult<BlogPost[]>> = await apiClient.get(
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
      const apiResult: UnwrappedAxiosResponse<ApiResult<BlogListResponse>> = await apiClient.get(
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
      const apiResult: UnwrappedAxiosResponse<ApiResult<BlogListResponse>> = await apiClient.get(
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
      const apiResult: UnwrappedAxiosResponse<ApiResult<BlogPost>> = await apiClient.get(
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
      const apiResult: UnwrappedAxiosResponse<ApiResult<BlogPost>> = await apiClient.post(
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
      const apiResult: UnwrappedAxiosResponse<ApiResult<BlogPost>> = await apiClient.put(
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
      const apiResult: UnwrappedAxiosResponse<ApiResult<void>> = await apiClient.delete(
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
      const apiResult: UnwrappedAxiosResponse<ApiResult<BlogPost>> = await apiClient.post(
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
