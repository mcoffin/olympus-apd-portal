import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

export interface Player {
    puid: string;
    p_name: string;
    rank: string,
    admin_level: number;
}

@Injectable()
export class PortalAPI {
    constructor(private http: HttpClient) {
    }

    getPlayers(params?: { [param: string]: string | string[] }): Observable<Player[]> {
        return this.http.get<Player[]>("/api/v1/tables/players", { observe: 'response', responseType: 'json', params: params || undefined })
            .map(res => res.body);
    }
}
