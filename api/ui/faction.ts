import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';
import { PortalAPI, Player } from './services/portal-api';

@Component({
    selector: 'apd-faction',
    template: require('./faction.html'),
    styles: [
        require('./faction.scss').toString()
    ],
    host: {
        '[class.apd-greedy-flex]': 'true',
        '[class.apd-background]': 'true',
    },
})
export class ApdFaction {
    factionId: Observable<string>;
    displayedColumns: string[] = ['p_name', 'puid', 'rank', '_next'];
    playersDataSource: Observable<Object>;
    user: Player;

    constructor(private route: ActivatedRoute, private http: HttpClient, private portalApi: PortalAPI) {
        this.factionId = route.paramMap.map((params): string => params.get('id'));
        this.playersDataSource = portalApi.getPlayers();
        portalApi.getUser()
            .subscribe(user => {
                this.user = user;
            });
    }
}
