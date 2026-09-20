import { Component, OnDestroy } from '@angular/core';
import { UserDto, UserUpdateDto } from '@gymTrack/auth/model/user.dto';
import { AlertController, ToastController } from '@ionic/angular';
import { TranslocoService } from '@jsverse/transloco';
import { Observable, Subscription } from 'rxjs';

import { AuthService } from '../../auth/services/auth.service';
import { Language, LanguageService } from '../../core/i18n/language.service';
import { ModalInfoService } from '../../core/services/modal.service';
import { PictureService } from '../../core/services/picture.service';
import { ThemeMode, ThemeService } from '../../core/services/theme.service';
import { ProfileService } from './services/profile.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page implements OnDestroy {
  public editMode = false;
  $susctiption!: Subscription;
  /** Followed by the view, so a saved change or a new picture shows up straight away */
  public user$: Observable<UserDto | null> = this.authService.user$;
  public themeMode$: Observable<ThemeMode> = this.themeService.mode$;
  public language$: Observable<Language> = this.languageService.language$;
  private userToUpdate!: UserUpdateDto;
  constructor(
    private alertController: AlertController,
    public authService: AuthService,
    private userService: ProfileService,
    private toastController: ToastController,
    private modalInfoService: ModalInfoService,
    private pictureService: PictureService,
    private themeService: ThemeService,
    private languageService: LanguageService,
    private transloco: TranslocoService
  ) {
    this.userToUpdate = {};
  }

  changeTheme(event: any): void {
    this.themeService.setMode(event?.detail?.value as ThemeMode);
  }

  changeLanguage(event: any): void {
    this.languageService.use(event?.detail?.value as Language);
  }

  async sendResetPassword() {
    //TODO: Send email to reset
    const alert = await this.alertController.create({
      header: this.transloco.translate('profile.resetPassword'),
      message: this.transloco.translate('profile.resetPasswordMessage'),
      buttons: ['OK'],
    });

    await alert.present();
  }

  updateUserPicture() {
    this.pictureService.changePicture(this.authService.user?.id?.toString() || '', 'user', uploaded => {
      const image = uploaded?.image;

      if (!image) {
        return;
      }

      const user = this.authService.user;

      if (!user) {
        return;
      }

      //The file keeps its name, the timestamp is what makes the view ask for it again
      this.saveUser({ ...user, image: `${image}?${new Date().getTime()}` });
    });
  }

  async upgradePro() {
    const alert = await this.alertController.create({
      header: this.transloco.translate('profile.upgrade'),
      message: this.transloco.translate('profile.upgradeMessage'),
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
        //The API answers with the whole user, but not with its image, which it never changes here
        this.saveUser({ ...this.authService.user, ...res.user, image: this.authService.user?.image } as UserDto);
        this.userToUpdate = {};
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

  /** Pushes the user through the auth service, which keeps memory, storage and the store together */
  private saveUser(user: UserDto) {
    this.authService.saveStorage(
      user?.id?.toString() || this.authService._auth?.id?.toString() || '',
      this.authService._auth?.token || '',
      user
    );
  }

  presentModal(text = '', type: 'warning' | 'success' = 'warning') {
    if (type == 'warning') {
      this.modalInfoService.warning(text || this.transloco.translate('profile.noChanges'), '');
    } else {
      this.modalInfoService.success(text || this.transloco.translate('profile.saved'), '');
    }
  }

  ngOnDestroy(): void {
    this.$susctiption?.unsubscribe();
  }
}
