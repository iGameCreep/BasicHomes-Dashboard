import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Home } from "../models/home.model";
import { Observable } from "rxjs";
import { filter, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class DatabaseService {
    constructor(private http: HttpClient) { }

    getAllServerHomes(serverId: string): Observable<Home[]> {
        serverId = serverId.replaceAll("-", "");
        return this.http.get<Home[]>(`http://localhost:3000/homes/${serverId}`).pipe(
            map(response => {
                return response.map(data => {
                    const home = new Home();
                    home.homename = data.homename;
                    home.homeid = data.homeid;
                    home.uuid = data.uuid;
                    home.world = data.world;
                    home.x = data.x;
                    home.y = data.y;
                    home.z = data.z;
                    return home;
                })
            })
        )
    }

    getAllPlayerHomes(serverId: string, userId: string): Observable<Home[]> {
        return this.getAllServerHomes(serverId).pipe(
          map(homes => homes.filter(home => home.uuid === userId))
        );
    }

    getServerHomeById(serverId: string, homeId: number): Observable<Home> {
        return this.getAllServerHomes(serverId).pipe(
            map(homes => {
                const home = homes.find(h => Number(h.homeid) === Number(homeId));
                if (home) {
                    return home;
                } else {
                    throw new Error(`Home with id ${homeId} not found`);
                }
            })
        );
    }
}