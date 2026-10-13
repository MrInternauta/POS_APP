import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_PREFIX } from 'src/app/core/constants';

import { environment } from '../../../environments/environment';
import { AdminStore, Member, NewMember, PublicCatalog, StoreDetails } from './store.model';

const API_URL = `${environment.url}${API_PREFIX}`;

/** The store being worked in, its team, the super admin's stores, the public catalogue and passwords */
@Injectable({
  providedIn: 'root',
})
export class StoreService {
  constructor(private http: HttpClient) {}

  current() {
    return this.http.get<{ store: StoreDetails }>(`${API_URL}stores/current`);
  }

  updateCurrent(changes: Partial<Pick<StoreDetails, 'name' | 'phone' | 'address'>>) {
    return this.http.put<{ store: StoreDetails }>(`${API_URL}stores/current`, changes);
  }

  members() {
    return this.http.get<{ members: Member[] }>(`${API_URL}stores/current/members`);
  }

  addMember(member: NewMember) {
    return this.http.post<{ member: Member }>(`${API_URL}stores/current/members`, member);
  }

  changeRole(memberId: number, role: Member['role']) {
    return this.http.put<{ message: string }>(`${API_URL}stores/current/members/${memberId}`, { role });
  }

  removeMember(memberId: number) {
    return this.http.delete<{ message: string }>(`${API_URL}stores/current/members/${memberId}`);
  }

  allStores() {
    return this.http.get<{ stores: AdminStore[]; total: number }>(`${API_URL}admin/stores`, {
      params: new HttpParams().set('limit', '50'),
    });
  }

  setActive(storeId: number, active: boolean) {
    return this.http.put<{ store: StoreDetails }>(`${API_URL}admin/stores/${storeId}/status`, { active });
  }

  /** Works without a login: it is what a store shows to anyone */
  catalog(slug: string, search = '') {
    let params = new HttpParams().set('limit', '50');
    if (search.trim()) params = params.set('search', search.trim());
    return this.http.get<PublicCatalog>(`${API_URL}stores/${encodeURIComponent(slug)}/catalog`, { params });
  }

  changePassword(currentPassword: string, newPassword: string) {
    return this.http.post<{ message: string }>(`${API_URL}auth/password`, { currentPassword, newPassword });
  }
}
