import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_PREFIX } from 'src/app/core/constants';
import { GenericResponse, IExercise } from 'src/app/core/models';
import { environment } from '../../../../environments/environment';
import { CheckoutResponse } from '../models/checkout.response';
import { ICheckoutRequest } from '../models/checkout';

const API_URL = `${environment.url}${API_PREFIX}orders`;

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(public http: HttpClient) {}

  checkoutProducts(request: ICheckoutRequest) {
    return this.http.post<CheckoutResponse | null>(API_URL, request);
  }
}
