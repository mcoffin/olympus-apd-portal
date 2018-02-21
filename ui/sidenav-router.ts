import { Component, Directive } from '@angular/core';
import { Location } from '@angular/common';

@Directive({
    selector: '[sidenav-router-header]',
    host: {
        '[class.sidenav-router-header]': 'true',
        '[class.apd-primary-darker]': 'true',
    },
})
export class ApdSidenavRouterHeader {
}

@Component({
    selector: 'sidenav-router',
    template: '<section class="sidenav-router-container"><ng-content></ng-content></section>',
    styles: [ require('./sidenav-router.scss').toString() ],
})
export class ApdSidenavRouter {
    constructor(private loc: Location) {}
}
