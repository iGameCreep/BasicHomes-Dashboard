import { Component, Input, OnInit } from '@angular/core';
import { Home } from 'src/app/models/home.model';
import { MojangService } from 'src/app/services/mojang.service';

@Component({
  selector: 'app-home-card',
  templateUrl: './home-card.component.html',
  styleUrls: ['./home-card.component.scss']
})
export class HomeCardComponent implements OnInit {
  @Input() home!: Home;

  constructor(private mojangService: MojangService) {}

  username: string = "";

  ngOnInit(): void {
    this.mojangService.getUsernameByUUID(this.home.uuid).subscribe(username => this.username = username)
  }
}
