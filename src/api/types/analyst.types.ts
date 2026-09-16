import { PaginationMeta, PaginationQuery } from './common.types';

export enum AnalysisType {
  BUSINESS_SUMMARY = 'BUSINESS_SUMMARY',
  CUSTOMER_ANALYSIS = 'CUSTOMER_ANALYSIS',
  SALES_ANALYSIS = 'SALES_ANALYSIS',
  PRODUCT_ANALYSIS = 'PRODUCT_ANALYSIS',
  CAMPAIGN_ANALYSIS = 'CAMPAIGN_ANALYSIS',
  TREND_ANALYSIS = 'TREND_ANALYSIS',
}

export enum AnalysisStatus {
  QUEUED = 'QUEUED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum QuestionStatus {
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface MetricFactItem {
  key: string;
  name: string;
  value: number | null;
  unit: string;
  description?: string;
}

export interface ValidatedInsightItem {
  title: string;
  description: string;
  category: string;
  referencedMetricKey: string;
  referencedMetricValue: number | string | null;
  severity: 'POSITIVE' | 'NEUTRAL' | 'ATTENTION';
}

export interface ValidatedRecommendationItem {
  title: string;
  action: string;
  rationale: string;
  referencedMetricKey: string;
  referencedMetricValue: number | string | null;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface ValidatedAnalysisResult {
  period: {
    from: string;
    to: string;
  };
  metrics: MetricFactItem[];
  insights: ValidatedInsightItem[];
  recommendations: ValidatedRecommendationItem[];
  dataLimitations: string[];
}

export interface AnalystSummaryData {
  period: {
    from: string;
    to: string;
  };
  summary: string;
  metrics: MetricFactItem[];
  insights: ValidatedInsightItem[];
  recommendations: ValidatedRecommendationItem[];
  dataLimitations: string[];
}

export interface AnalysisRecordItem {
  id: string;
  analysisType: AnalysisType;
  status: AnalysisStatus;
  summary: string | null;
  result?: ValidatedAnalysisResult | null;
  errorMessage: string | null;
  createdAt: string;
  completedAt: string | null;
}

export interface PaginatedAnalysesData {
  data: AnalysisRecordItem[];
  meta: PaginationMeta;
}

export interface AnalysisQuery extends PaginationQuery {
  analysisType?: AnalysisType;
  status?: AnalysisStatus;
}

export interface QuestionRecordItem {
  id: string;
  question: string;
  answer: string | null;
  status: QuestionStatus;
  createdAt: string;
}

export interface PaginatedQuestionsData {
  data: QuestionRecordItem[];
  meta: PaginationMeta;
}

export interface QuestionQuery extends PaginationQuery {
  status?: QuestionStatus;
}
