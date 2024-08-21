import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  template: `<img
    class="rounded mx-auto shadow-md border-white transition duration-200 transform hover:scale-110 object-cover"
    [ngClass]="{
      'w-32 h-32': size === 'large',
      'w-20 h-20 min-h-20 min-w-20': size === 'regular',
      'w-12 h-12': size === 'small',
      'border-4': !hiddenBorder,
    }"
    [src]="img | images: type | async"
    alt="avatar" />`,
})
export class AvatarComponent {
  @Input() size: 'small' | 'large' | 'regular' = 'small';
  @Input() img = '';
  @Input() type: 'user' | 'product' = 'user';
  @Input() hiddenBorder = false;

  constructor() {
    //nothing
  }
}
