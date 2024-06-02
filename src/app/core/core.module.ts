import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SafeHtmlPipe } from './pipes/safeHtml.pipe';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { StorageService } from './services';
import { AuthInterceptor } from './interceptors';
import { AppStoreModule } from './state/store.module';
import { NzModalModule } from 'ng-zorro-antd/modal';

@NgModule({
  declarations: [SafeHtmlPipe],
  imports: [CommonModule, AppStoreModule, NzModalModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    // Para la intercepción por cada consulta de http
    StorageService,
  ],
  exports: [SafeHtmlPipe],
})
export class CoreModule {}
