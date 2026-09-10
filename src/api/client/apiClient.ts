import { ApiResponse, ApiErrorResponse } from '../types/common.types';
import { ApiError } from './apiError';
import { tokenStorage } from './tokenStorage';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1';

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>;
  skipAuth?: boolean;
}

// Single-flight refresh mutex to prevent duplicate concurrent refresh calls
let refreshPromise: Promise<string | null> | null = null;

async function executeTokenRefresh(): Promise<string | null> {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) {
    tokenStorage.clear();
    return null;
  }

  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      tokenStorage.clear();
      return null;
    }

    const payload = await res.json();
    if (payload.success && payload.data?.accessToken) {
      const { accessToken, refreshToken: newRefreshToken } = payload.data;
      tokenStorage.setTokens(accessToken, newRefreshToken || refreshToken);
      return accessToken;
    }

    tokenStorage.clear();
    return null;
  } catch {
    tokenStorage.clear();
    return null;
  }
}

function handleUnauthorizedRedirect(): void {
  if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/admin/login')) {
    const targetUrl = new URL('/admin/login?error=session_expired', window.location.origin).href;
    window.location.assign(targetUrl);
  }
}

export async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  const { params, skipAuth = false, headers = {}, ...customConfig } = options;

  let url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes('?') ? '&' : '?') + queryString;
    }
  }

  const reqHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(headers as Record<string, string>),
  };

  if (!skipAuth) {
    const token = tokenStorage.getAccessToken();
    if (token) {
      reqHeaders.Authorization = `Bearer ${token}`;
    }
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...customConfig,
      headers: reqHeaders,
    });
  } catch (networkError) {
    throw ApiError.fromUnknown(networkError, endpoint);
  }

  // Handle 401 Unauthorized with single-flight silent token refresh
  if (response.status === 401 && !skipAuth && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/refresh')) {
    if (!refreshPromise) {
      refreshPromise = executeTokenRefresh().finally(() => {
        refreshPromise = null;
      });
    }

    const newAccessToken = await refreshPromise;

    if (newAccessToken) {
      // Retry original request with newly rotated access token
      reqHeaders.Authorization = `Bearer ${newAccessToken}`;
      try {
        response = await fetch(url, {
          ...customConfig,
          headers: reqHeaders,
        });
      } catch (retryError) {
        throw ApiError.fromUnknown(retryError, endpoint);
      }
    } else {
      handleUnauthorizedRedirect();
      throw new ApiError({
        success: false,
        statusCode: 401,
        errorCode: 'UNAUTHORIZED',
        message: 'Session expired. Please log in again.',
        timestamp: new Date().toISOString(),
        path: endpoint,
      });
    }
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    const errObj = payload as ApiErrorResponse | null;
    throw new ApiError({
      success: false,
      statusCode: response.status,
      errorCode: errObj?.errorCode || `HTTP_${response.status}`,
      message: errObj?.message || response.statusText || 'Request failed',
      details: errObj?.details,
      timestamp: errObj?.timestamp || new Date().toISOString(),
      path: errObj?.path || endpoint,
    });
  }

  // Return standard ApiResponse envelope
  return payload as ApiResponse<T>;
}

export const apiClient = {
  get<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return request<T>(endpoint, { ...options, method: 'GET' });
  },

  post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  },

  put<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  },

  patch<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  },

  delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return request<T>(endpoint, { ...options, method: 'DELETE' });
  },
};
