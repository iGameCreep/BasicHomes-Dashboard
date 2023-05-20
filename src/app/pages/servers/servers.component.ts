import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { MessageService } from 'src/app/services/message.service';
import { MojangService } from 'src/app/services/mojang.service';
import { SessionService } from 'src/app/services/session.service';
import { UserInformations, UserServer } from 'src/app/types';

@Component({
  selector: 'app-servers',
  templateUrl: './servers.component.html',
  styleUrls: ['./servers.component.scss']
})
export class ServersComponent {
  loadingComplete: boolean = false;
  loggedIn!: boolean;
  userInfos!: UserInformations;

  constructor(private databaseService: DatabaseService,
              private sessionService: SessionService,
              private mojangService: MojangService,
              private messageService: MessageService,
              private router: Router) {}

  isAdmin(serverId: string): boolean {
    const server = this.userInfos.servers.find(s => s.serverID === serverId);
    return server ? server.rank === "admin" : false;
  }

  serverHomesRedirect(serverId: string): void {
    this.router.navigateByUrl(`/homes/${serverId}`);
  }

  userHomesRedirect(serverId: string): void {
    this.router.navigateByUrl(`/homes/${serverId}/${this.userInfos.userID}`);
  }

  userHomesByUUID(serverId: string): void {
    const userId = window.prompt("User UUID:");
    if (userId === null) return;
    this.router.navigateByUrl(`/homes/${serverId}/${userId}`);
  }

  userHomesByUsername(serverId: string): void {
    const username = window.prompt("Username:");
    if (username === null) return;
    this.mojangService.getUUIDByUsername(username).subscribe(
      (uuid) => {
        this.router.navigateByUrl(`/homes/${serverId}/${uuid}`);
      }
    )
  }

  renameServer(server: UserServer): void {
    const name = window.prompt(`New name for server ${server.serverName}: (1 to 20 characters, special characters other than - and _ not authorized !)`);
    if (name === null) return;
    const regex = /^[a-zA-Z0-9-_]{1,20}$/;
    if (regex.test(name)) {
      this.databaseService.setServerName(server.serverID, name, this.userInfos.accountID);
      this.messageService.setSuccessMessage(`Successfully renamed server ${server.serverName} into ${name} !`, 2000);
      setTimeout(() => {
        window.location.reload();
      }, 2000)
    } else {
      this.messageService.setErrorMessage("Please use a correct server name ! 1 to 20 characters, special characters other than - and _ not authorized !");
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
