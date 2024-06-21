import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_PREFIX } from 'src/app/core/constants';
import { GenericResponse, IExercise, User } from 'src/app/core/models';
import { environment } from '../../../../environments/environment';
import { UserDto, UserUpdateDto } from '@gymTrack/auth/model/user.dto';
import { ProductsFilterDto } from '@gymTrack/pages/products/models/productFilter.dto';
import { UserUpdatedResponse } from '../models';
import { ArticleItemResponse } from '../../products/models/index';
const API_URL = `${environment.url}${API_PREFIX}users`;

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(public http: HttpClient) {}

  getUsers(params?: ProductsFilterDto) {
    return this.http.get<ArticleItemResponse | null>(API_URL, {
      params: {
        ...params,
      },
    });
  }

  postUser(user: UserDto) {
    return this.http.post<any | null>(API_URL, user);
  }

  putUser(userId: string, user: UserUpdateDto) {
    return this.http.put<UserUpdatedResponse>(`${API_URL}/${userId}`, user);
  }

  deleteUser(userId: string) {
    return this.http.delete<any | null>(`${API_URL}/${userId}`);
  }
}
