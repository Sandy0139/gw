export type UserRole = 'BUYER' | 'SUPPLIER';

export type RFQStatus = 'OPEN' | 'CLOSED' | 'CANCELLED';

export type QuotationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface User {
  id: string;
  email: string;
  name: string;
  companyName?: string | null;
  role: UserRole;
  createdAt: string;
}

export interface RFQ {
  id: string;
  title: string;
  description: string;
  quantity: number;
  unit: string;
  deliveryLocation: string;
  deadline: string;
  status: RFQStatus;
  buyerId: string;
  buyer?: {
    id: string;
    name: string;
    companyName?: string | null;
    email?: string;
  };
  quotationCount?: number;
  hasSubmittedQuote?: boolean;
  isExpired?: boolean;
  isOwner?: boolean;
  quotations?: Quotation[];
  myQuotation?: Quotation | null;
  createdAt: string;
  updatedAt: string;
}

export interface Quotation {
  id: string;
  price: number;
  deliveryDays: number;
  notes?: string | null;
  status: QuotationStatus;
  rfqId: string;
  rfq?: RFQ;
  supplierId: string;
  supplier?: {
    id: string;
    name: string;
    companyName?: string | null;
    email?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data: {
    user: User;
    token: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  errors?: Array<{ field: string; message: string }>;
}
