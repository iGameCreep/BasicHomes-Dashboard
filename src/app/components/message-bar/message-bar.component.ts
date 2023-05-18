import { Component } from '@angular/core';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-message-bar',
  templateUrl: './message-bar.component.html',
  styleUrls: ['./message-bar.component.scss']
})
export class MessageBarComponent {
  errorMessage!: string;
  successMessage!: string;

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
    this.messageService.errorMessage$.subscribe(errorMessage => {
      this.errorMessage = errorMessage;
      setTimeout(() => this.errorMessage = '', 5000);
    });

    this.messageService.successMessage$.subscribe(successMessage => {
      this.successMessage = successMessage;
      setTimeout(() => this.successMessage = '', 5000);
    });
  }
}
