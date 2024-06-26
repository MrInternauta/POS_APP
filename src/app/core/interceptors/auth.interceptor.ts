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
import { ModalInfoService } from '../services';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  userSesion$!: Observable<IAuthState>;
  headers!: HttpHeaders;
  constructor(
    public http: HttpClient,
    private store: Store<AppState>,
    public router: Router,
    private authService: AuthService,
    private modalInfoService: ModalInfoService
  ) {}

  // getToken(){
  //   let session = await this.store
  //   .select(ConstantsHelper.USER_DATA_KEY_STORAGE)
  //   .pipe(take(1))
  //   .toPromise();
  // return (
  //   session?.id != null && session?.token != null && session?.user != null
  // );
  // }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const originalUrl = request.url;
    request = request.clone({
      url: originalUrl,
    });
    request = this.addTokenHeader(request);
    return next.handle(request).pipe(
      catchError((error) => {
        //this.modalInfoService.error();
        this.modalInfoService.error(
          error?.error?.message || 'Something is wrong',
          ''
        );

        console.log(error?.error?.message);

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
    console.log(this.authService._auth.token);

    if (this.authService._auth.token) {
      const setHeaders: { [name: string]: string } = {
        Authorization: `Bearer ${this.authService._auth.token}`,
      };
      return request.clone({ setHeaders });
    }
    return request;
  }

  redirect(): void {
    this.authService.logout();
  }
}
