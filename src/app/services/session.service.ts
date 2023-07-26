import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { Observable, map, of, switchMap } from 'rxjs';
import { AccountInfoAvailable, LoginResponse, SessionDestroy, UserInformations } from '../types';
import { MojangService } from './mojang.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private readonly SESSION_STORAGE_KEY = 'session';

  constructor(private apiService: APIService,
              private storageService: StorageService,
              private mojangService: MojangService) {}

  getUserId(): Observable<number> {
    return this.apiService.getSessionInfoFromSession(this.storageService.getStorageKey(this.SESSION_STORAGE_KEY)).pipe(
      map((result) => result.accountID)
    );
  }

  isLoggedIn(): boolean {
    return !!this.storageService.getStorageKey(this.SESSION_STORAGE_KEY);
  }

  isSessionAvailable(): Observable<boolean> {
    if (this.isLoggedIn()) return of(false);
    return this.apiService.getSessionInfoFromSession(this.storageService.getStorageKey(this.SESSION_STORAGE_KEY)).pipe(
      map((result) => result.available)
    )
  }

  login(loginResponse: LoginResponse): void {
    if (loginResponse && loginResponse.success) {
      this.storageService.setStorageKey(this.SESSION_STORAGE_KEY, loginResponse.sessionID);
    }
  }

  logout(): Observable<SessionDestroy> {
    const sessionId = this.storageService.getStorageKey(this.SESSION_STORAGE_KEY);
    this.storageService.clearStorageKey(this.SESSION_STORAGE_KEY);
    return this.apiService.destroySession(sessionId);
  }

  getAccountInfoIfAvailable(): Observable<AccountInfoAvailable> {
    return this.isSessionAvailable().pipe(
      switchMap((available) => {
        if (!available && this.isLoggedIn()) {
          this.logout();
          available = false;
        }
  
        if (available) {
          return this.getUserId().pipe(
            switchMap((accId) => {
              return this.apiService.getAccountInfoById(accId).pipe(
                switchMap((infos) => {
                  return this.mojangService.getUsernameByUUID(infos.userID).pipe(
                    map((username) => {
                      const userInfos: UserInformations = {
                        accountID: accId,
                        userID: infos.userID,
                        username: username,
                        rank: infos.rank
                      };
                      return { available, userInfos };
                    })
                  );
                })
              );
            })
          );
        } else {
          return of({ available });
        }
      })
    );
  }  
  
}
