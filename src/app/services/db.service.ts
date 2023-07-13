import { Injectable } from '@angular/core';
import { AES, enc } from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  private readonly DB_STORAGE_KEY = 'db';
  private readonly KEY: string = 'BasicHomes';

  add(key: string): void {
    localStorage.setItem(this.DB_STORAGE_KEY, key);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.DB_STORAGE_KEY);
  }

  logout(): void {
    localStorage.removeItem(this.DB_STORAGE_KEY);
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
