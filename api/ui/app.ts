/// <reference types="node" />
import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { RouterModule, Routes } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';

const style = require('./style.scss');

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
    templateUrl: './apd-portal.html',
})
export class ApdPortalComponent {
    title = "Olympus APD Portal";
}

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        MatToolbarModule,
	MatMenuModule,
	MatSidenavModule,
	MatIconModule,
	MatButtonToggleModule,
	MatButtonModule,
        RouterModule.forRoot(routes, {})
    ],
    declarations: [
        ApdPortalComponent,
        PageNotFoundComponent
    ],
    bootstrap: [ ApdPortalComponent ]
})
export class AppModule {}

document.addEventListener('DOMContentLoaded', function () {
    platformBrowserDynamic().bootstrapModule(AppModule);
});
