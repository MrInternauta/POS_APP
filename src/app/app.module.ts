import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EffectsModule } from '@ngrx/effects';
import { CoreModule } from '@gymTrack/core';
import { AuthModule } from '@gymTrack/auth';
import { ExercisesEffects } from './pages/workout/state/workout.effects';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';
import { CartEffects } from './pages/cart/state/cart.effects';
import { PermissionsEffects } from './auth/state/permissions.effects';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    CoreModule,
    AuthModule,
    EffectsModule.forRoot([ExercisesEffects, CartEffects, PermissionsEffects]),
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    BarcodeScanner,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
