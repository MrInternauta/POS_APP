import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { UserDto, UserUpdateDto } from '@gymTrack/auth/model/user.dto';
import { ActionSheetController, AlertController, ModalController, ToastController } from '@ionic/angular';
import { TranslocoService } from '@jsverse/transloco';
import { Store } from '@ngrx/store';
import { Observable, Subscription, take } from 'rxjs';

import { StoreSummary } from '../../auth/model/store';
import { selectCanManage, selectIsSuperAdmin, selectStore, selectStores } from '../../auth/state';
import { AppState } from '../../core/state/app.reducer';
import { CleanCart } from '../cart/state/cart.actions';
import { CustomersComponent } from '../customers/customers.component';
import { AdminStoresComponent } from '../store/admin-stores.component';
import { StoreService } from '../store/store.service';
import { TeamComponent } from '../store/team.component';

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
  public store$: Observable<StoreSummary | null> = this.store.select(selectStore);
  public stores$: Observable<StoreSummary[]> = this.store.select(selectStores);
  public canManage$: Observable<boolean> = this.store.select(selectCanManage);
  public isSuperAdmin$: Observable<boolean> = this.store.select(selectIsSuperAdmin);
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
    private transloco: TranslocoService,
    private store: Store<AppState>,
    private storeService: StoreService,
    private modalCtrl: ModalController,
    private actionSheetController: ActionSheetController,
    private router: Router
  ) {
    this.userToUpdate = {};
  }

  /** The owner changes the store's name and contact; the session is renewed so the name shows */
  editStore(): void {
    this.storeService.current().subscribe(async ({ store }) => {
      const t = (key: string) => this.transloco.translate(`storeSetup.${key}`);
      const alert = await this.alertController.create({
        header: this.transloco.translate('myStore.details'),
        inputs: [
          { name: 'name', placeholder: t('name'), value: store.name, attributes: { maxlength: 255 } },
          {
            name: 'phone',
            type: 'tel',
            placeholder: t('phone'),
            value: store.phone ?? '',
            attributes: { maxlength: 50 },
          },
          { name: 'address', placeholder: t('address'), value: store.address ?? '', attributes: { maxlength: 255 } },
        ],
        buttons: [
          { text: this.transloco.translate('common.cancel'), role: 'cancel' },
          {
            text: this.transloco.translate('common.save'),
            handler: (values: Record<string, string>) => {
              const name = String(values?.['name'] ?? '').trim();
              if (name.length < 2) {
                this.modalInfoService.warning(t('nameRequired'), '');
                return false;
              }
              this.storeService
                .updateCurrent({
                  name,
                  phone: String(values?.['phone'] ?? '').trim(),
                  address: String(values?.['address'] ?? '').trim(),
                })
                .subscribe(() => {
                  this.authService.switchStore(store.id).subscribe();
                  this.modalInfoService.success(this.transloco.translate('myStore.saved'), '');
                });
              return true;
            },
          },
        ],
      });
      await alert.present();
    });
  }

  async openTeam() {
    const modal = await this.modalCtrl.create({
      component: TeamComponent,
      componentProps: { currentUserId: this.authService.user?.id ?? null },
    });
    await modal.present();
  }

  async openCustomers() {
    const canDelete = await new Promise<boolean>(resolve => this.canManage$.pipe(take(1)).subscribe(resolve));
    const modal = await this.modalCtrl.create({
      component: CustomersComponent,
      componentProps: { mode: 'manage', canDelete },
    });
    await modal.present();
  }

  async openAdminStores() {
    const modal = await this.modalCtrl.create({ component: AdminStoresComponent });
    await modal.present();
    const { data, role } = await modal.onWillDismiss<number>();
    if (role === 'enter' && data) {
      this.switchTo(data);
    }
  }

  /** Opens the public catalogue here, or copies its link to share */
  async shareCatalog(slug: string) {
    const link = `${window.location.origin}/catalogo/${slug}`;
    const sheet = await this.actionSheetController.create({
      header: this.transloco.translate('myStore.catalog'),
      subHeader: link,
      buttons: [
        {
          text: this.transloco.translate('myStore.catalogOpen'),
          handler: () => void this.router.navigate(['catalogo', slug]),
        },
        {
          text: this.transloco.translate('myStore.catalogCopy'),
          handler: () => {
            navigator.clipboard
              ?.writeText(link)
              .then(() => this.toast(this.transloco.translate('myStore.catalogCopied')))
              .catch(() => this.toast(link));
          },
        },
        { text: this.transloco.translate('common.cancel'), role: 'cancel' },
      ],
    });
    await sheet.present();
  }

  async chooseStore() {
    const [stores, current] = await Promise.all([
      new Promise<StoreSummary[]>(resolve => this.stores$.pipe(take(1)).subscribe(resolve)),
      new Promise<StoreSummary | null>(resolve => this.store$.pipe(take(1)).subscribe(resolve)),
    ]);
    const sheet = await this.actionSheetController.create({
      header: this.transloco.translate('myStore.switch'),
      buttons: [
        ...stores
          .filter(store => store.id !== current?.id)
          //Starting the switch without handing its promise back closes the sheet right away
          .map(store => ({ text: store.name, handler: () => void this.switchTo(store.id) })),
        { text: this.transloco.translate('common.cancel'), role: 'cancel' },
      ],
    });
    await sheet.present();
  }

  /**
   * Works in another store from now on. The cart holds the products of the store it was filled in,
   * so it is emptied: they would not sell in the new one.
   */
  switchTo(storeId: number) {
    this.authService.switchStore(storeId).subscribe(() => {
      this.store.dispatch(CleanCart());
      this.toast(this.transloco.translate('myStore.switched', { name: this.authService.activeStore?.name ?? '' }));
      this.router.navigate(['tabs', 'tab2'], { replaceUrl: true });
    });
  }

  newStore() {
    this.router.navigate(['store', 'new']);
  }

  async changePassword() {
    const t = (key: string, params?: Record<string, unknown>) => this.transloco.translate(`password.${key}`, params);
    const alert = await this.alertController.create({
      header: t('change'),
      inputs: [
        { name: 'current', type: 'password', placeholder: t('current') },
        { name: 'next', type: 'password', placeholder: t('new'), attributes: { minlength: 8, maxlength: 72 } },
        { name: 'repeat', type: 'password', placeholder: t('repeat'), attributes: { maxlength: 72 } },
      ],
      buttons: [
        { text: this.transloco.translate('common.cancel'), role: 'cancel' },
        {
          text: this.transloco.translate('common.save'),
          handler: (values: Record<string, string>) => {
            const next = String(values?.['next'] ?? '');
            if (!values?.['current'] || next.length < 8) {
              this.modalInfoService.warning(t('tooShort', { min: 8 }), '');
              return false;
            }
            if (next !== values?.['repeat']) {
              this.modalInfoService.warning(t('mismatch'), '');
              return false;
            }
            this.storeService
              .changePassword(values['current'], next)
              .subscribe(() => this.modalInfoService.success(t('changed'), ''));
            return true;
          },
        },
      ],
    });
    await alert.present();
  }

  private async toast(message: string) {
    const toast = await this.toastController.create({ message, duration: 2500, position: 'top', color: 'success' });
    await toast.present();
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
