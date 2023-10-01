import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../../auth/services/auth.service';
import { environment } from '../../../environments/environment';
import { Store } from '@ngrx/store';
import { AppState } from '../../core/state/app.reducer';
import { loadPermissions } from '../../auth/state/auth.actions';
import { Observable, Subscription, map, tap } from 'rxjs';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page implements OnDestroy {
  public editMode = false;
  $susctiption!: Subscription;
  public $observable!: Observable<any>;
  constructor(
    private alertController: AlertController,
    public authService: AuthService,
    private store: Store<AppState>
  ) {
    this.store.dispatch(loadPermissions());

    this.$observable = this.store.select('session_data').pipe(
      map((item) => item.permissions),
      tap(console.log)
    );
  }

  async sendResetPassword() {
    //TODO: Send email to reset
    const alert = await this.alertController.create({
      header: 'Reset password',
      message: 'An email will be sent, please, confirm the email to proceed',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async upgradePro() {
    const alert = await this.alertController.create({
      header: 'Upgrade to PRO',
      message: 'An email will be sent to proceed',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async editProfile() {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      //TODO: Update
      //Detect changes
    }
  }

  ngOnDestroy(): void {
    this.$susctiption?.unsubscribe();
  }
}
