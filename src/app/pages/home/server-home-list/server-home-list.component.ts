import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Home } from 'src/app/models/home.model';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-server-home-list',
  templateUrl: './server-home-list.component.html',
  styleUrls: ['./server-home-list.component.scss']
})
export class ServerHomeListComponent implements OnInit {
  homeList: Home[] = [];

  constructor(private databaseService: DatabaseService,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    const serverId = this.route.snapshot.params['serverId'];
    this.databaseService.getAllServerHomes(serverId).subscribe((homes) => {
      this.homeList = homes;
    });
  }
}
