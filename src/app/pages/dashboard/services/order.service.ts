import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_PREFIX } from 'src/app/core/constants';

import { environment } from '../../../../environments/environment';
import { OrderFilterDto } from '../../products/models/order.filter.dto';
import { IOrderModel, OrderResponse } from '../models/order.model';

const API_URL = `${environment.url}${API_PREFIX}orders`;

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  public itemSelected!: OrderResponse | null;
  constructor(public http: HttpClient) {}

  getOrders(params?: OrderFilterDto) {
    return this.http.get<IOrderModel | null>(API_URL, {
      params: {
        ...params,
      },
    });
  }
}
