import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor() { }

  getStorageKey(key: string): string | null {
    const value = localStorage.getItem(key);
    return value;
  }

  setStorageKey(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  clearStorageKey(key: string): void {
    localStorage.removeItem(key);
  }
}
