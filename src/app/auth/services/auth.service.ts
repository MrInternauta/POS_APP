import { map } from 'rxjs/operators';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserCreatedResponse } from '@gymTrack/core';
import { environment } from '@gymTrack/environment';

import { API_PREFIX } from '../../core/constants/api-prefix';
import { ConstantsHelper } from '../../core/constants/constants.helper';
import { StorageService } from '../../core/services/storage.service';
import { isTokenExpired } from '../../core/util';
import { AuthSuccess } from '../model/Auth';
import { UserDto } from '../model/user.dto';
import { IAuthState } from '../state';

const API_URL = `${environment.url}${API_PREFIX}`;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  _auth!: IAuthState | null;

  constructor(
    public http: HttpClient,
    public router: Router,
    private storage: StorageService
    // private store: Store<AppState>
  ) {
    this.loadStorage();
  }

  get user() {
    return this._auth?.user;
  }

  get token() {
    return this._auth?.token;
  }

  login(user: UserDto, recordar = false) {
    if (recordar) {
      this.storage.setLocal('email', user.email);
    } else {
      this.storage.setLocal('email', null);
    }

    return this.http.post<any>(`${API_URL}auth`, user).pipe(
      map((resp: AuthSuccess) => {
        console.log(resp);
        if (resp && resp.user.id && resp.user.name) {
          this._auth = {
            user: resp.user,
            id: resp.user.id,
            token: resp.access_token,
            permissions: [],
          };
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

  getUserbyId() {
    return this.http.get<UserCreatedResponse>(`${API_URL}users`);
  }

  async hasSession() {
    if (this._auth?.id == null || this._auth?.token == null || this._auth?.user == null) {
      return false;
    }

    //An expired token would only make every request fail, the session is closed instead
    if (isTokenExpired(this._auth.token)) {
      this.clearSession();
      return false;
    }

    return true;
  }

  async currentUserAllowToContinue(roles: Array<'ADMIN' | 'CASHIER' | 'CLIENT'>) {
    if (!roles) {
      return false;
    }

    if (!roles?.length) {
      return false;
    }
    console.log(roles, this._auth?.user);

    return roles.some((role: string) => {
      return role.toLowerCase() == String(this._auth?.user?.role?.name || '').toLowerCase();
    });
  }

  logout() {
    this.clearSession();
    this.router.navigate(['authentication', 'login-1']);
  }

  clearSession() {
    this._auth = null;
    this.storage.localDeleteByKey(ConstantsHelper.USER_DATA_KEY_STORAGE);
  }

  /** Brings the session saved by the previous run back, so a reload does not ask to log in again */
  loadStorage() {
    const localStorageSession = this.storage.getLocal(ConstantsHelper.USER_DATA_KEY_STORAGE);

    if (!localStorageSession) {
      return;
    }

    try {
      //Sessions saved by older versions keep the user as a string
      const user: UserDto =
        typeof localStorageSession.user === 'string' ? JSON.parse(localStorageSession.user) : localStorageSession.user;

      if (!localStorageSession?.id || !localStorageSession?.token || !user) {
        return;
      }

      if (isTokenExpired(localStorageSession.token)) {
        this.clearSession();
        return;
      }

      const AuthObjectSession: IAuthState = { ...localStorageSession, user };
      this._auth = AuthObjectSession;
    } catch (error) {
      console.log('error', error);
      this.clearSession();
    }
  }

  saveStorage(id: string, token: string, usuario: UserDto) {
    this.storage.setLocal(ConstantsHelper.USER_DATA_KEY_STORAGE, {
      id,
      token,
      user: usuario,
    });
    //this.store.dispatch(setUser({ user: usuario, id, token }));
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
