export interface Lead {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: "New" | "Contacted" | "Qualified" | "Lost";
  source: "Website" | "Instagram" | "Referral";
  createdAt: string;
  updatedAt: string;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LeadsResponse {
  success: boolean;
  data: Lead[];
  pagination: PaginationInfo;
}
