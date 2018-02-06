import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'apd-faction',
    template: require('./faction.html'),
})
export class ApdFaction implements OnInit {
    constructor(private route: ActivatedRoute) {
        this.factionId = route.paramMap.map((params): string => params.get('id'));
    }
}
