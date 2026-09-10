import { apiClient } from '../client/apiClient';
import {
  BusinessDetailData,
  BusinessListItem,
  CustomerItem,
  DashboardStats,
  GlobalImportItem,
  ImportDetailData,
} from '../types/admin.types';
import { ApiResponse, PaginationQuery } from '../types/common.types';

export const adminApi = {
  /**
   * GET /api/v1/admin/dashboard
   * System-wide statistics for Super Admin overview
   */
  getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return apiClient.get<DashboardStats>('/admin/dashboard');
  },

  /**
   * GET /api/v1/admin/businesses
   * Paginated directory of all businesses across tenants with owner and stats
   */
  getBusinesses(query?: PaginationQuery): Promise<ApiResponse<BusinessListItem[]>> {
    return apiClient.get<BusinessListItem[]>('/admin/businesses', {
      params: {
        page: query?.page,
        limit: query?.limit,
        search: query?.search,
        sortBy: query?.sortBy,
        sortOrder: query?.sortOrder,
      },
    });
  },

  /**
   * GET /api/v1/admin/businesses/:id
   * Deep inspection of store profile, members, and operating hours
   */
  getBusinessDetail(id: string): Promise<ApiResponse<BusinessDetailData>> {
    return apiClient.get<BusinessDetailData>(`/admin/businesses/${encodeURIComponent(id)}`);
  },

  /**
   * GET /api/v1/admin/businesses/:id/customers
   * Cross-tenant customer inspection for administrative audit
   */
  getBusinessCustomers(
    id: string,
    query?: PaginationQuery,
  ): Promise<ApiResponse<CustomerItem[]>> {
    return apiClient.get<CustomerItem[]>(`/admin/businesses/${encodeURIComponent(id)}/customers`, {
      params: {
        page: query?.page,
        limit: query?.limit,
        search: query?.search,
        sortBy: query?.sortBy,
        sortOrder: query?.sortOrder,
      },
    });
  },

  /**
   * GET /api/v1/admin/imports
   * Global import audit log across all businesses (uses page & limit)
   */
  getGlobalImports(query?: PaginationQuery): Promise<ApiResponse<GlobalImportItem[]>> {
    return apiClient.get<GlobalImportItem[]>('/admin/imports', {
      params: {
        page: query?.page,
        limit: query?.limit,
      },
    });
  },

  /**
   * GET /api/v1/admin/imports/:id
   * Deep inspection of an individual import job, rows breakdown, and errors
   */
  getImportDetail(id: string): Promise<ApiResponse<ImportDetailData>> {
    return apiClient.get<ImportDetailData>(`/admin/imports/${encodeURIComponent(id)}`);
  },
};
