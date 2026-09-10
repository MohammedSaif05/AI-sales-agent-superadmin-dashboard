export enum SystemRole {
  USER = 'USER',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum BusinessRole {
  OWNER = 'OWNER',
  STAFF = 'STAFF',
}

export interface AuthUser {
  id: string;
  phone: string;
  name: string | null;
  systemRole: SystemRole;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginDto {
  phone: string;
  password: string;
  deviceInfo?: string;
}

export interface RefreshTokenDto {
  refreshToken: string;
}

export interface LoginResponseData {
  user: AuthUser;
  business: {
    id: string;
    name: string;
    role: BusinessRole;
  } | null;
  tokens: AuthTokens;
}

export interface RefreshTokenResponseData {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LogoutResponseData {
  message: string;
}
