export interface AdmitadAuthTokenResponse {
  responseCode: string;
  statusCode: number;
  message: string;
  result: AdmitadAuthTokenResult;
}

export interface AdmitadAuthTokenResult {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  refresh_token: string;
  username: string;
  first_name: string;
  last_name: string;
  language: string;
  id: number;
  group: string;
  code: string;
}
