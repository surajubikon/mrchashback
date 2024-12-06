export interface BannerInterface {
  createdAt: string;
  isVisible: boolean;
  mediaPath: string;
  page: string;
  redirectUrl: string;
  updatedAt: string;
  __v: number;
  _id: string;
}
export interface BannerCreateResponse {
  responseCode: string;
  statusCode: number;
  message: string;
  result: {
    Banner: {};
  };
}
export interface BannerFetchResponse {
  message: string;
  responseCode: string;
  result: BannerFetch;
  statusCode: number;
}
export interface BannerFetch {
  banners: BannerInterface[];
  totalCounts: number;
}
