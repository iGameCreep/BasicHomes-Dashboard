import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DbService } from 'src/app/services/db.service';
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
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private dbService: DbService) {}

  adminOnServers(): number {
    return this.userInfos.servers.filter(s => s.rank === "admin").length;
  }

  serversRedirect(): void {
    this.router.navigateByUrl(`/servers`);
  }
  
  ngOnInit(): void {
    const db = decodeURIComponent(this.activatedRoute.snapshot.queryParams['db']);
    if (db) this.dbService.add(db);

    this.sessionService.getAccountInfoIfAvailable().subscribe((result) => { 
      this.loggedIn = result.available; 
      if (result.available) { 
        if (result.userInfos) this.userInfos = result.userInfos; this.loadingComplete = true; 
      }
    })
  }
}
