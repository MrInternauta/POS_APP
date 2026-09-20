/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-product-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProductItemComponent implements OnInit {
  @Input() name!: string;
  //The API sends the stock as a number, a template can still hand it over as text
  @Input() stock: number | string = 0;
  @Input() category!: string;
  @Input() image!: string;
  @Input() description!: string;
  @Input() quantity!: string;
  @Input() price!: string;
  @Input() detailed = true;
  constructor() {
    //nothing
  }

  ngOnInit() {
    //nothing
  }

  get stockValue(): number {
    return Number(this.stock ?? 0) || 0;
  }

  get isOutOfStock(): boolean {
    return this.stockValue <= 0;
  }

  get subtotal() {
    if (this.price && this.quantity) {
      return Number(this.price) * Number(this.quantity);
    }
    return 0;
  }
}
