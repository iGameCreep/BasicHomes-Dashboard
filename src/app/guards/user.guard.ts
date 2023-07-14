import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { SessionService } from '../services/session.service';
import { Observable, map, of, switchMap } from 'rxjs';
import { DatabaseService } from '../services/database.service';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {

  constructor(private sessionService: SessionService,
              private databaseService: DatabaseService) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.sessionService.getUserId().pipe(
      switchMap((id) => {
        return this.databaseService.getAccountInfoById(id).pipe(
          map((infos) => {
            if (infos.rank === "admin") {
              return true;
            } else {
              const userId = route.params['userId'];
              return infos.userID === userId;
            }
          })
        );
      })
    );
}


}
