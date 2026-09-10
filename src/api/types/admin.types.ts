import { BusinessRole, SystemRole } from './auth.types';

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
  UNSPECIFIED = 'UNSPECIFIED',
}

export enum CustomerSource {
  MANUAL = 'MANUAL',
  CSV = 'CSV',
  EXCEL = 'EXCEL',
  IMAGE = 'IMAGE',
  IMPORT = 'IMPORT',
  WHATSAPP = 'WHATSAPP',
  CAMPAIGN = 'CAMPAIGN',
}

export enum ImportType {
  CSV = 'CSV',
  EXCEL = 'EXCEL',
  IMAGE = 'IMAGE',
}

export enum ImportStatus {
  PENDING = 'PENDING',
  PARSING = 'PARSING',
  PREVIEW_READY = 'PREVIEW_READY',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

// Dashboard statistics DTO
export interface DashboardStats {
  totalBusinesses: number;
  totalUsers: number;
  totalCustomers: number;
  totalImports: number;
  completedImports: number;
  failedImports: number;
  totalFiles: number;
}

// Business List Item DTO
export interface BusinessListItem {
  id: string;
  name: string;
  phone: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  email: string | null;
  createdAt: string;
  owner: {
    id: string;
    name: string | null;
    phone: string;
    systemRole: SystemRole;
  } | null;
  stats: {
    customerCount: number;
    importCount: number;
  };
}

// Operating hours for a single day of week (0 = Sunday .. 6 = Saturday)
export interface BusinessHoursItem {
  id: string;
  businessId: string;
  dayOfWeek: number;
  openTime: string | null;
  closeTime: string | null;
  isClosed: boolean;
}

// Business Detail Inspection DTO
export interface BusinessDetailData {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  logoKey: string | null;
  email: string | null;
  website: string | null;
  instagram: string | null;
  facebook: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  businessUsers: Array<{
    id: string;
    businessId: string;
    userId: string;
    role: BusinessRole;
    createdAt: string;
    updatedAt: string;
    user: {
      id: string;
      name: string | null;
      phone: string;
      systemRole: SystemRole;
    };
  }>;
  hours: BusinessHoursItem[];
  _count: {
    customers: number;
    imports: number;
    fileUploads: number;
  };
}

// Customer Communication Preferences DTO
export interface CustomerCommunicationPreferences {
  id: string;
  customerId: string;
  whatsappMarketing: boolean;
  voiceMarketing: boolean;
  emailMarketing: boolean;
  doNotContact: boolean;
  consentSource: string | null;
  consentTimestamp: string;
  createdAt: string;
  updatedAt: string;
}

// Customer Inspection DTO
export interface CustomerItem {
  id: string;
  businessId: string;
  name: string;
  rawPhone: string;
  normalizedPhone: string;
  email: string | null;
  gender: Gender | null;
  dob: string | null;
  address: string | null;
  city: string | null;
  source: CustomerSource;
  importId: string | null;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  preferences: CustomerCommunicationPreferences | null;
}

// Global Import Audit Log Item DTO
export interface GlobalImportItem {
  id: string;
  businessId: string;
  fileId: string | null;
  importType: ImportType;
  status: ImportStatus;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  duplicateRows: number;
  errorSummary: string | null;
  idempotencyKey: string | null;
  createdById: string;
  createdAt: string;
  completedAt: string | null;
  business: {
    id: string;
    name: string;
    phone: string;
  };
  createdBy: {
    id: string;
    name: string | null;
    phone: string;
  };
  file: {
    fileName: string;
    fileSize: number;
  } | null;
}

// Import Job Detailed Inspection DTO
export interface ImportDetailData {
  id: string;
  businessId: string;
  fileId: string | null;
  importType: ImportType;
  status: ImportStatus;
  totalRows: number;
  validRows: number;
  invalidRows: number;
  duplicateRows: number;
  errorSummary: string | null;
  idempotencyKey: string | null;
  createdById: string;
  createdAt: string;
  completedAt: string | null;
  business: {
    id: string;
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    logoKey: string | null;
    email: string | null;
    website: string | null;
    instagram: string | null;
    facebook: string | null;
    description: string | null;
    createdAt: string;
    updatedAt: string;
  };
  createdBy: {
    id: string;
    name: string | null;
    phone: string;
  };
  file: {
    id: string;
    businessId: string;
    fileName: string;
    fileType: string;
    storageKey: string;
    fileSize: number;
    category: string;
    uploadedById: string;
    createdAt: string;
  } | null;
}
