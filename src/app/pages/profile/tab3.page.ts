import { Component, OnDestroy, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { AuthService } from '../../auth/services/auth.service';
import { environment } from '../../../environments/environment';
import { Store } from '@ngrx/store';
import { AppState } from '../../core/state/app.reducer';
import { loadPermissions } from '../../auth/state/auth.actions';
import { Observable, Subscription, map, tap } from 'rxjs';
import { UserUpdateDto } from '@gymTrack/auth/model/user.dto';
import { ProfileService } from './services/profile.service';
import { ModalInfoService } from '../../core/services/modal.service';
import { PictureService } from '../../core/services/picture.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page implements OnDestroy {
  public editMode = false;
  $susctiption!: Subscription;
  private userToUpdate!: UserUpdateDto;
  constructor(
    private alertController: AlertController,
    public authService: AuthService,
    private userService: ProfileService,
    private toastController: ToastController,
    private modalInfoService: ModalInfoService,
    private pictureService: PictureService
  ) {
    this.userToUpdate = {};
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

  updateUserPicture() {
    this.pictureService.changePicture(this.authService._auth.user?.id?.toString() || '', 'user');
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
    if (this.userToUpdate.name || this.userToUpdate.lastName || this.userToUpdate.phone || this.userToUpdate.role) {
      this.userToUpdate = {
        ...this.authService._auth.user,
        ...this.userToUpdate,
      };

      console.log(this.userToUpdate);

      //Detect changes
      this.$susctiption = this.userService
        .putUser(String(this.authService.user?.id), {
          name: this.userToUpdate.name,
          lastName: this.userToUpdate.lastName,
          phone: this.userToUpdate.phone,
          role: this.userToUpdate.role,
        })
        .subscribe(res => {
          console.log(res.user);

          this.presentModal(res.message, 'success');
          this.authService.saveStorage(res?.user?.id?.toString() || '', this.authService._auth.token || '', res.user);
        });
    } else {
      this.presentModal();
    }
  }

  changeName($event: any) {
    this.userToUpdate['name'] = $event as string;
  }
  changelastName($event: any) {
    this.userToUpdate['lastName'] = $event as string;
  }
  changePhone($event: any) {
    this.userToUpdate['phone'] = $event as string;
  }

  presentModal(text = '', type: 'warning' | 'success' = 'warning') {
    if (type == 'warning') {
      this.modalInfoService.warning(text || 'No hay cambios pendientes para guardar', '');
    } else {
      this.modalInfoService.success(text || 'Guardado correctamente', '');
    }
  }

  ngOnDestroy(): void {
    this.$susctiption?.unsubscribe();
  }
}
