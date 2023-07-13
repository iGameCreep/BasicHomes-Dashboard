import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { SessionService } from '../services/session.service';
import { Observable, map, of, switchMap } from 'rxjs';
import { DatabaseService } from '../services/database.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private sessionService: SessionService,
              private databaseService: DatabaseService) {}

  canActivate(): Observable<boolean> {
    return this.sessionService.getUserId().pipe(
      switchMap((id) => {
        return this.databaseService.getAccountInfoById(id).pipe(
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
