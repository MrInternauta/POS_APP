import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';

import { CategoryItemResponse } from '../../../pages/products/models/index';

@Component({
  selector: 'app-filter-popover',
  templateUrl: './filter-popover.component.html',
  styleUrls: ['./filter-popover.component.scss'],
})
export class FilterPopoverComponent implements OnInit, OnDestroy {
  @Input() categories!: Array<CategoryItemResponse>;
  @Input() selectedFilteritem!: string;
  @Output() clickedCategory = new EventEmitter<string>();
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
}
