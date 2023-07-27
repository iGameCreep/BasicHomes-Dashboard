import { Component, OnInit } from '@angular/core';
import { Home } from 'src/app/models/home.model';
import { APIService } from 'src/app/services/api.service';

@Component({
  selector: 'app-server-home-list',
  templateUrl: './server-home-list.component.html',
  styleUrls: ['./server-home-list.component.scss']
})
export class ServerHomeListComponent implements OnInit {
  homeList: Home[] = [];

  constructor(private apiService: APIService) {}

  ngOnInit(): void {
    this.apiService.getAllHomes().subscribe((homes) => {
      this.homeList = homes;
    });
  }
}
