import { Income } from '@/types/income';

const API = '/api/v1/incomes';

function getHeaders(): Record<string, string> {
  const siteId = typeof window !== 'undefined' ? localStorage.getItem('admin_site_id') || 'toy' : 'toy';
  return { 'X-Site-Id': siteId, 'Content-Type': 'application/json' };
}

export const incomeService = {
    async list(type?: string, page = 0, size = 20): Promise<{ content: Income[]; totalPages: number; totalElements: number }> {
        const params = new URLSearchParams({ page: String(page), size: String(size) });
        if (type) params.append('type', type);
        const res = await fetch(`${API}?${params}`, { headers: getHeaders() });
        const json = await res.json();
        if (json.code !== 200) throw new Error(json.message);
        return json.data;
    },

    async get(id: number): Promise<Income> {
        const res = await fetch(`${API}/${id}`, { headers: getHeaders() });
        const json = await res.json();
        if (json.code !== 200) throw new Error(json.message);
        return json.data;
    },

    async create(data: Partial<Income>): Promise<Income> {
        const res = await fetch(API, { method: 'POST', headers: getHeaders(), body: JSON.stringify(data) });
        const json = await res.json();
        if (json.code !== 200) throw new Error(json.message);
        return json.data;
    },

    async update(id: number, data: Partial<Income>): Promise<Income> {
        const res = await fetch(`${API}/${id}`, { method: 'PUT', headers: getHeaders(), body: JSON.stringify(data) });
        const json = await res.json();
        if (json.code !== 200) throw new Error(json.message);
        return json.data;
    },

    async remove(id: number): Promise<void> {
        const res = await fetch(`${API}/${id}`, { method: 'DELETE', headers: getHeaders() });
        if (!res.ok) throw new Error('Delete failed');
    },
};
