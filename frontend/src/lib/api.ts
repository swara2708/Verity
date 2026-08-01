const API_BASE = '/api';

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

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();
  if (!res.ok) {
    const errorMsg = data?.detail?.message || data?.detail?.error || data?.error || 'Request failed';
    throw new Error(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
  }

  return data as T;
}
