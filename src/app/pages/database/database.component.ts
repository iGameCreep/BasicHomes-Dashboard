import { Component } from '@angular/core';
import { APIService } from 'src/app/services/api.service';
import { DatabaseService } from 'src/app/services/database.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-database',
  templateUrl: './database.component.html',
  styleUrls: ['./database.component.scss']
})
export class DatabaseComponent {
  db_name!: string;
  db_host!: string;
  db_user!: string;
  db_password!: string;

  result!: string;

  constructor(private databaseService: DatabaseService,
              private apiService: APIService,
              private messageService: MessageService) { }

  generate(): void {
    const db: Object = {
      user: this.db_user,
      host: this.db_host,
      database: this.db_name,
      password: this.db_password,
    }
    const encryptedData = this.databaseService.encryptObject(db);
    this.apiService.testDatabase(encryptedData).subscribe((result) => {
      if (result.success) {
        const generatedUrl = encodeURIComponent(encryptedData);
        this.result = `https://basichomes.netlify.app?db=${generatedUrl}`;
      } else {
        this.messageService.setErrorMessage('An error has occured while setting up the database. Make sure the creditentials are correct and run the latest version of the plugin first to load it properly.')
      }
    });
  }
}
