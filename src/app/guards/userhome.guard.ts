import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { SessionService } from '../services/session.service';
import { Observable, map, of, switchMap } from 'rxjs';
import { DatabaseService } from '../services/database.service';

@Injectable({
  providedIn: 'root'
})
export class UserHomeGuard implements CanActivate {
    constructor(private sessionService: SessionService,
                private databaseService: DatabaseService) {}

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
        const homeId = route.params['homeId'];
        return this.sessionService.getUserId().pipe(
            switchMap((id) => {
                return this.databaseService.getAccountInfoById(id).pipe(
                    switchMap((infos) => {
                        if (infos.rank === "admin") {
                            return of(true);
                        } else {
                            return this.databaseService.getServerHomeById(homeId).pipe(
                                map((homeData) => {
                                    return homeData.uuid === infos.userID;
                                })
                            );
                        }
                    })
                );
            })
        );
    }

}