import { CustomerListInterface } from "./user.model";

export interface  Leads {
    clicks: number;
  companyId: string;
  cr: number;
  createdAt: string;
  currency: string;
  ecpc: number;
  leads_sum: number;
  payment_sum: number;
  payment_sum_approved: number;
  payment_sum_declined: number;
  payment_sum_open: number;
  sales_sum: number;
  subid: string;
  updatedAt: string;
  userId: CustomerListInterface;
  website_name: string;
  __v: number;
  _id: string;
}
export interface LeadsCreateResponse {
    responseCode: string;
    statusCode: number;
    message: string;
    result: {
      Leads: {};
    };
  }
  export interface LeadsFetchResponse {
    message: string;
    responseCode: string;
    result: LeadsFetch;
    statusCode: number;
  }
  export interface LeadsFetch {
    leads: Leads[];
    totalCounts: number;
  }