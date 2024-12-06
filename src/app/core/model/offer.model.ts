import { TermsAndCondition } from './website.model';

export interface Offer {
  icon: string;
  url: string;
  name: string;
  trackingTime?: any;
  allotmentTime?: any;
  maximumCashback?: number;
  termsAndCondition?: TermsAndCondition[];
  companyId: string;
  websiteId: {
    icon: string;
  };
}
