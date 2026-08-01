const envApiUrl = (import.meta.env.VITE_API_URL as string) || '';
const cleanApiUrl = envApiUrl.endsWith('/') ? envApiUrl.slice(0, -1) : envApiUrl;

export const API_BASE = cleanApiUrl
  ? (cleanApiUrl.endsWith('/api') ? cleanApiUrl : `${cleanApiUrl}/api`)
  : '/api';

export function getAuthToken(): string | null {
  return localStorage.getItem('verity_token');
}

export function setAuthToken(token: string) {
  localStorage.setItem('verity_token', token);
}

export function removeAuthToken() {
  localStorage.removeItem('verity_token');
}

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const targetUrl = `${API_BASE}${endpoint}`;

  const res = await fetch(targetUrl, {
    ...options,
    headers,
  });

  const contentType = res.headers.get('content-type');
  let data: any;

  if (contentType && contentType.includes('application/json')) {
    data = await res.json();
  } else {
    const text = await res.text();
    if (!res.ok) {
      throw new Error(`API Connection Error (${res.status}): Please check backend service status at ${targetUrl}`);
    }
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const errorMsg = data?.detail?.message || data?.detail?.error || data?.error || `Request failed with HTTP ${res.status}`;
    throw new Error(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
  }

  return data as T;
}
