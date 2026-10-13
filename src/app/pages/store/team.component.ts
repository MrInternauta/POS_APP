import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { TranslocoService } from '@jsverse/transloco';

import { StoreRole } from '../../auth/model/store';
import { ModalInfoService } from '../../core/services/modal.service';
import { Member, NewMember } from './store.model';
import { StoreService } from './store.service';

/** MIN of the API: a temporary password shorter than this is refused */
const MIN_PASSWORD = 8;

/**
 * Who works in the store, for its owner: adding someone (a new email gets an account with a
 * temporary password, an existing one just joins), changing their role and removing them.
 */
@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
})
export class TeamComponent implements OnInit {
  /** Marks "you" in the list */
  @Input() currentUserId: number | null = null;

  members: Member[] = [];
  loading = false;
  adding = false;
  saving = false;
  draft: NewMember = emptyDraft();

  constructor(
    private storeService: StoreService,
    private modalCtrl: ModalController,
    private alertController: AlertController,
    private modalInfoService: ModalInfoService,
    private transloco: TranslocoService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  trackById(_index: number, member: Member) {
    return member.id;
  }

  close() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  load() {
    this.loading = true;
    this.storeService.members().subscribe({
      next: ({ members }) => {
        this.loading = false;
        this.members = members;
      },
      error: () => (this.loading = false),
    });
  }

  startAdding() {
    this.draft = emptyDraft();
    this.adding = true;
  }

  add() {
    const email = this.draft.email.trim();
    if (!email) {
      this.modalInfoService.warning(this.transloco.translate('team.emailRequired'), '');
      return;
    }
    //A password is only needed for a new account; the API says so if the email has none
    if (this.draft.password && this.draft.password.length < MIN_PASSWORD) {
      this.modalInfoService.warning(this.transloco.translate('team.passwordShort', { min: MIN_PASSWORD }), '');
      return;
    }
    this.saving = true;
    const member: NewMember = {
      email,
      role: this.draft.role,
      ...(this.draft.name?.trim() ? { name: this.draft.name.trim() } : {}),
      ...(this.draft.lastName?.trim() ? { lastName: this.draft.lastName.trim() } : {}),
      ...(this.draft.phone?.trim() ? { phone: this.draft.phone.trim() } : {}),
      ...(this.draft.password ? { password: this.draft.password } : {}),
    };
    this.storeService.addMember(member).subscribe({
      next: () => {
        this.saving = false;
        this.adding = false;
        this.modalInfoService.success(this.transloco.translate('team.added'), email);
        this.load();
      },
      //The interceptor already shows what the API said (an account that needs a name, one already in)
      error: () => (this.saving = false),
    });
  }

  async changeRole(member: Member) {
    const role: StoreRole = member.role === 'OWNER' ? 'CASHIER' : 'OWNER';
    const alert = await this.alertController.create({
      header: this.transloco.translate('team.changeRole'),
      message: this.transloco.translate('team.changeRoleMessage', {
        name: `${member.user.name} ${member.user.lastName}`.trim(),
        role: this.transloco.translate(`team.roles.${role}`),
      }),
      buttons: [
        { text: this.transloco.translate('common.cancel'), role: 'cancel' },
        {
          text: this.transloco.translate('team.changeRoleConfirm'),
          handler: () => {
            this.storeService.changeRole(member.id, role).subscribe(() => this.load());
          },
        },
      ],
    });
    await alert.present();
  }

  async remove(member: Member) {
    const alert = await this.alertController.create({
      header: this.transloco.translate('team.remove'),
      message: this.transloco.translate('team.removeMessage', {
        name: `${member.user.name} ${member.user.lastName}`.trim(),
      }),
      buttons: [
        { text: this.transloco.translate('common.cancel'), role: 'cancel' },
        {
          text: this.transloco.translate('team.removeConfirm'),
          role: 'destructive',
          handler: () => {
            this.storeService.removeMember(member.id).subscribe(() => {
              this.members = this.members.filter(row => row.id !== member.id);
            });
          },
        },
      ],
    });
    await alert.present();
  }
}

function emptyDraft(): NewMember {
  return { email: '', role: 'CASHIER', name: '', lastName: '', phone: '', password: '' };
}
