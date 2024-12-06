export interface CategoriesInterface {
  createdAt: string;
  icon: string;
  name: string;
  type: string;
  updatedAt: string;
  __v: number;
  _id: string;
}
export interface CategoryCreateResponse {
  responseCode: string;
  statusCode: number;
  message: string;
  result: {
    Category: {};
  };
}
export interface CategoryFetchResponse {
  message: string;
  responseCode: string;
  result: CategoryFetch;
  statusCode: number;
}
export interface CategoryFetch {
  categories: CategoriesInterface[];
  totalCounts: number;
}
