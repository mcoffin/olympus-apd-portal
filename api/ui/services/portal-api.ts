import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

export interface Player {
    puid: string;
    p_name: string;
    rank: string,
    admin_level: number;
    cop_time?: string;
}

export interface OlympusStats {
    name: string;
    pid: string;
    cop_time: string;
}

export interface Comment {
    id: number;
    puid: string;
    auid: string;
    comment?: string;
    timestamp: string;
    case_type: string;
    case_data: string;
    author?: Player;
}

@Injectable()
export class PortalAPI {
    constructor(private http: HttpClient) {
    }

    getUser(): Observable<Player> {
        return this.http.get<Player>("/api/v1/user", { observe: 'response', responseType: 'json' })
            .map(res => res.body);
    }

    getPlayersPaginated(params?: { [param: string]: string | string[] }, pageSize?: number) {
        return this.getPlayers(params, 0, [], pageSize);
    }

    getPlayers(params?: { [param: string]: string | string[] }, offset: number = 0, players: Player[] = [], pageSize?: number): Observable<Player[]> {
        const headers = {
            'X-APD-OrderBy': 'puid',
            'X-APD-Offset': `${offset}`,
        };
        if (pageSize) {
            headers['X-APD-Limit'] = `${pageSize}`;
        }
        return this.http.get<Player[]>("/api/v1/tables/players", { headers: headers, observe: 'response', responseType: 'json', params: params || undefined })
            .flatMap(res => {
                players = players.concat(res.body);
                if (res.headers.has('X-APD-Offset')) {
                    return this.getPlayers(params, parseInt(res.headers.get('X-APD-Offset')), players, pageSize)
                } else {
                    return Observable.of(players);
                }
            });
    }

    olympusStats(puid: string): Observable<OlympusStats> {
        const params = {
            pid: puid
        };
        return this.http.get<OlympusStats>("/api/v1/olympus-stats", { observe: 'response', responseType: 'json', params: params })
            .map(res => res.body);
    }

    getPlayer(puid: string): Observable<Player> {
        return this.getPlayers({puid: puid})
            .map(players => players[0]);
    }

    getPlayerComments(puid: string): Observable<Comment[]> {
        const params = {
            puid: puid
        };
        const headers = {
            'X-APD-OrderBy': 'timestamp',
        };
        return this.http.get<Comment[]>(`/api/v1/players/${puid}/comments`, { headers: headers, observe: 'response', responseType: 'json', params: params })
            .map(res => res.body);
    }
}
