import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { SessionService } from '../services/session.service';
import { Observable, map, of, switchMap } from 'rxjs';
import { DatabaseService } from '../services/database.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private sessionService: SessionService,
              private databaseService: DatabaseService,
              private activatedRoute: ActivatedRoute) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.sessionService.getUserId().pipe(
      switchMap((id) => {
        return this.databaseService.getAccountInfoById(id).pipe(
          map((infos) => {
            const server = infos.servers.find(s => s.serverID === route.params['serverId']);
            if (!server) return of(false);
            return of(server.rank === "admin");
          }),
          switchMap((result) => {
            return result;
          })
        );
      })
    );
  }
}
