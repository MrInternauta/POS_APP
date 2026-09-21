import { Injectable, Injector } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(private injector: Injector) {}

  setLocal(key: string, obj: any) {
    try {
      localStorage.setItem(key, JSON.stringify(obj));
    } catch (error) {
      //A full or unavailable storage must not break whatever asked to save
      console.log('storage error', error);
    }
  }

  getLocal(key: string) {
    try {
      const obj = localStorage.getItem(key);
      return obj ? JSON.parse(obj) : null;
    } catch (error) {
      console.log('storage error', error);
      return null;
    }
  }

  localDeleteAll() {
    localStorage.clear();
  }

  localDeleteByKey(key: string) {
    localStorage.removeItem(key);
  }
}
