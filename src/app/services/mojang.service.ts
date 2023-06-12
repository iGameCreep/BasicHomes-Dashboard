import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment.local';

@Injectable({
  providedIn: 'root'
})
export class MojangService {
  constructor(private http: HttpClient) { }

  api_endpoint: string = environment.API_DOMAIN + environment.API_PORT ? ":" + environment.API_PORT : "";

  getUsernameByUUID(uuid: string): Observable<string> {
    return this.http
      .get<string>(`/mojang/username/${uuid}`)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  getUUIDByUsername(username: string): Observable<string> {
    return this.http
      .get<string>(`/mojang/uuid/${username}`)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
}
