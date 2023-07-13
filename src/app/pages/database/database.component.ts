import { Component } from '@angular/core';
import { DbService } from 'src/app/services/db.service';

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

  constructor(private dbService: DbService) { }

  generate(): void {
    const db: Object = {
      user: this.db_user,
      host: this.db_host,
      database: this.db_name,
      password: this.db_password,
    }
    const generatedUrl = encodeURIComponent(this.dbService.encryptObject(db));
    this.result = `https://basichomes.netlify.app?db=${generatedUrl}`;
  }
}
