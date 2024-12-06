export interface Email {
  address: string;
  isVerified: boolean;
}

export interface Mobile {
  number: string;
  isVerified: boolean;
}

export interface UserWallet {
  amount: number;
  createdAt: string;
  pendingAmount: number;
  totalIncome: number;
  updatedAt: string;
  userId: string;
  __v: number;
  _id: string;
}

export interface User {
  createdAt: string;
  deviceToken: string;
  email: Email;
  mobile: Mobile;
  name: string;
  password: string;
  referralCode: string;
  status: string;
  bankIFSC: string;
  bankAccNum: string;
  bankName: string;
  upiId: string;
  paytmNumber: string;
  panCard: string;
  type: string;
  updatedAt: string;
  userName: string;
  user_wallet: UserWallet[];
  __v: number;
  _id: string;
}

export interface UserCreateResponse {
  responseCode: string;
  statusCode: number;
  message: string;
  result: {
    User: {};
  };
}
export interface UserFetchResponse {
  message: string;
  responseCode: string;
  result: UserFetch;
  statusCode: number;
}
export interface UserFetch {
  users: User[];
  totalCounts: number;
}
export interface CustomerListInterface {
  createdAt: string;
  email: UserEmailInterface;
  mobile: UserMobileInterface;
  name: string;
  password: string;
  status: string;
  type: string;
  updatedAt: string;
  userName: string;
  bankAccNum?: string;
  bankIFSC?: string;
  bankName?: string;
  upiID?: string;
  paytmNumber?: string;
  panCard?: string;
  __v: number;
  _id: string;
  user_wallet: WalletInterface[];
}

export interface WalletInterface {
  _id: string;
  userId: string;
  amount: number;
  updatedAt: Date;
  totalIncome?: number;
  pendingAmount?: number;
  referralAmount?: number;
  createdAt: Date;
  __v: number;
}
export interface UserEmailInterface {
  address: string;
  isVerified: boolean;
}
export interface UserMobileInterface {
  number: string;
  isVerified: boolean;
}
