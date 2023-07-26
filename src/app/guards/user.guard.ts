import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { SessionService } from '../services/session.service';
import { Observable, map, of, switchMap } from 'rxjs';
import { APIService } from '../services/api.service';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {

  constructor(private sessionService: SessionService,
              private apiService: APIService) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.sessionService.getUserId().pipe(
      switchMap((id) => {
        return this.apiService.getAccountInfoById(id).pipe(
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
