import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Home } from 'src/app/models/home.model';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-player-home-list',
  templateUrl: './player-home-list.component.html',
  styleUrls: ['./player-home-list.component.scss']
})
export class PlayerHomeListComponent {
  homeList: Home[] = [];

  constructor(private databaseService: DatabaseService,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.params['userId'];
    this.databaseService.getAllPlayerHomes(userId).subscribe((homes) => {
      this.homeList = homes;
    });
  }
}
