import apiClient from '@/lib/api-client';
import type { ApiResult } from '@/types';
import type { Expense } from '@/types/expense';

export const expenseAdminService = {
  // 获取支出列表 - GET /api/v1/expenses?type=管理/销售
  async getAllExpenses(type?: string, page: number = 0, size: number = 20) {
    try {
      const params: any = { page, size };
      if (type) params.type = type;
      const apiResult: ApiResult<any> = await apiClient.get('/v1/expenses', { params });

      if (apiResult.code !== 200 || !apiResult.data) {
        throw new Error(apiResult.message || 'Failed to fetch expenses');
      }

      return apiResult.data;
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
      throw error;
    }
  },

  async getExpenseById(id: number): Promise<Expense> {
    try {
      const apiResult: ApiResult<Expense> = await apiClient.get(`/v1/expenses/${id}`);
      if (apiResult.code !== 200 || !apiResult.data) {
        throw new Error(apiResult.message || 'Failed to fetch expense');
      }
      return apiResult.data;
    } catch (error) {
      console.error('Failed to fetch expense:', error);
      throw error;
    }
  },

  async createExpense(expense: Partial<Expense>): Promise<Expense> {
    try {
      const apiResult: ApiResult<Expense> = await apiClient.post('/v1/expenses', expense);
      if (apiResult.code !== 200 || !apiResult.data) {
        throw new Error(apiResult.message || 'Failed to create expense');
      }
      return apiResult.data;
    } catch (error) {
      console.error('Failed to create expense:', error);
      throw error;
    }
  },

  async updateExpense(id: number, expense: Partial<Expense>): Promise<Expense> {
    try {
      const apiResult: ApiResult<Expense> = await apiClient.put(`/v1/expenses/${id}`, expense);
      if (apiResult.code !== 200 || !apiResult.data) {
        throw new Error(apiResult.message || 'Failed to update expense');
      }
      return apiResult.data;
    } catch (error) {
      console.error('Failed to update expense:', error);
      throw error;
    }
  },

  async deleteExpense(id: number): Promise<void> {
    try {
      const apiResult: ApiResult<void> = await apiClient.delete(`/v1/expenses/${id}`);
      if (apiResult.code !== 200) {
        throw new Error(apiResult.message || 'Failed to delete expense');
      }
    } catch (error) {
      console.error('Failed to delete expense:', error);
      throw error;
    }
  },
};
