import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Home } from "../models/home.model";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { LoginResponse, SessionDestroy, SessionInformationsResponse, UserInformations } from '../types';
import { environment } from '../../environments/environment';
import { DbService } from "./db.service";

@Injectable({
    providedIn: 'root'
})
export class DatabaseService {
    api_endpoint: string = environment.API_DOMAIN + ':' + environment.API_PORT;

    constructor(private http: HttpClient,
                private dbService: DbService) { }
                
    getHeaders(): any {
        return { db: this.dbService.getKey() }
    }

    getAllHomes(): Observable<Home[]> {
        return this.http.get<Home[]>(`${this.api_endpoint}/homes`, {headers: this.getHeaders()}).pipe(
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

    getAllPlayerHomes(userId: string): Observable<Home[]> {
        return this.getAllHomes().pipe(
          map(homes => homes.filter(home => home.uuid.replaceAll('-', '') === userId.replaceAll('-', '')))
        );
    }

    getServerHomeById(homeId: number): Observable<Home> {
        return this.getAllHomes().pipe(
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

    deleteHomeById(homeId: number): void {
        this.http.get(`${this.api_endpoint}/home/${homeId}/delete`, {headers: this.getHeaders()}).subscribe((result) => {return});
    }

    getAccountInfoById(accountId: number): Observable<UserInformations> {
        return this.http.get<UserInformations>(`${this.api_endpoint}/account/${accountId}`, {headers: this.getHeaders()});
    }

    getAllAccounts(): Observable<UserInformations[]> {
        return this.http.get<UserInformations[]>(`${this.api_endpoint}/accounts`, {headers: this.getHeaders()});
    }

    changeAccountRank(accountId: number): void {
        this.http.post<void>(`${this.api_endpoint}/account/${accountId}/rank`, {}, {headers: this.getHeaders()}).subscribe((result) => {return});
    }

    login(userId: number, password: string): Observable<LoginResponse> {
        const body = {
            accountId: userId,
            password: password
        }
        return this.http.post<LoginResponse>(`${this.api_endpoint}/api/login`, body, {headers: this.getHeaders()});
    }

    getSessionInfoFromSession(session: string): Observable<SessionInformationsResponse> {
        const body = {
            sessionId: session
        }
        return this.http.post<SessionInformationsResponse>(`${this.api_endpoint}/api/session`, body, {headers: this.getHeaders()});
    }

    destroySession(session: string): Observable<SessionDestroy> {
        const body = {
            sessionId: session
        }
        return this.http.post<SessionDestroy>(`${this.api_endpoint}/api/session/destroy`, body, {headers: this.getHeaders()});
    }

    deleteAccount(accountId: number): void {
        const body = {
            accountId: accountId
        }   
        this.http.post<void>(`${this.api_endpoint}/account/delete`, body, {headers: this.getHeaders()}).subscribe((result) => {return});
    }

    changeAccountPassword(accountId: number, password: string): void {
        const body = {
            accountId: accountId,
            password: password
        }
        this.http.post<void>(`${this.api_endpoint}/account/password`, body, {headers: this.getHeaders()}).subscribe((result) => {return});
    }

    testDatabase(db: string): Observable<any> {
        return this.http.post<any>(`${this.api_endpoint}/db`, {}, {headers: { db: db }})
    }
}