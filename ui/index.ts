import { Component } from '@angular/core';

@Component({
    selector: 'apd-index',
    template: require('./index.html'),
    styles: [
        require('./index.scss').toString()
    ],
    host: {
        '[class.apd-background]': 'true',
    },
})
export class ApdIndex {
}
