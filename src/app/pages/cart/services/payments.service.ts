import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

import { API_PREFIX } from 'src/app/core/constants';
import { environment } from '../../../../environments/environment';
import { ItemRequest } from '../models/checkout';

const API_URL = `${environment.url}${API_PREFIX}payments`;

export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'canceled';

export interface Payment {
  id: number;
  paymentMethod: 'cash' | 'mp_point';
  paymentStatus: PaymentStatus;
  total: number;
}

export interface StoreSettings {
  mercadoPagoEnabled: boolean;
  mpTerminalId: string | null;
}

export interface MpTerminal {
  id: string;
  operating_mode?: string;
}

/** Mercado Pago Point. Every call to Mercado Pago goes through the API; the app never holds its token. */
@Injectable({
  providedIn: 'root',
})
export class PaymentsService {
  constructor(private http: HttpClient) {}

  /** Whether checkout should offer Mercado Pago next to cash */
  mercadoPagoEnabled() {
    return this.http.get<{ mercadoPagoEnabled: boolean }>(`${API_URL}/options`).pipe(map(r => !!r?.mercadoPagoEnabled));
  }

  /** Saves the sale as pending and sends the charge to the terminal */
  charge(items: ItemRequest[]) {
    return this.http.post<{ payment: Payment }>(API_URL, { items }).pipe(map(r => r.payment));
  }

  status(saleId: number) {
    return this.http.get<{ payment: Payment }>(`${API_URL}/${saleId}`).pipe(map(r => r.payment));
  }

  cancel(saleId: number) {
    return this.http.post<{ payment: Payment }>(`${API_URL}/${saleId}/cancel`, {}).pipe(map(r => r.payment));
  }

  settings() {
    return this.http.get<{ settings: StoreSettings }>(`${API_URL}/settings`).pipe(map(r => r.settings));
  }

  updateSettings(changes: Partial<StoreSettings>) {
    return this.http.put<{ settings: StoreSettings }>(`${API_URL}/settings`, changes).pipe(map(r => r.settings));
  }

  terminals() {
    return this.http.get<{ terminals: MpTerminal[] }>(`${API_URL}/terminals`).pipe(map(r => r.terminals || []));
  }
}
