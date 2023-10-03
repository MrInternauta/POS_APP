/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent implements OnInit {
  //TODO: MASK PHONE NUMBER AND WEIGHT, HEIGHT
  @Input() id!: string;
  @Input() label!: string;
  @Input() type!: string;
  @Input() required!: boolean;
  @Input() disabled!: boolean;
  @Input() maxLength: number = 256;
  @Input() inputValue!: string;
  @Input() placeholder: string = '';
  @Input() size: 'regular' | 'small' = 'regular';
  @Input() hasError!: string;
  @Input() searchMode!: boolean;
  @Input() centerText!: boolean;
  @Input() legend!: string;
  @Input() icon: string = '';
  @Output() inputValueChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() inputValueEnter: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {}

  handleChange(event: any) {
    this.inputValueChange.emit(event);
  }

  handleChangeEnter(event: any) {
    this.inputValueEnter.emit(this.inputValue);
  }
}
