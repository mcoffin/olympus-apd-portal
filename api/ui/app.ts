/// <reference types="node" />
import { Component, NgModule, Input, Output } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { RouterModule, Routes } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Login } from './login';
import { OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { LoginService } from './services/auth';
import { ToolbarCard } from './toolbar-card';

@Component({
    template: '<span>Page not Found</span>'
})
export class PageNotFoundComponent {
}

const routes: Routes = [
    { path: '**', component: PageNotFoundComponent },
];

@Component({
    selector: 'apd-portal',
    styles: [
        require('./app.scss').toString()
    ],
    template: require('./app.html'),
    host: { 'class': 'apd-portal-app' },
})
export class ApdPortalComponent implements OnInit {
    loggedIn: boolean = false;

    constructor(private loginService: LoginService) {}

    ngOnInit() {
        this.loggedIn = this.loginService.isLoggedIn;
        //if (document.cookie.indexOf("google_access_token=") >= 0) {
        //    this.loggedIn = true;
        //} else {
        //    this.loggedIn = false;
        //}
    }
}

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        MatMenuModule,
        MatSidenavModule,
        MatIconModule,
        MatButtonToggleModule,
        MatButtonModule,
        MatCardModule,
        RouterModule.forRoot(routes, {}),
    ],
    declarations: [
        ToolbarCard,
        Login,
        ApdPortalComponent,
        PageNotFoundComponent,
    ],
    providers: [
        CookieService,
        LoginService,
    ],
    bootstrap: [ ApdPortalComponent ],
})
export class AppModule {}

document.addEventListener('DOMContentLoaded', function () {
    platformBrowserDynamic().bootstrapModule(AppModule);
});
