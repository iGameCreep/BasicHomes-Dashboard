import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MojangService {
  constructor(private http: HttpClient) { }

  getUsernameByUUID(uuid: string): Observable<string> {
    return this.http
      .get<string>(`http://localhost:3000/mojang/username/${uuid}`)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getUUIDByUsername(username: string): Observable<string> {
    return this.http
      .get<string>(`http://localhost:3000/mojang/uuid/${username}`)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
}
