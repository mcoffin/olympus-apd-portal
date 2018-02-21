import { Component, Input } from '@angular/core';

@Component({
    selector: 'apd-spinner',
    template: require('./apd-spinner.html'),
    styles: [
        require('./apd-spinner.scss').toString()
    ],
})
export class ApdSpinner {
    @Input()
    loading: boolean;
}
