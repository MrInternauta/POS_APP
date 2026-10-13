import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { TranslocoService } from '@jsverse/transloco';
import { Observable, Subscription } from 'rxjs';

import { ModalInfoService } from '../../../core/services/modal.service';
import { CreateProviderDto, ProviderItemResponse } from '../models';
import { WorkoutService } from '../services/workout.service';

export type CatalogKind = 'categories' | 'providers';

/** A row of either list, a category only fills the name */
type CatalogItem = Partial<ProviderItemResponse> & { id: number; name: string };

/** The API refuses shorter names */
const MIN_NAME_LENGTH: Record<CatalogKind, number> = { categories: 3, providers: 2 };

/**
 * Lists the categories or the providers and lets an admin add, edit and remove them. Both live in
 * one modal because they only differ in the fields a provider carries for its contact.
 */
@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss'],
})
export class CatalogComponent implements OnInit, OnDestroy {
  @Input() kind: CatalogKind = 'categories';
  items: CatalogItem[] = [];
  searchTerm = '';
  loading = false;
  /** Tells the page the list changed, so it reads it again for its filter and form */
  private changed = false;
  private subscription$?: Subscription;

  constructor(
    private productService: WorkoutService,
    private modalCtrl: ModalController,
    private alertController: AlertController,
    private modalInfoService: ModalInfoService,
    private transloco: TranslocoService
  ) {}

  get isProviders() {
    return this.kind === 'providers';
  }

  get visibleItems() {
    const term = this.searchTerm.trim().toLocaleLowerCase();
    if (!term) {
      return this.items;
    }
    return this.items.filter(item =>
      [item.name, item.contactName, item.phone, item.email].some(value =>
        String(value || '')
          .toLocaleLowerCase()
          .includes(term)
      )
    );
  }

  ngOnInit(): void {
    this.load();
  }

  ngOnDestroy(): void {
    this.subscription$?.unsubscribe();
  }

  trackByItem(_index: number, item: CatalogItem) {
    return item.id;
  }

  load() {
    this.loading = true;
    this.subscription$?.unsubscribe();
    const request: Observable<{ categories?: CatalogItem[]; providers?: CatalogItem[] } | null> = this.isProviders
      ? this.productService.getProviders()
      : this.productService.getCategories();

    this.subscription$ = request.subscribe({
      next: response => {
        this.loading = false;
        const items = (this.isProviders ? response?.providers : response?.categories) || [];
        this.items = [...items].sort((a, b) => a.name.localeCompare(b.name));
      },
      //The interceptor already shows what the API answered
      error: () => (this.loading = false),
    });
  }

  close() {
    return this.modalCtrl.dismiss(null, this.changed ? 'changed' : 'cancel');
  }

  async edit(item?: CatalogItem) {
    const t = (key: string) => this.transloco.translate(`catalog.${key}`);
    const inputs = [
      { name: 'name', type: 'text', placeholder: t('name'), value: item?.name ?? '', attributes: { maxlength: 255 } },
      ...(this.isProviders
        ? [
            {
              name: 'contactName',
              type: 'text',
              placeholder: t('contactName'),
              value: item?.contactName ?? '',
              attributes: { maxlength: 255 },
            },
            {
              name: 'phone',
              type: 'tel',
              placeholder: t('phone'),
              value: item?.phone ?? '',
              attributes: { maxlength: 50 },
            },
            {
              name: 'email',
              type: 'email',
              placeholder: t('email'),
              value: item?.email ?? '',
              attributes: { maxlength: 255 },
            },
          ]
        : []),
    ];

    const alert = await this.alertController.create({
      header: t(`${item ? 'edit' : 'add'}.${this.kind}`),
      inputs: inputs as any,
      buttons: [
        { text: this.transloco.translate('common.cancel'), role: 'cancel' },
        {
          text: this.transloco.translate('common.save'),
          //Answering false keeps the alert open so what was typed is not lost
          handler: (values: Record<string, string>) => {
            const name = String(values?.['name'] || '').trim();
            if (name.length < MIN_NAME_LENGTH[this.kind]) {
              this.modalInfoService.warning(
                this.transloco.translate('catalog.nameTooShort', { min: MIN_NAME_LENGTH[this.kind] }),
                ''
              );
              return false;
            }
            this.save(item, { ...values, name });
            return true;
          },
        },
      ],
    });
    await alert.present();
  }

  async remove(item: CatalogItem) {
    const alert = await this.alertController.create({
      header: this.transloco.translate(`catalog.remove.${this.kind}`),
      message: this.transloco.translate('catalog.removeMessage', { name: item.name }),
      buttons: [
        { text: this.transloco.translate('common.cancel'), role: 'cancel' },
        {
          text: this.transloco.translate('catalog.removeConfirm'),
          role: 'destructive',
          handler: () => {
            const request = this.isProviders
              ? this.productService.deleteProvider(item.id)
              : this.productService.deleteCategory(item.id);
            request.subscribe(() => {
              this.changed = true;
              this.items = this.items.filter(row => row.id !== item.id);
            });
          },
        },
      ],
    });
    await alert.present();
  }

  private save(item: CatalogItem | undefined, values: Record<string, string>) {
    let request: Observable<unknown>;

    if (this.isProviders) {
      const provider = toProvider(values, !!item);
      request = item ? this.productService.putProvider(item.id, provider) : this.productService.postProvider(provider);
    } else {
      request = item
        ? this.productService.putCategory(item.id, { name: values['name'] })
        : this.productService.postCategory({ name: values['name'] });
    }

    request.subscribe(() => {
      this.changed = true;
      this.load();
    });
  }
}

/**
 * The API reads an empty email as an invalid one, so a blank field is never sent as text. Creating
 * leaves it out; editing sends null, because leaving it out would keep what was there.
 */
function toProvider(values: Record<string, string>, isEdit: boolean): CreateProviderDto {
  const optional = (key: string) => {
    const value = String(values[key] ?? '').trim();
    return value || (isEdit ? null : undefined);
  };

  return {
    name: values['name'],
    contactName: optional('contactName'),
    phone: optional('phone'),
    email: optional('email'),
  };
}
