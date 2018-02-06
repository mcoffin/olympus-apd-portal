import { Component }  from '@angular/core';

@Component({
    selector: 'login',
    template: require('./login.html'),
    styles: [
        require('./login.scss').toString(),
    ],
    host: { 'class': 'apd-centered-container apd-greedy-flex' },
})
export class Login {
}
