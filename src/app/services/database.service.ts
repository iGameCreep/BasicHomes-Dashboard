import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Home } from "../models/home.model";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { LoginResponse, SessionDestroy, SessionInformationsResponse, UserInformations } from '../types';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class DatabaseService {
    api_endpoint: string = environment.API_DOMAIN + environment.API_PORT ? ":" + environment.API_PORT : "";

    constructor(private http: HttpClient) { }

    getAllServerHomes(serverId: string): Observable<Home[]> {
        serverId = serverId.replaceAll("-", "");
        return this.http.get<Home[]>(`${this.api_endpoint}/homes/${serverId}`).pipe(
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
          map(homes => homes.filter(home => home.uuid.replaceAll('-', '') === userId.replaceAll('-', '')))
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

    deleteHomeById(serverId: string, homeId: number): void {
        this.http.get(`${this.api_endpoint}/home/${serverId}/${homeId}/delete`).subscribe((result) => {return});
    }

    getAccountInfoById(accountId: number): Observable<UserInformations> {
        return this.http.get<UserInformations>(`${this.api_endpoint}/account/${accountId}`);
    }

    setServerName(uuid: string, name: string, accId: number): void {
        const body = {
            name: name,
            accId: accId
        };
        this.http.post<void>(`${this.api_endpoint}/server/${uuid}`, body).subscribe((result) => {return}) ;
    }

    login(userId: number, password: string): Observable<LoginResponse> {
        const body = {
            accountId: userId,
            password: password
        }
        return this.http.post<LoginResponse>(`${this.api_endpoint}/api/login`, body);
    }

    getSessionInfoFromSession(session: string): Observable<SessionInformationsResponse> {
        const body = {
            sessionId: session
        }
        return this.http.post<SessionInformationsResponse>(`${this.api_endpoint}/api/session`, body);
    }

    destroySession(session: string): Observable<SessionDestroy> {
        const body = {
            sessionId: session
        }
        return this.http.post<SessionDestroy>('${this.api_endpoint}/api/session/destroy', body);
    }

    deleteAccount(accountId: number): void {
        const body = {
            accountId: accountId
        }   
        this.http.post<void>(`${this.api_endpoint}/account/delete`, body).subscribe((result) => {return});
    }

    changeAccountPassword(accountId: number, password: string): void {
        const body = {
            accountId: accountId,
            password: password
        }
        this.http.post<void>(`${this.api_endpoint}/account/password`, body).subscribe((result) => {return});
    }
}