import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';

import { Auth, CreateUser } from '../../core/models/usuario.model';
import { IAuthState, setUser, unUser } from '../state';
import { ConstantsHelper } from '../../core/constants/constants.helper';
import { AppState } from '../../core/state/app.reducer';
import { StorageService } from '../../core/services/storage.service';
import { UserCreatedResponse } from '@gymTrack/core';
import { environment } from '@gymTrack/environment';
import { API_PREFIX } from '../../core/constants/api-prefix';
import { UserDto } from '../model/user.dto';
import { AuthSuccess } from '../model/Auth';

const API_URL = `${environment.url}${API_PREFIX}`;

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
      });
  }

  get user() {
    return this._auth.user;
  }

  get token() {
    return this._auth.token;
  }

  login(user: UserDto, recordar = false) {
    if (recordar) {
      this.storage.setLocal('email', user.email);
    } else {
      this.storage.setLocal('email', null);
    }

    return this.http
      .post<any>(`${API_URL}auth`, user)
      .pipe(
        map((resp: AuthSuccess) => {
          console.log(resp.user);
          if (resp && resp.user.id && resp.user.name) {
            this.saveStorage(resp.user?.id.toString(), resp.access_token, resp.user);
            return true;
          }
          return false;
        })
      );
  }

  signUp(user: UserDto) {
    return this.http.post<UserCreatedResponse>(`${API_URL}users`, user);
  }

  getUserbyId(user: UserDto) {
    return this.http.get<UserCreatedResponse>(`${API_URL}users`);
  }

  async hasSession() {
    let session = await this.store
      .select(ConstantsHelper.USER_DATA_KEY_STORAGE)
      .pipe(take(1))
      .toPromise();
      console.log(session);

    return (
      session?.id != null && session?.token != null && session?.user != null
    );
  }

  logout() {
    this.storage.setLocal(ConstantsHelper.USER_DATA_KEY_STORAGE, null);
    this.store.dispatch(unUser());
    this.router.navigate(['authentication','login-1']);
  }

  loadStorage() {
    let localStorageAuth = this.storage.getLocal(
      ConstantsHelper.USER_DATA_KEY_STORAGE
    );

    if (localStorageAuth?.user && localStorageAuth?.token) {
      // this.token = localStorageAuth.token;
      const user: UserDto = JSON.parse(localStorageAuth.user);
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

  saveStorage(id: string, token: string, usuario: UserDto) {
    this.storage.setLocal(ConstantsHelper.USER_DATA_KEY_STORAGE, {
      id,
      token,
      user: JSON.stringify(usuario),
    });
    this.store.dispatch(setUser({ user: usuario, id, token }));
  }

  getPerssions(userId: string) {
    return this.http.post<Array<Permissions> | null>(
      API_URL,
      {},
      {
        params: {
          op: 'permisos',
          id: userId,
        },
      }
    );
  }
}
