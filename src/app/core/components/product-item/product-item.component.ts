/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProductItemComponent implements OnInit {
  @Input() name!: string;
  @Input() stock = 0;
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

  get subtotal() {
    if (this.price && this.quantity) {
      return Number(this.price) * Number(this.quantity);
    }
    return 0;
  }
}
