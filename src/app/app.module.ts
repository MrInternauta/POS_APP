import { en_US, NZ_I18N } from 'ng-zorro-antd/i18n';

import { LocationStrategy, PathLocationStrategy, registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { AuthModule } from '@gymTrack/auth';
import { CoreModule } from '@gymTrack/core';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { EffectsModule } from '@ngrx/effects';

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { Network } from '@awesome-cordova-plugins/network/ngx';
import { FullCalendarModule } from '@fullcalendar/angular';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NgChartsModule } from 'ng2-charts';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PermissionsEffects } from './auth/state/permissions.effects';
import { CommonLayoutComponent } from './layouts/common-layout/common-layout.component';
import { CartEffects } from './pages/cart/state/cart.effects';
import { ExercisesEffects } from './pages/products/state/workout.effects';
import { ThemeConstantService } from './shared/services/theme-constant.service';
import { SharedModule } from './shared/shared.module';
import { TemplateModule } from './shared/template/template.module';

registerLocaleData(en);

@NgModule({
  declarations: [AppComponent, CommonLayoutComponent],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    CoreModule,
    AuthModule,
    EffectsModule.forRoot([ExercisesEffects, CartEffects, PermissionsEffects]),
    FormsModule,
    TemplateModule,
    SharedModule,
    NzBreadCrumbModule,
    NzSpinModule,
    NgChartsModule,
    NgApexchartsModule,
    FullCalendarModule,
    AngularSvgIconModule.forRoot(),
  ],
  providers: [
    Network,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    BarcodeScanner,
    { provide: NZ_I18N, useValue: en_US },
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy,
    },
    ThemeConstantService,
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class AppModule {}
