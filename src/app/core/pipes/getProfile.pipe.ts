import { DomSanitizer } from '@angular/platform-browser';
import { PipeTransform, Pipe } from '@angular/core';
import { environment } from '../../../environments/environment';

@Pipe({ name: 'getProfile' })
export class GetProfile implements PipeTransform {
  constructor() {}
  transform(value: string, type = 'usuarios') {
    if (!value || !type) {
      if (type && type !== 'usuarios') {
        return 'assets/images/product.png';
      }
      return 'assets/images/placeholder.jpg';
    }
    return `${environment.url}files/${type}/${value}`;
  }
}
