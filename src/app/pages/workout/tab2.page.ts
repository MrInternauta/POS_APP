/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { InProgressComponent } from './add/in-progress.component';
import { Store } from '@ngrx/store';
import { AppState } from '../../core/state/app.reducer';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner/ngx';

import {
  loadExercise,
  loadExerciseType,
  loadedExercise,
} from './state/workout.actions';
import { ConstantsHelper } from '@gymTrack/core/constants/constants.helper';
import {
  Observable,
  Subscription,
  filter,
  find,
  map,
  switchMap,
  take,
  tap,
} from 'rxjs';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page implements OnDestroy, OnInit {
  $susctiption!: Subscription;
  public $observable!: Observable<any>;
  public tempProduc$!: Observable<any> | null;
  message =
    'This modal example uses the modalController to present and dismiss modals.';
  public historyWorkout!: Array<any>;
  constructor(
    private modalCtrl: ModalController,
    private store: Store<AppState>,
    private barcodeScanner: BarcodeScanner
  ) {
    this.store.dispatch(loadExercise());
    this.$observable = this.store.select('exercises');
    this.getArticle();
  }

  async startWorkout() {
    const modal = await this.modalCtrl.create({
      component: InProgressComponent,
    });
    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      this.message = `Hello, ${data}!`;
    }
  }
  async getArticle() {
    this.$susctiption = this.$observable.subscribe((data) => {
      console.log(data);
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.$susctiption.unsubscribe();
  }

  scanCode() {
    this.startWorkout();
    return;
    this.barcodeScanner
      .scan()
      .then((barcodeData) => {
        console.log('Barcode data', barcodeData);
      })
      .catch((err) => {
        console.log('Error', err);
      });
  }

  searchFunction($termSearch: any) {
    const value = $termSearch?.target?.value;
    if (!value || value?.length < 3) {
      this.tempProduc$ = null;
      return;
    }
    this.tempProduc$ = this.$observable.pipe(
      map((item_) =>
        item_?.Exercise?.aaData.filter(
          (item: any) =>
            String(item.nombre)
              .toLocaleLowerCase()
              .includes(String(value).toLocaleLowerCase()) ||
            String(item.descripcion)
              .toLocaleLowerCase()
              .includes(String(value).toLocaleLowerCase())
        )
      ),

      tap(console.log)
    );
  }

  searchbyCode(code: string) {
    if (!code || code?.length < 3) {
      this.tempProduc$ = null;
      return;
    }

    this.tempProduc$ = this.$observable.pipe(
      filter((value) => {
        return String(value.codigo)
          .toLocaleLowerCase()
          .includes(code.toLocaleLowerCase());
      })
    );
  }

  hideSearch() {
    this.tempProduc$ = null;
  }
}
