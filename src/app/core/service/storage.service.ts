import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  setToStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value));
  }

  getFromStorage(key: string) {
    // body...
    return JSON.parse(localStorage.getItem(key) || '{}');
  }

  clearAllStorage() {
    // body...
    localStorage.clear();
  }
}
