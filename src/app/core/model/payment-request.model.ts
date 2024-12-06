import { CustomerListInterface } from "./user.model";

export interface Payment {
  amount: number;
  createdAt: string;
  status: string;
  updatedAt: string;
  userId: CustomerListInterface;
  __v: number;
  _id: string;
}
export interface PaymentRequestCreateResponse {
  responseCode: string;
  statusCode: number;
  message: string;
  result: {
    PaymentRequest: {};
  };
}
export interface PaymentRequestFetchResponse {
  message: string;
  responseCode: string;
  result: PaymentRequestFetch;
  statusCode: number;
}
export interface PaymentRequestFetch {
  requests: Payment[];
  totalCounts: number;
}
