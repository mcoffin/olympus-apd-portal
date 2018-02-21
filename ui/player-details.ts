import { Component, Directive } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Comment, PortalAPI, Player } from './services/portal-api';
import CaseTypes from './config/case-types';
import Lazy from 'lazy.js';

@Directive({
    selector: '[apd-row-card]',
    host: {
        '[class.apd-row-card]': 'true',
        '[class.mat-elevation-z0]': 'true',
    },
})
export class ApdRowCard {}

@Component({
    selector: 'player-details',
    template: require('./player-details.html'),
    styles: [
        require('./player-details.scss').toString()
    ],
    host: {
        '[class.apd-greedy-flex]': 'true',
        '[class.apd-background]': 'true',
    },
})
export class PlayerDetails {
    private puid: Observable<string>;
    comments?: Comment[] = null;
    player: any = {};
    caseTypes: { [case_type: string]: string } = CaseTypes;

    constructor(private activatedRoute: ActivatedRoute, private portalApi: PortalAPI) {
        this.puid = this.activatedRoute.paramMap
            .map(params => params.get('puid'));

        const stats = this.puid
            .flatMap(puid => portalApi.olympusStats(puid));

        this.puid
            .flatMap(puid => portalApi.getPlayer(puid))
            .flatMap(player => stats.map(s => {
                const p = Lazy(player).merge(s).toObject();
                console.log(JSON.stringify(p));
                return p;
            }))
            .subscribe(p => this.player = p);

        this.puid
            .flatMap(puid => portalApi.getPlayerComments(puid))
            .subscribe(comments => this.comments = comments);
    }
}
