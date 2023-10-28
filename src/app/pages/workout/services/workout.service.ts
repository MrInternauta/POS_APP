import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_PREFIX } from 'src/app/core/constants';
import { GenericResponse, IExercise } from 'src/app/core/models';
import { environment } from '../../../../environments/environment';
import { ArticleResponse } from '../models';
import { ProductsFilterDto } from '../models/productFilter.dto';

const API_URL = `${environment.url}${API_PREFIX}products`;

@Injectable({
  providedIn: 'root',
})
export class WorkoutService {
  constructor(public http: HttpClient) {}

  getProducts(params?: ProductsFilterDto) {
    return this.http.get<ArticleResponse | null>(
      API_URL,
      {
        params: {
          ... params
        }
      }
    );
  }
}
