import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  template: `<img
    class="rounded-full mx-auto shadow-mdborder-white transition duration-200 transform hover:scale-110"
    [ngClass]="{
      'w-32 h-32': size === 'large',
      'w-12 h-12': size !== 'large',
      'border-4': !hiddenBorder,
    }"
    [src]="img | images: type | async"
    alt="avatar" />`,
})
export class AvatarComponent {
  @Input() size: 'small' | 'large' = 'small';
  @Input() img = '';
  @Input() type: 'user' | 'product' = 'user';
  @Input() hiddenBorder = false;

  constructor() {
    //nothing
  }
}
