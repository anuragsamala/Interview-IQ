let accessTokenInMemory: string | null = null;
let refreshPromise: Promise<string | null> | null = null;

export const setAccessToken = (token: string | null) => {
  accessTokenInMemory = token;
};

export const getAccessToken = () => accessTokenInMemory;

interface ApiOptions extends RequestInit {
  skipAuth?: boolean;
}

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export async function apiFetch(path: string, options: ApiOptions = {}): Promise<any> {
  const { skipAuth = false, ...fetchOptions } = options;
  const url = path.startsWith('http')
    ? path
    : `${API_BASE}${path.startsWith('/') ? path : `/api/v1/${path}`}`;

  // Attach headers
  const headers = new Headers(fetchOptions.headers || {});
  if (!headers.has('Content-Type') && !(fetchOptions.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (!skipAuth && accessTokenInMemory) {
    headers.set('Authorization', `Bearer ${accessTokenInMemory}`);
  }

  fetchOptions.headers = headers;

  let response = await fetch(url, fetchOptions);

  // If unauthorized and possibly expired token, try refresh
  if (response.status === 401 && !skipAuth) {
    try {
      const token = await refreshSession();
      if (token) {
        // Retry original request with new token
        const newHeaders = new Headers(fetchOptions.headers);
        newHeaders.set('Authorization', `Bearer ${token}`);
        fetchOptions.headers = newHeaders;
        response = await fetch(url, fetchOptions);
      }
    } catch (refreshErr) {
      console.warn('Silent session refresh failed:', refreshErr);
    }
  }

  const responseText = await response.text();
  let data: any = {};
  if (responseText) {
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      data = { text: responseText };
    }
  }

  if (!response.ok) {
    const errorMsg = data.message || data.error || `HTTP error! Status: ${response.status}`;
    const error: any = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

async function refreshSession(): Promise<string | null> {
  // Prevent duplicate refresh requests
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const res = await fetch(`${API_BASE}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        throw new Error('Refresh token invalid or expired');
      }

      const data = await res.json();
      setAccessToken(data.accessToken);
      return data.accessToken as string;
    } catch (err) {
      setAccessToken(null);
      // Dispatch an event to alert AuthProvider to log out
      window.dispatchEvent(new Event('auth:unauthorized'));
      throw err;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}
