import { API_TOKEN, API_URL } from '@/config/env';
import type { SearchResponse, StreamUrlResponse, TrackDetail } from './types';

class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

function authHeaders(): Record<string, string> {
  return API_TOKEN ? { 'x-api-token': API_TOKEN } : {};
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      Accept: 'application/json',
      ...authHeaders(),
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new ApiError(text || res.statusText, res.status);
  }
  return res.json() as Promise<T>;
}

export const api = {
  async search(query: string, limit = 20): Promise<SearchResponse> {
    const url = `/api/search?q=${encodeURIComponent(query)}&limit=${limit}`;
    return request<SearchResponse>(url);
  },

  async info(id: string): Promise<TrackDetail> {
    return request<TrackDetail>(`/api/info/${encodeURIComponent(id)}`);
  },

  async streamUrl(id: string): Promise<StreamUrlResponse> {
    return request<StreamUrlResponse>(`/api/stream-url/${encodeURIComponent(id)}`);
  },

  streamProxyUrl(id: string): string {
    const tokenParam = API_TOKEN ? `?token=${encodeURIComponent(API_TOKEN)}` : '';
    return `${API_URL}/api/stream/${encodeURIComponent(id)}${tokenParam}`;
  },

  async health(): Promise<{ ok: boolean }> {
    return request('/health');
  },
};

export { ApiError };
