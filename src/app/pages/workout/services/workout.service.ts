import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_PREFIX } from 'src/app/core/constants';
import { GenericResponse, IExercise } from 'src/app/core/models';
import { environment } from '../../../../environments/environment';
import { ArticleResponse } from '../models';

const API_URL = `${environment.url}${API_PREFIX}articulo.php`;

@Injectable({
  providedIn: 'root',
})
export class WorkoutService {
  constructor(public http: HttpClient) {}

  getProducts() {
    return this.http.post<ArticleResponse | null>(
      API_URL,
      {},
      {
        params: {
          op: 'listarArticulosVenta',
        },
      }
    );
  }
}
