/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent implements OnInit {
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
  public userForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.createForm();
  }

  ngOnInit() {
    if (this.type == 'phone' && this.inputValue) {
      this.userForm.get('phone')?.setValue(this.inputValue);
    }
  }

  handleChange(event: any) {
    this.inputValueChange.emit(event);
  }

  handleChangeEnter() {
    this.inputValueEnter.emit(this.inputValue);
  }

  createForm() {
    this.userForm = this.fb.group({
      phone: [
        { value: this.inputValue, disabled: this.disabled },
        // [Validators.pattern(/^\(\d{3}\)\s\d{3}-\d{4}$/), Validators.required],
      ],
    });
  }
}
