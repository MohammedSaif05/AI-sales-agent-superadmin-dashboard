import { apiClient } from '../client/apiClient';
import {
  LoginDto,
  LoginResponseData,
  LogoutResponseData,
  RefreshTokenDto,
  RefreshTokenResponseData,
} from '../types/auth.types';
import { ApiResponse } from '../types/common.types';

export const authApi = {
  login(dto: LoginDto): Promise<ApiResponse<LoginResponseData>> {
    return apiClient.post<LoginResponseData>('/auth/login', dto, { skipAuth: true });
  },

  refresh(dto: RefreshTokenDto): Promise<ApiResponse<RefreshTokenResponseData>> {
    return apiClient.post<RefreshTokenResponseData>('/auth/refresh', dto, { skipAuth: true });
  },

  logout(): Promise<ApiResponse<LogoutResponseData>> {
    return apiClient.post<LogoutResponseData>('/auth/logout');
  },
};
