import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_PREFIX } from 'src/app/core/constants';
import { GenericResponse, IExercise } from 'src/app/core/models';
import { environment } from '../../../../environments/environment';

const API_URL = `${environment.url}${API_PREFIX}articulo.php`;

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(public http: HttpClient) {}

  checkoutProducts(products: any) {
    return this.http.post<any | null>(
      API_URL,
      { products },
      {
        params: {
          op: 'listar',
        },
      }
    );
  }
}
