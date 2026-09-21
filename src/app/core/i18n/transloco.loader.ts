import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Translation, TranslocoLoader } from '@jsverse/transloco';

@Injectable({
  providedIn: 'root',
})
export class TranslocoHttpLoader implements TranslocoLoader {
  private http: HttpClient;

  constructor(handler: HttpBackend) {
    //Straight to the backend: a translation file is not an API call and must not carry the token
    //or be swallowed by the error modal the interceptor shows
    this.http = new HttpClient(handler);
  }

  getTranslation(lang: string) {
    return this.http.get<Translation>(`assets/i18n/${lang}.json`);
  }
}
