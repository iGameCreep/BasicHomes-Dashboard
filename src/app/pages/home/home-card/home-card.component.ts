import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Home } from 'src/app/models/home.model';
import { DatabaseService } from 'src/app/services/database.service';
import { MessageService } from 'src/app/services/message.service';
import { MojangService } from 'src/app/services/mojang.service';

@Component({
  selector: 'app-home-card',
  templateUrl: './home-card.component.html',
  styleUrls: ['./home-card.component.scss']
})
export class HomeCardComponent implements OnInit {
  @Input() home!: Home;

  constructor(private mojangService: MojangService,
              private databaseService: DatabaseService,
              private messageService: MessageService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {}

  username!: string;

  isInList(): boolean {
    return this.getCurrentURL().startsWith("/homes");
  }

  showConfirmation(homeId: number): void {
    if (confirm("Are you sure you want to proceed?")) {
      this.databaseService.deleteHomeById(homeId);
      this.messageService.setSuccessMessage('Successfully deleted home !', 2000);
      setTimeout(() => {
        this.router.navigateByUrl(`/homes`);
      }, 2000);
    }
  }

  ngOnInit(): void {
    this.mojangService.getUsernameByUUID(this.home.uuid).subscribe(username => this.username = username);
  }

  getCurrentURL(): string {
    return this.router.url;
  }
}
