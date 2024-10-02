import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[phoneMask]',
})
export class PhoneMaskDirective implements OnInit, OnDestroy {
  private _phoneControl!: AbstractControl;
  private _preValue!: string;

  @Input()
  set phoneControl(control: AbstractControl) {
    this._phoneControl = control;
  }
  @Input()
  set preValue(value: string) {
    this._preValue = value;
  }

  private sub!: Subscription;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.phoneValidate();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  phoneValidate() {
    this.sub = this._phoneControl.valueChanges.subscribe(data => {
      //directive to format phone number with area code and country code +52
      let value = data;
      value = value.replace(/\D/g, '');
      if (value.length === 0) {
        this._phoneControl.setValue('');
        return;
      }
      if (value.length > 13) {
        value = value.slice(0, 13);
      }
      if (value.length > 6) {
        value = value.replace(/^(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
      } else if (value.length > 3) {
        value = value.replace(/^(\d{3})(\d{3})/, '($1) $2');
      } else {
        value = value.replace(/^(\d{3})/, '($1');
      }
      this.renderer.setProperty(this.el.nativeElement, 'value', value);
      this._phoneControl.setValue(value);
      //directive to format phone number with area code and country code +52
    });
  }
}
