import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { MessageService } from 'src/app/services/message.service';
import { SessionService } from 'src/app/services/session.service';
import { UserInformations } from 'src/app/types';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {
  loadingComplete: boolean = false;
  loggedIn!: boolean;
  userInfos!: UserInformations;

  constructor(private sessionService: SessionService,
              private databaseService: DatabaseService,
              private messageService: MessageService,
              private router: Router) {}

  adminOnServers(): number {
    return this.userInfos.servers.filter(s => s.rank === "admin").length;
  }

  serversRedirect(): void {
    this.router.navigateByUrl(`/servers`);
  }

  deleteAccount(): void {
    if (confirm("Are you sure you want to delete your account?")) {
      this.sessionService.logout();
      this.databaseService.deleteAccount(this.userInfos.accountId);
      this.router.navigateByUrl('');
      window.location.reload();
    }
  }

  changePassword(): void {
    const password = window.prompt("New password:");
    const regex = /^[\w\d.,?!@#$%^&*()\-+=<>:;"'{}[\]|\\\/]{1,20}$/;

    if (!password) {
      this.messageService.setErrorMessage("Can't set an empty password !");
      return;
    }

    if (regex.test(password)) {
      this.databaseService.changeAccountPassword(this.userInfos.accountId, password);
      this.messageService.setSuccessMessage("Successfully changed your password !");
    } else {
      this.messageService.setErrorMessage("Password must be 1 to 20 characters long and can only contain letters, digits and the following special characters: .,?!@#$%^&*()-+=<>:;\"'{}[]|\\/");
    }
  }

  ngOnInit(): void {
    this.sessionService.getAccountInfoIfAvailable().subscribe(
      (result) => {
        this.loggedIn = result.available;
        if (result.available) {
          if (result.userInfos) this.userInfos = result.userInfos;
          this.loadingComplete = true;
        }
      }
    )
  }
}
