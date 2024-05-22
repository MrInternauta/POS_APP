import { en_US, NZ_I18N } from 'ng-zorro-antd/i18n';

import { LocationStrategy, PathLocationStrategy, registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { AuthModule } from '@gymTrack/auth';
import { CoreModule } from '@gymTrack/core';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { EffectsModule } from '@ngrx/effects';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PermissionsEffects } from './auth/state/permissions.effects';
import { CartEffects } from './pages/cart/state/cart.effects';
import { ExercisesEffects } from './pages/workout/state/workout.effects';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonLayoutComponent } from './layouts/common-layout/common-layout.component';
import { ThemeConstantService } from './shared/services/theme-constant.service';
import { TemplateModule } from './shared/template/template.module';
import { SharedModule } from './shared/shared.module';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NgChartsModule } from 'ng2-charts';
import { NgApexchartsModule } from 'ng-apexcharts';
import { FullCalendarModule } from '@fullcalendar/angular';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { TabsPageModule } from './pages';

registerLocaleData(en);

@NgModule({
  declarations: [AppComponent, CommonLayoutComponent],
  imports: [
    TabsPageModule,
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    CoreModule,
    AuthModule,
    EffectsModule.forRoot([ExercisesEffects, CartEffects, PermissionsEffects]),
    FormsModule,
    HttpClientModule,
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
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    BarcodeScanner,
    { provide: NZ_I18N, useValue: en_US },
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy,
    },
    ThemeConstantService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
