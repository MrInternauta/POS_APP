import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { TranslocoService } from '@jsverse/transloco';
import { Subject, Subscription, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

import { ModalInfoService } from '../../core/services/modal.service';
import { Customer, CustomerChanges } from './customer.model';
import { CustomersService } from './customers.service';

/**
 * The store's customers. Picking (from the cart) closes the modal with the customer chosen;
 * managing (from the profile) edits them. Both can add one, which is the usual thing to need at the
 * till.
 */
@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
})
export class CustomersComponent implements OnInit, OnDestroy {
  @Input() mode: 'pick' | 'manage' = 'pick';
  /** Only whoever runs the store deletes customers */
  @Input() canDelete = false;
  @Input() selectedId: number | null = null;

  customers: Customer[] = [];
  total = 0;
  search = '';
  loading = false;
  private search$ = new Subject<string>();
  private subscription?: Subscription;

  constructor(
    private customersService: CustomersService,
    private modalCtrl: ModalController,
    private alertController: AlertController,
    private modalInfoService: ModalInfoService,
    private transloco: TranslocoService
  ) {}

  ngOnInit(): void {
    this.subscription = this.search$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(term => {
          this.loading = true;
          return this.customersService.list(term);
        })
      )
      .subscribe({
        next: ({ customers, total }) => {
          this.loading = false;
          this.customers = customers;
          this.total = total;
        },
        error: () => (this.loading = false),
      });
    this.search$.next('');
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  trackById(_index: number, customer: Customer) {
    return customer.id;
  }

  onSearch(term: string) {
    this.search = term ?? '';
    this.search$.next(this.search);
  }

  close() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  choose(customer: Customer) {
    if (this.mode === 'pick') {
      return this.modalCtrl.dismiss(customer, 'picked');
    }
    return this.edit(customer);
  }

  async edit(customer?: Customer) {
    const t = (key: string) => this.transloco.translate(`customers.${key}`);
    const alert = await this.alertController.create({
      header: t(customer ? 'edit' : 'add'),
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: t('name'),
          value: customer?.name ?? this.search,
          attributes: { maxlength: 255 },
        },
        {
          name: 'phone',
          type: 'tel',
          placeholder: t('phone'),
          value: customer?.phone ?? '',
          attributes: { maxlength: 50 },
        },
        {
          name: 'email',
          type: 'email',
          placeholder: t('email'),
          value: customer?.email ?? '',
          attributes: { maxlength: 255 },
        },
        { name: 'notes', type: 'textarea', placeholder: t('notes'), value: customer?.notes ?? '' },
      ],
      buttons: [
        { text: this.transloco.translate('common.cancel'), role: 'cancel' },
        {
          text: this.transloco.translate('common.save'),
          //Answering false keeps the alert open so what was typed is not lost
          handler: (values: Record<string, string>) => {
            const name = String(values?.['name'] || '').trim();
            if (!name) {
              this.modalInfoService.warning(t('nameRequired'), '');
              return false;
            }
            this.save(customer, { ...toChanges(values, !!customer), name });
            return true;
          },
        },
      ],
    });
    await alert.present();
  }

  async remove(customer: Customer) {
    const alert = await this.alertController.create({
      header: this.transloco.translate('customers.remove'),
      message: this.transloco.translate('customers.removeMessage', { name: customer.name }),
      buttons: [
        { text: this.transloco.translate('common.cancel'), role: 'cancel' },
        {
          text: this.transloco.translate('customers.removeConfirm'),
          role: 'destructive',
          handler: () => {
            this.customersService.remove(customer.id).subscribe(() => {
              this.customers = this.customers.filter(row => row.id !== customer.id);
              this.total--;
            });
          },
        },
      ],
    });
    await alert.present();
  }

  private save(customer: Customer | undefined, changes: CustomerChanges & { name: string }) {
    const request = customer
      ? this.customersService.update(customer.id, changes)
      : this.customersService.create(changes);
    request.subscribe(({ customer: saved }) => {
      //A customer added while picking is the one wanted
      if (!customer && this.mode === 'pick') {
        this.modalCtrl.dismiss(saved, 'picked');
        return;
      }
      this.customers = customer
        ? this.customers.map(row => (row.id === saved.id ? saved : row))
        : [...this.customers, saved];
      if (!customer) this.total++;
    });
  }
}

/**
 * The API reads an empty email as an invalid one, so a blank field is never sent as text. Creating
 * leaves it out; editing sends null, because leaving it out would keep what was there.
 */
function toChanges(values: Record<string, string>, isEdit: boolean): CustomerChanges {
  const optional = (key: string) => {
    const value = String(values?.[key] ?? '').trim();
    return value || (isEdit ? null : undefined);
  };
  return { phone: optional('phone'), email: optional('email'), notes: optional('notes') };
}
