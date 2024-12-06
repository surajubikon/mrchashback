export interface ReferralInterface {
  _id: string;
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
  userData: {
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
      isVerified: boolean;
    };
    updatedAt: string;
    createdAt: string;
    __v: number;
    deviceToken: string;
    referralCode: string;
  };

  leadId: string;
  userId: string;
  amount: number;
  status: string;
  updatedAt: string;
  createdAt: string;
  __v: number;
}

export interface ReferralReportInterface {
  totalAmountEarned: number;
  totalReferralOrders: number;

  customerDetails: {
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
      isVerified: boolean;
    };
    updatedAt: string;
    createdAt: string;
    __v: number;
    deviceToken: string;
    referralCode: string;
    referredByUserData: {
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
        isVerified: boolean;
      };
      updatedAt: string;
      createdAt: string;
      __v: number;
      deviceToken: string;
      referralCode: string;
    };
  };
}
