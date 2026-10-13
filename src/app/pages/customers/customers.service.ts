import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_PREFIX } from 'src/app/core/constants';

import { environment } from '../../../environments/environment';
import { Customer, CustomerChanges } from './customer.model';

const API_URL = `${environment.url}${API_PREFIX}customers`;

/** The customers of the store being worked in */
@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  constructor(private http: HttpClient) {}

  list(search = '', limit = 30) {
    let params = new HttpParams().set('limit', String(limit));
    if (search.trim()) params = params.set('search', search.trim());
    return this.http.get<{ customers: Customer[]; total: number }>(API_URL, { params });
  }

  create(customer: CustomerChanges & { name: string }) {
    return this.http.post<{ customer: Customer }>(API_URL, customer);
  }

  update(id: number, changes: CustomerChanges) {
    return this.http.put<{ customer: Customer }>(`${API_URL}/${id}`, changes);
  }

  remove(id: number) {
    return this.http.delete<{ message: string }>(`${API_URL}/${id}`);
  }
}
