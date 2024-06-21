/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ISelectItem } from '../../models/iselect.item';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent implements OnInit {
  @Input() id!: string;
  @Input() label!: string;

  @Input() required!: boolean;
  @Input() disabled!: boolean;
  @Input() dataSource!: Array<ISelectItem>;
  @Input() placeholder: string = '';
  @Input() size: 'regular' | 'small' = 'regular';
  @Input() hasError!: string;
  @Input() centerText!: boolean;
  @Input() legend!: string;
  @Input() icon: string = '';
  @Output() inputValueChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() inputValueEnter: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {}

  get defaultValue() {
    return this.dataSource?.find((item) => item.selected)?.value || '';
  }

  handleChange(event: any) {
    this.inputValueChange.emit(event.detail.value);
  }

  handleCancel() {
    console.log('ionCancel fired');
  }

  handleDismiss() {
    console.log('ionDismiss fired');
  }

  compareFn(e1: ISelectItem, e2: ISelectItem): boolean {
    return e1 && e2 ? e1.value == e2.value : e1 == e2;
  }
}
