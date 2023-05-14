import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Home } from 'src/app/models/home.model';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private databaseService: DatabaseService,
              private route: ActivatedRoute) {}

  home: Home = new Home();

  ngOnInit(): void {
     const serverId = this.route.snapshot.params['serverId'].replaceAll('-', '');
     const homeId = this.route.snapshot.params['homeId'];
     this.databaseService.getServerHomeById(serverId, homeId).subscribe(home => {
      if (home) this.home = home;
     })
  }
}
