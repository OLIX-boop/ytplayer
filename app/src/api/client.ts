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
  const fullUrl = `${API_URL}${path}`;
  let res: Response;
  try {
    res = await fetch(fullUrl, {
      ...init,
      headers: {
        Accept: 'application/json',
        ...authHeaders(),
        ...(init?.headers || {}),
      },
    });
  } catch (err) {
    const msg = (err as Error).message || 'Errore sconosciuto';
    throw new ApiError(
      `Impossibile contattare il backend.\n\nURL: ${fullUrl}\nErrore: ${msg}\n\nVerifica:\n• Tailscale attivo su iPhone e server\n• Backend in esecuzione (npm start)\n• EXPO_PUBLIC_API_URL nei GitHub Secrets è corretto`,
      0
    );
  }
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new ApiError(`${res.status} ${res.statusText}\n${text}\n\nURL: ${fullUrl}`, res.status);
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
