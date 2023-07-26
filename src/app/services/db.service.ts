import { Injectable } from '@angular/core';
import { AES, enc } from 'crypto-js';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  private readonly DB_STORAGE_KEY = 'db';
  private readonly KEY: string = 'BasicHomes';

  constructor(private storageService: StorageService) { }

  load(key: string): void {
    if (key !== 'undefined') this.setDb(key);
    else {
      if (this.isRegistered()) {
        if (this.getDb() !== 'default') return;
        else this.setDb('default');
      }
      else this.setDb('default');
    }
  }

  setDb(value: string): void {
    this.storageService.setStorageKey(this.DB_STORAGE_KEY, value);
  }

  getDb(): string {
    const key = this.storageService.getStorageKey(this.DB_STORAGE_KEY);
    if (!key) throw new Error("No DB registered");
    return key;
  }

  isRegistered(): boolean {
    return !!this.storageService.getStorageKey(this.DB_STORAGE_KEY);
  }

  logout(): void {
    this.storageService.clearStorageKey(this.DB_STORAGE_KEY);
  }

  encryptObject(object: any): string {
    const jsonString = JSON.stringify(object);
    const encrypted = AES.encrypt(jsonString, this.KEY).toString();
    return encrypted;
  }

  decryptObject(encryptedData: string): any {
    const decryptedHex = AES.decrypt(encryptedData, this.KEY).toString();
    const decrypted = enc.Hex.parse(decryptedHex).toString(enc.Utf8);
  
    try {
      const object = JSON.parse(decrypted);
      return object;
    } catch (error) {
      throw new Error(`Failed to parse decrypted data: ${error}`);
    }
  }
}
