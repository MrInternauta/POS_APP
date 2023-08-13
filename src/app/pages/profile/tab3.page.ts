import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page {
  public editMode = false;

  constructor(
    private alertController: AlertController,
    public authService: AuthService
  ) {}
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
}
