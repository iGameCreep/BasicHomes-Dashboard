import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Home } from 'src/app/models/home.model';
import { APIService } from 'src/app/services/api.service';

@Component({
  selector: 'app-player-home-list',
  templateUrl: './player-home-list.component.html',
  styleUrls: ['./player-home-list.component.scss']
})
export class PlayerHomeListComponent {
  homeList: Home[] = [];

  constructor(private apiService: APIService,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.params['userId'];
    this.apiService.getAllPlayerHomes(userId).subscribe((homes) => {
      this.homeList = homes;
    });
  }
}
