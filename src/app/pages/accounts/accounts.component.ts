import { Component, OnInit } from '@angular/core';
import { DatabaseService } from 'src/app/services/database.service';
import { MessageService } from 'src/app/services/message.service';
import { MojangService } from 'src/app/services/mojang.service';
import { UserInformations } from 'src/app/types';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent implements OnInit {
  loadingComplete: boolean = false;
  accounts!: UserInformations[];

  constructor(private databaseService: DatabaseService,
              private mojangService: MojangService,
              private messageService: MessageService) {}

  ngOnInit(): void {
    this.loadInfos();
    this.loadingComplete = true;
  }

  loadInfos(): void {
    this.databaseService.getAllAccounts().subscribe((data) => {
      data.forEach((acc) => {
        this.mojangService.getUsernameByUUID(acc.userID).subscribe((username) => acc.username = username)
      });
      this.accounts = data
    });
  }

  changeRank(accountID: number): void {
    const acc = this.accounts.find(a => a.accountID === accountID);
    if (confirm(`Are you sure you want to set ${acc?.username}'s rank to ${acc?.rank === 'admin' ? 'user' : 'admin'} ?`)) {
      this.databaseService.changeAccountRank(accountID);
      this.messageService.setSuccessMessage(`Successfully set ${acc?.username}'s rank to ${acc?.rank === 'admin' ? 'user' : 'admin'} ! Refreshing data...`);
      setTimeout(() => this.loadInfos(), 1500);
    }
  }

  showConfirmation(accountID: number): void {
    const acc = this.accounts.find(a => a.accountID === accountID);
    if (confirm(`Are you sure you want to delete ${acc?.username}'s account ?`)) {
      this.databaseService.deleteAccount(accountID);
      this.messageService.setSuccessMessage(`Successfully deleted ${acc?.username}'s account ! Refreshing data...`);
      setTimeout(() => this.loadInfos(), 1500);
    }
  }
}
