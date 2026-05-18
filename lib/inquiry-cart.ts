import type { InquiryCartItem, InquiryCart } from '@/types';
import apiClient, { UnwrappedAxiosResponse } from './api-client';
import { getSessionId } from './session-id';

/**
 * 询盘车工具类 - 使用后端 API 管理询盘车数据
 * 支持游客模式（Session ID）和登录用户模式（Token）
 */
export const inquiryCartUtils = {
  // 获取请求头（包含 sessionId 或 token）
  getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};
    
    // 尝试获取 token（登录用户）
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      } else {
        // 没有 token，使用 sessionId（游客）
        const sessionId = getSessionId();
        if (sessionId) {
          headers['X-Session-Id'] = sessionId;
        }
      }
    }
    
    return headers;
  },

  // 添加商品到询盘车
  async addItem(item: Omit<InquiryCartItem, 'id'>): Promise<any> {
    try {
      const headers = this.getHeaders();
      
      const response: UnwrappedAxiosResponse<any> = await apiClient.post(
        '/v1/inquiry-cart/add',
        {
          productId: item.productId,
          skuId: item.skuId || null,
          quantity: item.quantity,
          notes: item.notes || '',
        },
        { headers }
      );

      return response.data;
    } catch (error) {
      console.error('Failed to add item to inquiry cart:', error);
      throw error;
    } finally {
      // 触发事件更新 Header 角标
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('inquiryCartUpdated'));
      }
    }
  },

  // 获取询盘车列表
  async getCartItems(): Promise<InquiryCartItem[]> {
    try {
      const headers = this.getHeaders();
      
      const response: UnwrappedAxiosResponse<any> = await apiClient.get(
        '/v1/inquiry-cart/list',
        { headers }
      );

      if (response.code === 200 && response.data) {
        // 转换后端数据格式为前端格式
        return response.data.map((item: any) => ({
          id: item.id,
          productId: item.productId,
          productName: item.productName,
          productImage: item.productImage,
          skuId: item.skuId,
          skuCode: item.skuCode,
          color: item.color,
          quantity: item.quantity,
          specifications: item.specifications ? JSON.parse(item.specifications) : undefined,
          notes: item.notes,
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Failed to get cart items:', error);
      return [];
    }
  },

  // 更新商品数量
  async updateQuantity(cartItemId: number, quantity: number): Promise<void> {
    try {
      const headers = this.getHeaders();
      
      const response: UnwrappedAxiosResponse<any> = await apiClient.put(
        `/v1/inquiry-cart/update/${cartItemId}`,
        { quantity },
        { headers }
      );

      return response.data;
    } catch (error) {
      console.error('Failed to update quantity:', error);
      throw error;
    } finally {
      // 触发事件更新 Header 角标
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('inquiryCartUpdated'));
      }
    }
  },

  // 删除商品
  async removeItem(cartItemId: number): Promise<void> {
    try {
      const headers = this.getHeaders();
      
      await apiClient.delete(
        `/v1/inquiry-cart/remove/${cartItemId}`,
        { headers }
      );
    } catch (error) {
      console.error('Failed to remove item:', error);
      throw error;
    } finally {
      // 触发事件更新 Header 角标
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('inquiryCartUpdated'));
      }
    }
  },

  // 清空询盘车
  async clearCart(): Promise<void> {
    try {
      const headers = this.getHeaders();
      
      await apiClient.delete(
        '/v1/inquiry-cart/clear',
        { headers }
      );
    } catch (error) {
      console.error('Failed to clear cart:', error);
      throw error;
    } finally {
      // 触发事件更新 Header 角标
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('inquiryCartUpdated'));
      }
    }
  },

  // 获取询盘车商品数量
  async getItemCount(): Promise<number> {
    try {
      const headers = this.getHeaders();
      
      const response: UnwrappedAxiosResponse<any> = await apiClient.get(
        '/v1/inquiry-cart/count',
        { headers }
      );

      if (response.code === 200 && response.data) {
        return response.data.count || 0;
      }
      
      return 0;
    } catch (error) {
      console.error('Failed to get cart count:', error);
      return 0;
    }
  },

  // 将询盘车转换为询单项（提交时使用）
  convertToInquiryItems(cartItems: InquiryCartItem[]): any[] {
    return cartItems.map((item) => ({
      productId: item.productId,
      skuId: item.skuId,
      quantity: item.quantity,
      productName: item.productName,
      productImage: item.productImage,
      specifications: item.specifications ? JSON.stringify(item.specifications) : undefined,
      notes: item.notes,
    }));
  },
};
