import { Injectable } from '@angular/core';
import { APIService } from './api.service';
import { Observable, map, of, switchMap } from 'rxjs';
import { AccountInfoAvailable, LoginResponse, SessionDestroy, UserInformations } from '../types';
import { MojangService } from './mojang.service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private readonly SESSION_STORAGE_KEY = 'session';

  constructor(private apiService: APIService,
              private mojangService: MojangService) {}

  login(loginResponse: LoginResponse): void {
    if (loginResponse && loginResponse.success) {
      localStorage.setItem(this.SESSION_STORAGE_KEY, JSON.stringify({ id: loginResponse.sessionID }));
    }
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.SESSION_STORAGE_KEY);
  }

  getSessionId(): string {
    const session = localStorage.getItem(this.SESSION_STORAGE_KEY);
    if (!session) throw new Error('Session not found');
    const storedObject = JSON.parse(session);
    return storedObject.id;
  }

  getUserId(): Observable<number> {
    return this.apiService.getSessionInfoFromSession(this.getSessionId()).pipe(
      map((result) => result.accountID)
    );
  }

  isSessionAvailable(): Observable<boolean> {
    if (!this.isLoggedIn()) return of(false);
    return this.apiService.getSessionInfoFromSession(this.getSessionId()).pipe(
      map((result) => result.available)
    )
  }

  logout(): Observable<SessionDestroy> {
    const sessionId = this.getSessionId();
    localStorage.removeItem(this.SESSION_STORAGE_KEY);
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
