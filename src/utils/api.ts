import { CONFIG } from '../config';

// 基础请求函数
const request = async (endpoint: string, options: RequestInit = {}) => {
    const url = `${CONFIG.apiUrl}${endpoint}`;
    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Network error' }));
        throw new Error(error.detail || 'Request failed');
    }

    return response.json();
};

// API 请求函数
export const api = {
    // KOL相关
    kol: {
        list: (page: number, size: number, filters: any[]) => {
            const params = new URLSearchParams({
                page: page.toString(),
                size: size.toString(),
            });
            
            filters.forEach(filter => {
                const value = filter.value;
                switch (filter.column) {
                    case 'followersK':
                        if (filter.operator === 'greater') {
                            params.append('min_followers', value.toString());
                        } else if (filter.operator === 'less') {
                            params.append('max_followers', value.toString());
                        }
                        break;
                    case 'name':
                    case 'level':
                    case 'gender':
                    case 'location':
                    case 'source':
                    case 'platform':
                    case 'sendStatus':
                        params.append(
                            filter.column === 'sendStatus' ? 'send_status' : filter.column.toLowerCase(),
                            value.toString()
                        );
                        break;
                }
            });

            return request(`/kols?${params.toString()}`);
        },
        update: (id: string, data: any) => request(`/kols/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        }),
        create: (data: any) => request('/kols', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
        delete: (id: string) => request(`/kols/${id}`, {
            method: 'DELETE',
        }),
    },
}; 