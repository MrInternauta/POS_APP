import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_PREFIX } from 'src/app/core/constants';

import { environment } from '../../../../environments/environment';
import {
  MonthlyResponse,
  ReportPeriod,
  SummaryResponse,
  TopProductsBy,
  TopProductsResponse,
} from '../models/report.model';

const API_URL = `${environment.url}${API_PREFIX}reports`;

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  constructor(public http: HttpClient) {}

  getSummary(period: ReportPeriod) {
    return this.http.get<SummaryResponse>(`${API_URL}/summary`, { params: { period } });
  }

  /** Without dates the API answers for this month so far */
  getTopProducts(by: TopProductsBy, limit = 10) {
    return this.http.get<TopProductsResponse>(`${API_URL}/top-products`, { params: { by, limit } });
  }

  getMonthly(months = 12) {
    return this.http.get<MonthlyResponse>(`${API_URL}/monthly`, { params: { months } });
  }
}
