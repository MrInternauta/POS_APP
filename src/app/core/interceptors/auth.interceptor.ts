import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { catchError, take } from 'rxjs/operators';

import { API_PREFIX, IGNORE_ERROR } from '../constants';
import { Token } from '../models';
import { StatusCodes } from '../util';
import { environment } from '../../../environments/environment';
import { IAuthState } from '../../auth/state/auth.state';
import { Store } from '@ngrx/store';
import { AppState } from '../state';
import { ConstantsHelper } from '../constants/constants.helper';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  userSesion$!: Observable<IAuthState>;
  headers!: HttpHeaders;
  token!: Token;
  constructor(
    public http: HttpClient,
    private store: Store<AppState>,
    public router: Router,
    private authService: AuthService
  ) {
    this.userSesion$ = this.store.select(ConstantsHelper.USER_DATA_KEY_STORAGE);
    this.userSesion$.pipe(take(1)).subscribe((sesionState: IAuthState) => {
      this.token = sesionState.token;
    });
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const originalUrl = request.url;
    const isApiUrl = this.isApiUrl(originalUrl);
    if (isApiUrl) {
      request = request.clone({
        url: this.rewriteUrl(originalUrl),
      });
      request = this.addTokenHeader(request);
    }
    return next.handle(request).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === StatusCodes.UNAUTHORIZED) {
            // check for unauthorized error and redirect to login page.
            this.redirect();
            const err = error.error.message || error.statusText;
            return throwError(err);
          }
        }
        const err = error.error.message || error.statusText;
        return throwError(err);
      })
    );
  }

  private addTokenHeader(request: HttpRequest<any>) {
    if (this.token) {
      const setHeaders: { [name: string]: string } = {
        Authorization: `Bearer ${this.token}`,
      };
      return request.clone({ setHeaders });
    }
    return request;
  }

  protected isApiUrl(url: string) {
    return url.indexOf(API_PREFIX) === 0;
  }

  protected rewriteUrl(url: string) {
    return environment.url + url;
  }

  redirect(): void {
    this.authService.logout();
  }
}
