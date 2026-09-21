import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { META_REDUCERS, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { StorageService } from '../services/storage.service';
import { appReducers } from './app.reducer';
import { persistStateMetaReducer } from './persist.meta-reducer';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forRoot(appReducers),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: true,
      connectInZone: true,
    }),
  ],
  providers: [
    {
      provide: META_REDUCERS,
      deps: [StorageService],
      useFactory: persistStateMetaReducer,
      multi: true,
    },
  ],
})
export class AppStoreModule {}
