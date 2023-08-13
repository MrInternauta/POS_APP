import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';

import { Auth, CreateUser, User } from '../../core/models/usuario.model';
import { IAuthState, setUser, unUser } from '../state';
import { ConstantsHelper } from '../../core/constants/constants.helper';
import { AppState } from '../../core/state/app.reducer';
import { StorageService } from '../../core/services/storage.service';
import { AuthSuccess } from '../model/Auth';
import { GenericResponse, UserCreatedResponse } from '@gymTrack/core';
import { isGenericResponse } from '@gymTrack/core/util/helpers';

const API_URL = `api/`;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  _auth!: IAuthState;

  constructor(
    public http: HttpClient,
    public router: Router,
    private store: Store<AppState>,
    private storage: StorageService
  ) {
    this.loadStorage();
    this.store
      .select(ConstantsHelper.USER_DATA_KEY_STORAGE)
      .subscribe((auth) => {
        this._auth = auth;
        console.log(this._auth);
      });
  }

  get user() {
    return this._auth.user;
  }

  get token() {
    return this._auth.token;
  }

  login(user: Auth, recordar = false) {
    if (recordar) {
      this.storage.setLocal('email', user.email);
    } else {
      this.storage.setLocal('email', null);
    }

    return this.http
      .post<GenericResponse<null> | GenericResponse<AuthSuccess>>(
        `${API_URL}auth`,
        user
      )
      .pipe(
        map((response: any) => {
          if (!isGenericResponse(response)) {
            return;
          }
          const resp = response?.data;
          if (resp && resp.access_token && resp.user) {
            this.saveStorage(resp?.user?.id, resp?.access_token, resp.user);
            return true;
          }
          return false;
        })
      );
  }

  signUp(user: CreateUser) {
    return this.http.post<UserCreatedResponse>(`${API_URL}users`, user);
  }

  getUserbyId(user: CreateUser) {
    return this.http.get<UserCreatedResponse>(`${API_URL}users`);
  }

  async hasSession() {
    let session = await this.store
      .select(ConstantsHelper.USER_DATA_KEY_STORAGE)
      .pipe(take(1))
      .toPromise();
    return (
      session?.id != null && session?.token != null && session?.user != null
    );
  }

  logout() {
    this.storage.setLocal(ConstantsHelper.USER_DATA_KEY_STORAGE, null);
    this.store.dispatch(unUser());
    this.router.navigate(['login']);
  }

  loadStorage() {
    let localStorageAuth = this.storage.getLocal(
      ConstantsHelper.USER_DATA_KEY_STORAGE
    );

    if (localStorageAuth?.user && localStorageAuth?.token) {
      // this.token = localStorageAuth.token;
      const user: User = JSON.parse(localStorageAuth.user);
      if (!user) {
        return;
      }
      this.store.dispatch(
        setUser({
          user,
          id: user?.id ?? 0,
          token: localStorageAuth.token,
        })
      );
    }
  }

  saveStorage(id: number, token: string, usuario: User) {
    this.storage.setLocal(ConstantsHelper.USER_DATA_KEY_STORAGE, {
      id,
      token,
      user: JSON.stringify(usuario),
    });
    this.store.dispatch(setUser({ user: usuario, id, token }));
  }
}
