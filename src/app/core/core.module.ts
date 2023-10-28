import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SafeHtmlPipe } from './pipes/safeHtml.pipe';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { StorageService } from './services';
import { AuthInterceptor } from './interceptors';
import { AppStoreModule } from './state/store.module';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { PhoneMaskDirective } from './directive/PhoneMask.directive';

@NgModule({
  declarations: [SafeHtmlPipe, PhoneMaskDirective],
  imports: [CommonModule, AppStoreModule, NzModalModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    // Para la intercepción por cada consulta de http
    StorageService,
  ],
  exports: [SafeHtmlPipe, PhoneMaskDirective],
})
export class CoreModule {}
