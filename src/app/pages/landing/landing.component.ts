import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session.service';
import { UserInformations } from 'src/app/types';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  loadingComplete: boolean = false;
  loggedIn!: boolean;
  userInfos!: UserInformations;

  constructor(private sessionService: SessionService,
              private router: Router) {}

  adminOnServers(): number {
    return this.userInfos.servers.filter(s => s.rank === "admin").length;
  }

  serversRedirect(): void {
    this.router.navigateByUrl(`/servers`);
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
