import { apiClient } from '../client/apiClient';
import {
  AnalysisQuery,
  AnalysisRecordItem,
  AnalystSummaryData,
  PaginatedAnalysesData,
  PaginatedQuestionsData,
  QuestionQuery,
} from '../types/analyst.types';
import { ApiResponse } from '../types/common.types';

export const analystApi = {
  /**
   * GET /api/v1/admin/businesses/:id/analyst-summary
   * Trailing 30-day AI Business Analyst summary for a business
   */
  getBusinessAnalystSummary(businessId: string): Promise<ApiResponse<AnalystSummaryData>> {
    return apiClient.get<AnalystSummaryData>(
      `/admin/businesses/${encodeURIComponent(businessId)}/analyst-summary`,
    );
  },

  /**
   * GET /api/v1/admin/businesses/:id/analyses
   * Paginated historical analysis reports for a business
   */
  getBusinessAnalyses(
    businessId: string,
    query?: AnalysisQuery,
  ): Promise<ApiResponse<PaginatedAnalysesData>> {
    return apiClient.get<PaginatedAnalysesData>(
      `/admin/businesses/${encodeURIComponent(businessId)}/analyses`,
      {
        params: {
          page: query?.page,
          limit: query?.limit,
          analysisType: query?.analysisType,
          status: query?.status,
        },
      },
    );
  },

  /**
   * GET /api/v1/admin/businesses/:id/analyses/:analysisId
   * Deep inspection of a single analysis report for a business
   */
  getBusinessAnalysisDetail(
    businessId: string,
    analysisId: string,
  ): Promise<ApiResponse<AnalysisRecordItem>> {
    return apiClient.get<AnalysisRecordItem>(
      `/admin/businesses/${encodeURIComponent(businessId)}/analyses/${encodeURIComponent(analysisId)}`,
    );
  },

  /**
   * GET /api/v1/admin/businesses/:id/questions
   * Paginated natural language business question and AI answer history
   */
  getBusinessQuestions(
    businessId: string,
    query?: QuestionQuery,
  ): Promise<ApiResponse<PaginatedQuestionsData>> {
    return apiClient.get<PaginatedQuestionsData>(
      `/admin/businesses/${encodeURIComponent(businessId)}/questions`,
      {
        params: {
          page: query?.page,
          limit: query?.limit,
          status: query?.status,
        },
      },
    );
  },
};
