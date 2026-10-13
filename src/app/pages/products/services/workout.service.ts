import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_PREFIX } from 'src/app/core/constants';

import { environment } from '../../../../environments/environment';
import {
  ArticleCreate,
  ArticleResponse,
  CategoryItemResponse,
  CategoryResponse,
  CreateProviderDto,
  ProductImportSummary,
  ProviderItemResponse,
  ProviderResponse,
} from '../models';
import { CreateCategoryDto } from '../models/category.dto';
import { ProductsFilterDto } from '../models/productFilter.dto';

const API_URL = `${environment.url}${API_PREFIX}products`;
const API_URL_CATEGORY = `${environment.url}${API_PREFIX}categories`;
/** Only an admin may call these, anyone else gets a 401 and the interceptor logs them out */
const API_URL_PROVIDER = `${environment.url}${API_PREFIX}providers`;

/** The API refuses to return more than a page of products at once */
const MAX_CODES = 50;

@Injectable({
  providedIn: 'root',
})
export class WorkoutService {
  constructor(public http: HttpClient) {}

  getCategories(params?: ProductsFilterDto) {
    return this.http.get<CategoryResponse | null>(API_URL_CATEGORY, {
      params: toHttpParams(params),
    });
  }

  postCategory(category: CreateCategoryDto) {
    return this.http.post<{ product: CategoryItemResponse }>(API_URL_CATEGORY, category);
  }

  putCategory(categoryId: number, category: Partial<CreateCategoryDto>) {
    return this.http.put<{ category: CategoryItemResponse }>(`${API_URL_CATEGORY}/${categoryId}`, category);
  }

  deleteCategory(categoryId: number) {
    return this.http.delete<{ message: string }>(`${API_URL_CATEGORY}/${categoryId}`);
  }

  getProviders() {
    return this.http.get<ProviderResponse | null>(API_URL_PROVIDER);
  }

  postProvider(provider: CreateProviderDto) {
    return this.http.post<{ provider: ProviderItemResponse }>(API_URL_PROVIDER, provider);
  }

  putProvider(providerId: number, provider: Partial<CreateProviderDto>) {
    return this.http.put<{ provider: ProviderItemResponse }>(`${API_URL_PROVIDER}/${providerId}`, provider);
  }

  deleteProvider(providerId: number) {
    return this.http.delete<{ message: string }>(`${API_URL_PROVIDER}/${providerId}`);
  }

  getProducts(params?: ProductsFilterDto) {
    return this.http.get<ArticleResponse | null>(API_URL, {
      params: toHttpParams(params),
    });
  }

  /** The products behind a set of codes, to read their stock again */
  getProductsByCodes(codes: string[]) {
    return this.getProducts({
      limit: Math.min(Math.max(codes.length, 1), MAX_CODES),
      offset: 0,
      codes: codes.slice(0, MAX_CODES),
    });
  }

  /** Sends a product list, the API creates what is missing and updates what is already there */
  importProducts(file: File) {
    const body = new FormData();
    body.append('file', file);

    return this.http.post<ProductImportSummary>(`${API_URL}/import`, body);
  }

  postProduct(product: ArticleCreate) {
    return this.http.post<any | null>(API_URL, product);
  }

  putProduct(productId: string, product: ArticleCreate) {
    return this.http.put<any | null>(`${API_URL}/${productId}`, product);
  }

  deleteProduct(productId: string) {
    return this.http.delete<any | null>(`${API_URL}/${productId}`);
  }
}

/**
 * The API rejects unknown and empty query params, so only the ones with a real
 * value are sent.
 */
function toHttpParams(params?: ProductsFilterDto): HttpParams {
  let httpParams = new HttpParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') return;

    if (Array.isArray(value)) {
      value
        .filter(item => item !== null && item !== undefined && item !== '')
        .forEach(item => {
          httpParams = httpParams.append(key, String(item));
        });
      return;
    }

    httpParams = httpParams.set(key, String(value));
  });
  return httpParams;
}
