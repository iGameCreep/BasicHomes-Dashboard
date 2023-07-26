import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Home } from 'src/app/models/home.model';
import { APIService } from 'src/app/services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private apiService: APIService,
              private route: ActivatedRoute) {}

  home: Home = new Home();

  ngOnInit(): void {
     const homeId = this.route.snapshot.params['homeId'];
     this.apiService.getServerHomeById(homeId).subscribe(home => {
      if (home) this.home = home;
     })
  }
}
