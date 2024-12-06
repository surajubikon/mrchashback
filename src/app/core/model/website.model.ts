import { CategoriesInterface } from './categories.model';

export interface WebsiteInterface {
  categoryId: CategoriesInterface;
  companyId: string;
  createdAt: string;
  icon: string;
  isVisible: boolean;
  name: string;
  sortOrder: number;
  maximumCashback: number;
  updatedAt: string;
  termsAndConditions: TermsAndCondition[];
  url: string;
  __v: number;
  _id: string;
  trackingTime: number;
  allotmentTime: number;
}
export interface TermsAndCondition {
  sectionTitle: string;
  terms: string[];
}
export interface WebsitesItemCreateResponse {
  responseCode: string;
  statusCode: number;
  message: string;
  result: {
    WebsitesItem: {};
  };
}
export interface WebsitesItemFetchResponse {
  message: string;
  responseCode: string;
  result: WebsitesItemFetch;
  statusCode: number;
}
export interface WebsitesItemFetch {
  websites: WebsiteInterface[];
  totalCounts: number;
}
