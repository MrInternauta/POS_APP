import { Injectable } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';

@Injectable({
  providedIn: 'root'
})
export class ModalInfoService {

  constructor(private modal: NzModalService) {}

  info(title?: string, content?: string, calllback?: ()=> void): void {
    this.modal.info({
      nzTitle: `<h2 class="text-dark dark:text-white/[.87]">${title}</h2>`,
      nzContent: `<p class="text-theme-gray dark:text-white/60">${content}</p>`,
      nzOnOk: () => calllback && calllback()
    });
  }

  success(title?: string, content?: string, calllback?: ()=> void): void {
    this.modal.success({
      nzTitle: `<h2 class="text-dark dark:text-white/[.87]">${title}</h2>`,
      nzContent: `<p class="text-theme-gray dark:text-white/60">${content}</p>`,
      nzOnOk: () => calllback && calllback()
    });
  }

  error(title?: string, content?: string, calllback?: ()=> void): void {
    this.modal.error({
      nzTitle: `<h2 class="text-dark dark:text-white/[.87]">${title}</h2>`,
      nzContent: `<p class="text-theme-gray dark:text-white/60">${content}</p>`,
      nzOnOk: () => calllback && calllback()
    });
  }

  warning(title?: string, content?: string, calllback?: ()=> void): void {
    this.modal.warning({
      nzTitle: `<h2 class="text-dark dark:text-white/[.87]">${title}</h2>`,
      nzContent: `<p class="text-theme-gray dark:text-white/60">${content}</p>`,
      nzOnOk: () => calllback && calllback()
    });
  }
}
