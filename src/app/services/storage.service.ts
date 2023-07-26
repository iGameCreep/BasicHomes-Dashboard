import { Injectable } from '@angular/core';
import { LoginResponse } from '../types';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor() { }

  getStorageKey(key: string): string {
    const value = localStorage.getItem(key);
    if (!value) throw new Error('Key not found');
    return value;
  }

  setStorageKey(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  clearStorageKey(key: string): void {
    localStorage.removeItem(key);
  }
}
