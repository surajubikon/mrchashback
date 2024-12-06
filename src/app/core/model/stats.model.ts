export interface Stats {
  ACTIVE_CUSTOMERS: number;
  PAID_REQUESTS: number;
  ACTIVE_LEADS: number;
  LEADS: number;
  TOTAL_INCOME?: number;
  TOTAL_PENDING_AMOUNT?: any;
  TOTAL_AMOUNT?: number;
}
export interface StatsFetchResponse {
  message: string;
  responseCode: string;
  result: Stats;
  statusCode: number;
}
