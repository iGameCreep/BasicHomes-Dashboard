import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
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
  homeCount!: number;

  constructor(private sessionService: SessionService,
              private activatedRoute: ActivatedRoute,
              private databaseService: DatabaseService,
              private dbService: DbService) {}
  
  ngOnInit(): void {
    const db = decodeURIComponent(this.activatedRoute.snapshot.queryParams['db']);
    if (db && db !== 'undefined') this.dbService.add(db);

    this.sessionService.getAccountInfoIfAvailable().subscribe((result) => { 
      this.loggedIn = result.available; 
      if (result.available) { 
        if (result.userInfos) {
          this.userInfos = result.userInfos; this.loadingComplete = true;
          this.databaseService.getAllPlayerHomes(result.userInfos.userID).subscribe((homes) => this.homeCount = homes.length)
        }        
      }
    })
  }
}
