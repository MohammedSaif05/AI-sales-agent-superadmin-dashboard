import { AuthTokens, AuthUser } from '../types/auth.types';

const ACCESS_TOKEN_KEY = 'sa_access_token';
const REFRESH_TOKEN_KEY = 'sa_refresh_token';
const USER_KEY = 'sa_user';

// In-memory token cache
let memoryAccessToken: string | null = null;
let memoryRefreshToken: string | null = null;
let memoryUser: AuthUser | null = null;

export const tokenStorage = {
  getAccessToken(): string | null {
    if (memoryAccessToken) return memoryAccessToken;
    if (typeof window !== 'undefined') {
      try {
        memoryAccessToken = sessionStorage.getItem(ACCESS_TOKEN_KEY);
      } catch {
        // Storage access restricted
      }
    }
    return memoryAccessToken;
  },

  getRefreshToken(): string | null {
    if (memoryRefreshToken) return memoryRefreshToken;
    if (typeof window !== 'undefined') {
      try {
        memoryRefreshToken = sessionStorage.getItem(REFRESH_TOKEN_KEY);
      } catch {
        // Storage access restricted
      }
    }
    return memoryRefreshToken;
  },

  getUser(): AuthUser | null {
    if (memoryUser) return memoryUser;
    if (typeof window !== 'undefined') {
      try {
        const raw = sessionStorage.getItem(USER_KEY);
        if (raw) {
          memoryUser = JSON.parse(raw);
        }
      } catch {
        // Parsing or storage error
      }
    }
    return memoryUser;
  },

  setAuth(tokens: AuthTokens, user?: AuthUser): void {
    memoryAccessToken = tokens.accessToken;
    memoryRefreshToken = tokens.refreshToken;
    if (user) memoryUser = user;

    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
        sessionStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
        if (user) {
          sessionStorage.setItem(USER_KEY, JSON.stringify(user));
        }
      } catch {
        // Storage access restricted
      }
    }
  },

  setAccessToken(accessToken: string): void {
    memoryAccessToken = accessToken;
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
      } catch {
        // Storage access restricted
      }
    }
  },

  setTokens(accessToken: string, refreshToken: string): void {
    memoryAccessToken = accessToken;
    memoryRefreshToken = refreshToken;
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      } catch {
        // Storage access restricted
      }
    }
  },

  clear(): void {
    memoryAccessToken = null;
    memoryRefreshToken = null;
    memoryUser = null;

    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem(ACCESS_TOKEN_KEY);
        sessionStorage.removeItem(REFRESH_TOKEN_KEY);
        sessionStorage.removeItem(USER_KEY);
      } catch {
        // Storage access restricted
      }
    }
  },
};
