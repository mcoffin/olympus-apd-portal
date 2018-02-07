import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

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
    constructor(private route: ActivatedRoute) {
        this.factionId = route.paramMap.map((params): string => params.get('id'));
    }
}
