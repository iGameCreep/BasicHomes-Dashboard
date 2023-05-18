import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { SessionService } from '../services/session.service';
import { MessageService } from '../services/message.service';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private sessionService: SessionService, 
              private messageService: MessageService) {}

  canActivate(): Observable<boolean> {
    return this.sessionService.isSessionAvailable().pipe(
      tap((result) => {
        if (!result) {
          this.messageService.setErrorMessage("Session expired. Please login to access this resource.");
          this.sessionService.logout();
        }
      })
    );
  }

}
