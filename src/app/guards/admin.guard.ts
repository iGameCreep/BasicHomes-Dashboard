import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { SessionService } from '../services/session.service';
import { Observable, map, of, switchMap } from 'rxjs';
import { APIService } from '../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private sessionService: SessionService,
              private apiService: APIService) {}

  canActivate(): Observable<boolean> {
    return this.sessionService.getUserId().pipe(
      switchMap((id) => {
        return this.apiService.getAccountInfoById(id).pipe(
          map((infos) => {
            return of(infos.rank === "admin");
          }),
          switchMap((result) => {
            return result;
          })
        );
      })
    );
  }
}
