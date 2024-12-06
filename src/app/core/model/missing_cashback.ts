export interface MissingCashbacks {
  _id: string;
  ticketID: string;
  leadID: string;
  status: string;
  adminComment: string | null;
  customerComment: string | null;
  customerId: string;
  updatedAt: string;
  createdAt: string;
  __v: number;
  leadData: {
    _id: string;
    subid: string;
    userId: string;
    website_name: string;
    companyId: string;
    updatedAt: string;
    createdAt: string;
    __v: number;
    clicks: number;
    cr: number;
    currency: string;
    ecpc: number;
    leads_sum: number;
    payment_sum: number;
    payment_sum_approved: number;
    payment_sum_declined: number;
    payment_sum_open: number;
    sales_sum: number;
  };
  customerData: {
    _id: string;
    userName: string;
    password: string;
    name: string;
    email: {
      address: string;
      isVerified: boolean;
    };
    status: string;
    type: string;
    mobile: {
      number: string;
      isVerified: true;
    };
    referralCode: string;
    referredBy: string;
    updatedAt: string;
    createdAt: string;
    __v: number;
    deviceToken: string;
  };
}
