import { Component, OnDestroy } from '@angular/core';
import { UserUpdateDto } from '@gymTrack/auth/model/user.dto';
import { AlertController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { AuthService } from '../../auth/services/auth.service';
import { ModalInfoService } from '../../core/services/modal.service';
import { PictureService } from '../../core/services/picture.service';
import { ProfileService } from './services/profile.service';

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
    this.pictureService.changePicture(this.authService._auth?.user?.id?.toString() || '', 'user', () => {
      //update the image in the view
      if (this.authService._auth?.user?.image) {
        this.authService._auth.user.image = this.authService._auth.user.image + '?' + new Date().getTime();
      }
    });
  }

  async upgradePro() {
    const alert = await this.alertController.create({
      header: 'Upgrade to PRO',
      message: 'An email will be sent to proceed',
      buttons: ['OK'],
    });

    await alert.present();
  }

  public get areChangesAvalible() {
    return this.userToUpdate.name || this.userToUpdate.lastName || this.userToUpdate.phone || this.userToUpdate.role;
  }

  async editProfile() {
    if (this.areChangesAvalible) {
      this.userToUpdate = {
        ...this.authService._auth?.user,
        ...this.userToUpdate,
      };

      console.log(this.userToUpdate);
      //remove special characters from phone
      this.userToUpdate.phone = this.userToUpdate?.phone?.replace(/\D/g, '') || '';
      //Detect changes
      const usertoUpdate = {
        name: this.userToUpdate.name,
        lastName: this.userToUpdate.lastName,
        phone: this.userToUpdate.phone,
        role: this.userToUpdate.role,
      };
      console.log(usertoUpdate);
      this.$susctiption = this.userService.putUser(String(this.authService.user?.id), usertoUpdate).subscribe(res => {
        this.presentModal(res.message, 'success');
        this.authService.saveStorage(res?.user?.id?.toString() || '', this.authService._auth?.token || '', res.user);
        this.editMode = false;
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
