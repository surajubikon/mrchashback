import { CategoriesInterface } from './categories.model';
import { WebsiteInterface } from './website.model';

export interface AffiliateItemInterface {
  actualPrice: number;
  brand: string;
  brandLogoUrl: string;
  cashback: string;
  categoryId: CategoriesInterface;
  createdAt: string;
  dealHeadline: string;
  dealTimer: string;
  dealType: string;
  description: string;
  discount: number;
  imageUrl: string;
  orignalPrice: number;
  type: string;
  updatedAt: string;
  url: string;
  websiteId: WebsiteInterface;
  __v: number;
  displayTimer?: any;
  _id: string;
}
export interface AffiliateItemCreateResponse {
  responseCode: string;
  statusCode: number;
  message: string;
  result: {
    AffiliateItem: {};
  };
}
export interface AffiliateItemFetchResponse {
  message: string;
  responseCode: string;
  result: AffiliateItemFetch;
  statusCode: number;
}
export interface AffiliateItemFetch {
  affiliateItems: AffiliateItemInterface[];
  totalCounts: number;
}
