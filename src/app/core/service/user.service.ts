import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, Subject, debounceTime } from 'rxjs';
import { environment } from 'src/app/environments/environment.prod';
import {
  CREATE_USER_API,
  LOGIN_USER_API,
  SEND_OTP_API,
  VERIFY_OTP_API,
  FETCH_USER_API,
  FETCH_PROFILE_API,
  UPDATE_USER_API,
  ADD_EARNING_API,
  MAKE_PAYMENT_API,
  FETCH_TRANSACTION_API,
  FETCH_WALLET_API,
  ADD_REQUEST_API,
  FETCH_REQUESTS_API,
  FETCH_NOTIFICATIONS_API,
  SEND_NOTIFICATION_API,
  UPDATE_PASSWORD_API,
  UPDATE_PROFILE_API,
  ENABLE_MAINTENANCE_API,
  REMOVE_MAINTENANCE_API,
  MANAGE_SCHEDULERS_API,
  UPDATE_REQUESTS_API,
  FETCH_GLOBAL_SEARCH_API,
  MISSING_CASHBACK_REQUEST_API,
  FETCH_MISSING_CASHBACK_REQUEST_API,
  UPDATE_MISSING_CASHBACK_REQUEST_API,
} from '../constant/api.constant';
import { ApiHelperService } from './api-helper.service';
import { PaymentRequestFetchResponse } from '../model/payment-request.model';
import { GlobalSeachApiResponse } from '../model/global-search.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public login = new Subject<boolean>();
  _apiService = inject(ApiHelperService);

  constructor(private http: HttpClient) {}

  createUserAccount(user: any): Observable<any> {
    return this._apiService.post(CREATE_USER_API, user);
  }
  userLogin(login: any): Observable<any> {
    return this._apiService.post(LOGIN_USER_API, login);
  }
  userOTPReq(login: any): Observable<any> {
    return this._apiService.post(SEND_OTP_API, login);
  }
  verifyOTP(otp: any): Observable<any> {
    return this._apiService.post(VERIFY_OTP_API, otp);
  }
  fetchUser(userData?: any): Observable<any> {
    return this._apiService.get(FETCH_USER_API, userData);
  }
  fetchProfile(userData?: any): Observable<any> {
    return this._apiService.get(FETCH_PROFILE_API, userData);
  }
  updateUser(updatedData: any, id: any): Observable<any> {
    return this._apiService.post(
      `${environment.base_url}${UPDATE_USER_API}/${id}`,
      updatedData,
      {
        observe: 'response',
      }
    );
  }
  addEarningToCustomer(data: any): Observable<any> {
    return this._apiService.post(ADD_EARNING_API, data);
  }

  makePaymentToCustomer(requestId: string, data: any): Observable<any> {
    return this._apiService.post(
      MAKE_PAYMENT_API.replace('{id}', requestId),
      data
    );
  }

  fetchTransactions(params?: any): Observable<any> {
    return this._apiService.get(FETCH_TRANSACTION_API, params);
  }

  fetchWallet(params?: any): Observable<any> {
    return this._apiService.get(FETCH_WALLET_API, params);
  }
  createMissingCashbacksRequest(data: any) {
    return this._apiService.post(MISSING_CASHBACK_REQUEST_API, data);
  }
  updateMissingCashbacks(selectedId: string, data: any): Observable<any> {
    return this._apiService.post(
      `${UPDATE_MISSING_CASHBACK_REQUEST_API}/${selectedId}`,
      data
    );
  }
  createRequest(data: any) {
    return this._apiService.post(ADD_REQUEST_API, data);
  }

  fetchRequests(params?: any): Observable<PaymentRequestFetchResponse> {
    return this._apiService.get<PaymentRequestFetchResponse>(
      FETCH_REQUESTS_API,
      params
    );
  }
  fetchMissingCashbacks(params?: any): Observable<any> {
    return this._apiService.get<any>(
      FETCH_MISSING_CASHBACK_REQUEST_API,
      params
    );
  }
  fetchGlobalSearch(params?: any): Observable<any> {
    return this._apiService.get<any>(FETCH_GLOBAL_SEARCH_API, params);
  }
  updateRequest(id: string, updatedData: any): Observable<any> {
    return this._apiService.post(`${UPDATE_REQUESTS_API}/${id}`, updatedData, {
      observe: 'response',
    });
  }

  fetchNotifications(params?: any): Observable<any> {
    return this._apiService.get(FETCH_NOTIFICATIONS_API, params);
  }

  sendNotification(data: any): Observable<any> {
    return this._apiService.post(SEND_NOTIFICATION_API, data);
  }
  updatePassword(data: any): Observable<any> {
    return this._apiService.post(UPDATE_PASSWORD_API, data);
  }

  updateProfile(userId: string, data: any): Observable<any> {
    return this._apiService.post(
      UPDATE_PROFILE_API.replace('{id}', userId),
      data
    );
  }
  enableMaintenance(): Observable<any> {
    return this._apiService.post(ENABLE_MAINTENANCE_API, null || undefined);
  }
  removeMaintenance(): Observable<any> {
    return this._apiService.post(REMOVE_MAINTENANCE_API, null || undefined);
  }
  manageSchedulers(data: any): Observable<any> {
    return this._apiService.post(MANAGE_SCHEDULERS_API, data);
  }
}
export function saveExcelFile(buffer: any, filename: string): void {
  const data: Blob = new Blob([buffer], { type: 'application/octet-stream' });
  const a: HTMLAnchorElement = document.createElement('a');
  document.body.appendChild(a);
  a.href = window.URL.createObjectURL(data);
  a.download = `${filename}.xlsx`;
  a.click();
  document.body.removeChild(a);
}
