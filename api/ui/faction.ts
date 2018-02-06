import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'apd-faction',
    template: require('./faction.html'),
    host: { 'class': 'apd-greedy-flex' },
})
export class ApdFaction {
    factionId: Observable<string>;
    constructor(private route: ActivatedRoute) {
        this.factionId = route.paramMap.map((params): string => params.get('id'));
    }
}
