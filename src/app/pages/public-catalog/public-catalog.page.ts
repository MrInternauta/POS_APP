import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, Subscription, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { API_PREFIX } from 'src/app/core/constants';

import { environment } from '../../../environments/environment';
import { PublicCatalog } from '../store/store.model';
import { StoreService } from '../store/store.service';

/**
 * What a store shows to anyone with its link, no login: its name and contact, and the products it
 * marked public, with their price and whether there is stock.
 */
@Component({
  selector: 'app-public-catalog',
  templateUrl: 'public-catalog.page.html',
  styleUrls: ['public-catalog.page.scss'],
})
export class PublicCatalogPage implements OnInit, OnDestroy {
  catalog: PublicCatalog | null = null;
  notFound = false;
  loading = true;
  search = '';
  private slug = '';
  private search$ = new Subject<string>();
  private subscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private storeService: StoreService
  ) {}

  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug') ?? '';
    this.subscription = this.search$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(term => {
          this.loading = true;
          return this.storeService.catalog(this.slug, term);
        })
      )
      .subscribe({
        next: catalog => {
          this.loading = false;
          this.catalog = catalog;
        },
        error: () => {
          this.loading = false;
          this.notFound = true;
        },
      });
    this.search$.next('');
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  onSearch(term: string) {
    this.search = term ?? '';
    this.search$.next(this.search);
  }

  trackById(_index: number, product: { id: number }) {
    return product.id;
  }

  /** Product pictures are served to anyone by file name */
  imageOf(image: string) {
    return image ? `${environment.url}${API_PREFIX}image/product/${image}` : 'assets/images/no-image.jpg';
  }
}
