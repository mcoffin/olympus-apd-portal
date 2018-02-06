import { Component, Input } from '@angular/core';

@Component({
    selector: 'apd-toolbar-card',
    template: require('./toolbar-card.html'),
    styles: [
        require('./toolbar-card.scss').toString()
    ],
})
export class ToolbarCard {
    @Input()
    title: string = "";
}
