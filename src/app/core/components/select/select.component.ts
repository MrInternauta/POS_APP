/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { select } from '@ngrx/store';

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
  @Input() dataSource!: Array<{
    name: string;
    value: string;
    selected?: boolean;
  }>;
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

  handleChange(event: any) {
    console.log('ionChange fired with value: ' + event.detail.value);
    this.inputValueChange.emit(event);
  }

  handleCancel() {
    console.log('ionCancel fired');
  }

  handleDismiss() {
    console.log('ionDismiss fired');
  }
}
