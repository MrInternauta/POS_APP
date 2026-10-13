import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';

import { CategoryItemResponse, ProviderItemResponse } from '../../../pages/products/models/index';

@Component({
  selector: 'app-filter-popover',
  templateUrl: './filter-popover.component.html',
  styleUrls: ['./filter-popover.component.scss'],
})
export class FilterPopoverComponent implements OnInit, OnDestroy {
  @Input() categories!: Array<CategoryItemResponse>;
  /** Only an admin gets any, without them the provider filter is not shown */
  @Input() providers: Array<ProviderItemResponse> = [];
  @Input() selectedFilteritem!: string;
  @Input() selectedProviderId = '';
  @Output() clickedCategory = new EventEmitter<string>();
  @Output() clickedProvider = new EventEmitter<string>();
  @Output() clickedItem = new EventEmitter<string>();
  @ViewChild('popover') popover: any;
  isOpen = false;

  constructor() {}

  ngOnInit() {
    return;
  }

  ngOnDestroy(): void {
    this.categories = [];
  }

  trackByCategory(_index: number, category: CategoryItemResponse) {
    return category?.id;
  }

  trackByProvider(_index: number, provider: ProviderItemResponse) {
    return provider?.id;
  }

  presentPopover(e: Event) {
    this.popover.event = e;
    this.isOpen = true;
  }

  onItemClicked(value?: string) {
    this.isOpen = false;
    this.clickedItem.emit(value);
  }

  onCategoryClicked(categoryId?: number) {
    this.isOpen = false;
    this.clickedCategory.emit(categoryId?.toString());
  }

  onProviderClicked(providerId?: number) {
    this.isOpen = false;
    this.clickedProvider.emit(providerId?.toString());
  }
}
