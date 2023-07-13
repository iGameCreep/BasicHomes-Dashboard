import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  constructor(private router: Router,
              private sessionService: SessionService,
              private messageService: MessageService) { }

  userId!: string;

  ngOnInit(): void {
    this.sessionService.getAccountInfoIfAvailable().subscribe((data) => {
      if (data.available && data.userInfos) this.userId = data.userInfos?.userID;
    });
  }

  isActive(url: string): boolean {
    return this.getCurrentURL() === url;
  }

  isAppActive(url: string): boolean {
    return this.getCurrentURL().startsWith(url);
  }

  isLoggedIn(): boolean {
    return this.sessionService.isLoggedIn();
  }

  logout(): void {
    this.sessionService.logout().subscribe((response) => {
      if (!response.success) {
        this.messageService.setErrorMessage("An error occured when trying to logout.");
        return;
      }
      this.messageService.setSuccessMessage("Successfully logged out !");
    })
    this.router.navigateByUrl('');
    window.location.reload();
  }

  getCurrentURL(): string {
    return this.router.url;
  }
}
