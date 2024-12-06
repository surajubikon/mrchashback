import { Injectable, inject } from '@angular/core';
import { Observable, map, switchMap } from 'rxjs';
import { environment } from 'src/app/environments/environment.prod';
import {
  FETCH_COUPONS_API,
  CREATE_COUPONS_API,
  UPDATE_COUPONS_API,
  FETCH_CATEGORIES_API,
  UPDATE_CATEGORIES_API,
  CREATE_CATEGORIES_API,
  FETCH_WEBSITES_API,
  UPDATE_WEBSITES_API,
  CREATE_WEBSITES_API,
  FETCH_BANNERS_API,
  FETCH_STATS_API,
  UPDATE_BANNERS_API,
  CREATE_BANNERS_API,
  FETCH_AFFILIATE_API,
  UPDATE_AFFILIATE_API,
  CREATE_AFFILIATE_API,
  ADMITAD_AUTH_TOKEN_API,
  ADMITAD_DEEPLINK_GENERATOR,
  FETCH_LEADS_API,
  FETCH_MASTER_SETTINGS_API,
  UPDATE_MASTER_SETTINGS_API,
  CHANGE_PASSWORD_API,
  FETCH_SORT_ORDER_API,
  UPDATE_SORT_ORDER_API,
  SEND_EMAIL_API,
  FETCH_REFERRAL_TRANSACTION_API,
  FETCH_VERSION_API,
  CREATE_VERSION_API,
  FETCH_REFERRAL_REPORT_API,
} from '../constant/api.constant';
import { StatsFetchResponse } from '../model/stats.model';
import {
  WebsitesItemCreateResponse,
  WebsitesItemFetch,
  WebsitesItemFetchResponse,
} from '../model/website.model';
import { ApiHelperService } from './api-helper.service';
import {
  CategoryCreateResponse,
  CategoryFetchResponse,
} from '../model/categories.model';
import {
  BannerCreateResponse,
  BannerFetchResponse,
} from '../model/banner.model';
import {
  AffiliateItemCreateResponse,
  AffiliateItemFetchResponse,
} from '../model/affiliate.model';
import { LeadsFetchResponse } from '../model/leads.model';
import { StorageService } from './storage.service';
import { USER_STORAGE_KEY } from '../constant/app.constant';
import { AdmitadAuthTokenResponse } from '../model/admitad.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class OthersService {
  _apiService = inject(ApiHelperService);
  _storageService = inject(StorageService);
  _httpClient = inject(HttpClient);

  async getUniqueSubId(): Promise<string | null> {
    let data = await this._storageService.getFromStorage(USER_STORAGE_KEY);
    if (data?.token) {
      return (
        (await this._storageService.getFromStorage(USER_STORAGE_KEY)).user
          .userName +
        '-' +
        Date.now()
      );
    } else {
      return null;
    }
  }
  generateTokenAndDeepLink(
    url: string,
    subId: string,
    companyId: string
  ): Observable<any> {
    return this._httpClient
      .get<AdmitadAuthTokenResponse>(
        `${environment.base_url}${ADMITAD_AUTH_TOKEN_API}?scope=deeplink_generator`
      )
      .pipe(
        switchMap((_) => {
          console.log('admitad-token', _);
          return this._httpClient.get(
            `${environment.base_url}${ADMITAD_DEEPLINK_GENERATOR}`,
            {
              params: {
                token: _.result.access_token,
                w_id: 2513063,
                c_id: companyId, // need to change this later on
                subid: subId,
                ulp: url,
              },
            }
          );
        })
      );
  }
  // COUPONS API
  fetchCoupons(couponsData?: any): Observable<any> {
    return this._apiService.get(FETCH_COUPONS_API, couponsData);
  }
  createCoupon(coupon: any): Observable<any> {
    return this._apiService.post(CREATE_COUPONS_API, coupon);
  }
  updateCoupon(updatedData: any, id: any): Observable<any> {
    return this._apiService.post(`${UPDATE_COUPONS_API}/${id}`, updatedData, {
      observe: 'response',
    });
  }

  // CATEGORIES API
  fetchCategories(categoriesData?: any): Observable<CategoryFetchResponse> {
    return this._apiService.get<CategoryFetchResponse>(
      FETCH_CATEGORIES_API,
      categoriesData
    );
  }
  fetchReferralTransaction(data?: any): Observable<any> {
    return this._apiService.get(FETCH_REFERRAL_TRANSACTION_API, data);
  }
  fetchReferral(data?: any): Observable<any> {
    return this._apiService.get(FETCH_REFERRAL_REPORT_API, data);
  }
  updateCategories(
    updatedData: any,
    id: any
  ): Observable<CategoryCreateResponse> {
    return this._apiService.post<CategoryCreateResponse>(
      `${UPDATE_CATEGORIES_API}/${id}`,
      updatedData,
      {
        observe: 'response',
      }
    );
  }
  createCategories(categories: any): Observable<CategoryCreateResponse> {
    return this._apiService.post<CategoryCreateResponse>(
      CREATE_CATEGORIES_API,
      categories
    );
  }

  // Website API
  fetchWebsite(websiteData?: any): Observable<WebsitesItemFetch> {
    return this._apiService
      .get<WebsitesItemFetchResponse>(FETCH_WEBSITES_API, websiteData)
      .pipe(
        map((res: WebsitesItemFetchResponse) => {
          return res.result;
        })
      );
  }
  updateWebsite(
    updatedData: any,
    id: string
  ): Observable<WebsitesItemCreateResponse> {
    return this._apiService.post<WebsitesItemCreateResponse>(
      `${UPDATE_WEBSITES_API}/${id}`,
      updatedData,
      {
        observe: 'response',
      }
    );
  }
  createWebsite(website: any): Observable<WebsitesItemCreateResponse> {
    return this._apiService
      .post<WebsitesItemCreateResponse>(CREATE_WEBSITES_API, website)
      .pipe(
        map((res: WebsitesItemCreateResponse) => {
          return res;
        })
      );
  }
  // BANNER API
  fetchBanner(bannerData?: any): Observable<BannerFetchResponse> {
    return this._apiService.get<BannerFetchResponse>(
      FETCH_BANNERS_API,
      bannerData
    );
  }
  fetchStats(stats?: any): Observable<StatsFetchResponse> {
    return this._apiService
      .get<StatsFetchResponse>(FETCH_STATS_API, stats)
      .pipe(
        map((res: StatsFetchResponse) => {
          return res;
        })
      );
  }
  updateBanner(updatedData: any, id: string): Observable<BannerCreateResponse> {
    return this._apiService.post<BannerCreateResponse>(
      `${UPDATE_BANNERS_API}/${id}`,
      updatedData,
      {
        observe: 'response',
      }
    );
  }
  createBanner(banner: any): Observable<BannerCreateResponse> {
    return this._apiService.post<BannerCreateResponse>(
      CREATE_BANNERS_API,
      banner
    );
  }
  // Affiliate Items
  fetchAffiliateItems(
    affiliateItemsData?: any
  ): Observable<AffiliateItemFetchResponse> {
    return this._apiService.get<AffiliateItemFetchResponse>(
      FETCH_AFFILIATE_API,
      affiliateItemsData
    );
  }
  updateAffiliateItems(
    updatedData: any,
    id: string
  ): Observable<AffiliateItemCreateResponse> {
    return this._apiService.post<AffiliateItemCreateResponse>(
      `${UPDATE_AFFILIATE_API}/${id}`,
      updatedData,
      {
        observe: 'response',
      }
    );
  }
  createAffiliateItems(
    affiliateItems: any
  ): Observable<AffiliateItemCreateResponse> {
    return this._apiService.post<AffiliateItemCreateResponse>(
      CREATE_AFFILIATE_API,
      affiliateItems
    );
  }

  // Generate token and with that token generate deep link
  // generateTokenAndDeepLink(
  //   url: string,
  //   subId: string,
  //   companyId: string
  // ): Observable<any> {
  //   return this._apiService
  //     .get<AdmitadAuthTokenResponse>(
  //       `${ADMITAD_AUTH_TOKEN_API}?scope=deeplink_generator`
  //     )
  //     .pipe(
  //       switchMap((_) => {
  //         console.log('admitad-token', _);
  //         return this._apiService.get(
  //           `${ADMITAD_DEEPLINK_GENERATOR}`,
  //           {
  //             params: {
  //               token: _.result.access_token,
  //               w_id: 2513063,
  //               c_id: companyId, // need to change this later on
  //               subid: subId,
  //               ulp: url,
  //             },
  //           }
  //         );
  //       })
  //     );
  // }

  // async getUniqueSubId(): Promise<string> {
  //   return (
  //     (await this._storage.getStorage(STORAGE_CONSTANT)).user.userName +
  //     '-' +
  //     Date.now()
  //   );
  // }

  // fetchLeads(params?: {
  //   searchText?: string;
  //   status?: string;
  //   userId?: string;
  // }): Observable<LeadsFetchResponse> {
  //   console.log(params);

  //   return this._apiService
  //     .get<LeadsFetchResponse>(`${FETCH_LEADS_API}`, {
  //       params,
  //     })
  //     .pipe(
  //       map((_) => {
  //         _.result.leads.forEach((lead) => {
  //           if (lead.payment_sum)
  //             lead.payment_sum = +(
  //               lead.payment_sum * CUSTOMER_COMMISSION
  //             ).toFixed(2);
  //           if (lead.payment_sum_open)
  //             lead.payment_sum_open = +(
  //               lead.payment_sum_open * CUSTOMER_COMMISSION
  //             ).toFixed(2);
  //           if (lead.payment_sum_approved)
  //             lead.payment_sum_approved = +(
  //               lead.payment_sum_approved * CUSTOMER_COMMISSION
  //             ).toFixed(2);
  //           if (lead.payment_sum_declined)
  //             lead.payment_sum_declined = +(
  //               lead.payment_sum_declined * CUSTOMER_COMMISSION
  //             ).toFixed(2);
  //         });
  //         return _;
  //       })
  //     );
  // }

  fetchLeads(data?: any): Observable<LeadsFetchResponse> {
    return this._apiService.get<LeadsFetchResponse>(FETCH_LEADS_API, data);
  }
  fetchMasterSettings(data?: any): Observable<any> {
    return this._apiService.get(FETCH_MASTER_SETTINGS_API, data);
  }
  fetchVersion(): Observable<any> {
    return this._apiService.get(FETCH_VERSION_API);
  }
  createVersion(data: any): Observable<any> {
    return this._apiService.post<any>(CREATE_VERSION_API, data);
  }
  updateMasterSettings(id: string, updatedData: any): Observable<any> {
    return this._apiService.post(
      `${UPDATE_MASTER_SETTINGS_API}/${id}`,
      updatedData,
      {
        observe: 'response',
      }
    );
  }
  changePasswordSetting(details: any): Observable<AffiliateItemCreateResponse> {
    return this._apiService.post<AffiliateItemCreateResponse>(
      CHANGE_PASSWORD_API,
      details
    );
  }
  delete(itemId: string, apiEndPoint: string): Observable<any> {
    return this._apiService.delete(`${apiEndPoint}/${itemId}`);
  }
  // SORT ORDER
  fetchSortOrder(sortId?: any): Observable<any> {
    return this._apiService.get<any>(FETCH_SORT_ORDER_API, sortId);
  }
  updateSortOrder(updatedData: any, id: any): Observable<any> {
    return this._apiService.patch(
      `${UPDATE_SORT_ORDER_API}/${id}`,
      updatedData
    );
  }
  sendEmail(body: any): Observable<any> {
    return this._apiService.sendMail(SEND_EMAIL_API, body);
  }
}
