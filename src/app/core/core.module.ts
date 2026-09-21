import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { AuthInterceptor } from './interceptors';
import { SafeHtmlPipe } from './pipes/safeHtml.pipe';
import { AppStoreModule } from './state/store.module';

@NgModule({
  declarations: [SafeHtmlPipe],
  imports: [CommonModule, AppStoreModule, NzModalModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    // Para la intercepción por cada consulta de http
  ],
  exports: [SafeHtmlPipe],
})
export class CoreModule {}
