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
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

import { AuthService } from '../../auth/services/auth.service';
import { IAuthState } from '../../auth/state/auth.state';
import { ApiMessageService } from '../i18n/api-message.service';
import { ModalInfoService } from '../services';
import { AppState } from '../state';
import { StatusCodes } from '../util';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  userSesion$!: Observable<IAuthState>;
  headers!: HttpHeaders;
  constructor(
    public http: HttpClient,
    private store: Store<AppState>,
    public router: Router,
    private authService: AuthService,
    private modalInfoService: ModalInfoService,
    private apiMessage: ApiMessageService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const originalUrl = request.url;
    request = request.clone({
      url: originalUrl,
    });
    request = this.addTokenHeader(request);
    return next.handle(request).pipe(
      timeout({
        first: 30_000,
        with: () => throwError(() => new Error(this.apiMessage.translate('timeout'))),
      }),
      catchError(error => {
        //The API answers in english, this is where it is put in the language of the app
        const message = this.apiMessage.translate(error?.error?.message ?? error?.statusText ?? error?.message);

        this.modalInfoService.error(message, '');

        if (error instanceof HttpErrorResponse && error.status === StatusCodes.UNAUTHORIZED) {
          // check for unauthorized error and redirect to login page.
          this.redirect();
        }

        return throwError(() => message);
      })
    );
  }

  private addTokenHeader(request: HttpRequest<any>) {
    if (this.authService?._auth?.token) {
      const setHeaders: { [name: string]: string } = {
        Authorization: `Bearer ${this.authService._auth?.token}`,
      };
      return request.clone({ setHeaders });
    }
    return request;
  }

  redirect(): void {
    this.authService.logout();
  }
}
