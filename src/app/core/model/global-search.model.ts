import { AffiliateItemInterface } from './affiliate.model';
import { CategoriesInterface } from './categories.model';
import { WebsiteInterface } from './website.model';

export interface GlobalSeachApiResponse {
  message: string;
  responseCode: string;
  result: GlobalSeachInterface;
  statusCode: number;
}
export interface GlobalSeachInterface {
  affiliateItemCounts: number;
  websiteCounts: number;
  categoryCounts: number;
  affiliateItems: AffiliateItemInterface[];
  categories: CategoriesInterface[];
  websites: WebsiteInterface[];
}
