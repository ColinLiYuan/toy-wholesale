import { Income } from '@/types/income';

const API = '/api/v1/incomes';

export const incomeService = {
    async list(type?: string, page = 0, size = 20): Promise<{ content: Income[]; totalPages: number; totalElements: number }> {
        const params = new URLSearchParams({ page: String(page), size: String(size) });
        if (type) params.append('type', type);
        const res = await fetch(`${API}?${params}`);
        const json = await res.json();
        if (json.code !== 200) throw new Error(json.message);
        return json.data;
    },

    async get(id: number): Promise<Income> {
        const res = await fetch(`${API}/${id}`);
        const json = await res.json();
        if (json.code !== 200) throw new Error(json.message);
        return json.data;
    },

    async create(data: Partial<Income>): Promise<Income> {
        const res = await fetch(API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const json = await res.json();
        if (json.code !== 200) throw new Error(json.message);
        return json.data;
    },

    async update(id: number, data: Partial<Income>): Promise<Income> {
        const res = await fetch(`${API}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const json = await res.json();
        if (json.code !== 200) throw new Error(json.message);
        return json.data;
    },

    async delete(id: number): Promise<void> {
        await fetch(`${API}/${id}`, { method: 'DELETE' });
    },
};
