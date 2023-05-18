import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from 'src/app/services/database.service';
import { MessageService } from 'src/app/services/message.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  accountId!: number;
  password!: string;
  
  constructor(private databaseService: DatabaseService,
              private sessionService: SessionService,
              private messageService: MessageService,
              private router: Router) {}
  
  ngOnInit(): void {
    if (this.sessionService.isLoggedIn()) {
      this.messageService.setErrorMessage("You are already logged in !");
      this.router.navigateByUrl('');
      return;
    }
  }

  login() {
    this.databaseService.login(this.accountId, this.password)
    .subscribe({
      next: (result) => {
        if (!result.success) {
          this.messageService.setErrorMessage("Invalid creditentials");
          return;
        };
        
        this.sessionService.login(result);
        this.messageService.setSuccessMessage("Successfully connected !");
        this.router.navigateByUrl('');
      },
      error: (error) => {
        this.messageService.setErrorMessage(error);
      }
    });
  }
}
