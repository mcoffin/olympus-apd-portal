import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { tap } from 'rxjs/operators';

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
    displayedColumns: string[] = ['p_name', 'puid', 'rank'];
    playersDataSource: Observable<Object>;

    constructor(private route: ActivatedRoute, private http: HttpClient) {
        this.factionId = route.paramMap.map((params): string => params.get('id'));
        this.playersDataSource = this.http.get('/api/v1/tables/players', { observe: 'response', responseType: 'json' })
            .map(resp => resp.body);
    }
}
