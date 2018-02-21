/// <reference types="node" />
import { Component, NgModule, ViewChild, Input, Output } from '@angular/core';
import { Location, PopStateEvent } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { RouterModule, Router, Event, NavigationEnd, Routes } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { BidiModule } from '@angular/cdk/bidi';
import { Login } from './login';
import { OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { LoginService } from './services/auth';
import { ToolbarCard } from './toolbar-card';
import { ApdFaction } from './faction';
import { ApdSidenavRouter, ApdSidenavRouterHeader } from './sidenav-router';
import { ApdIndex } from './index';
import { PlayerDialog, PlayerDialogBox } from './player-dialog';
import { ApdRowCard, PlayerDetails } from './player-details';
import { ApdSpinner } from './apd-spinner';
import { RemoveDialog } from './remove-dialog';
import { AddNewDialog } from './add-new';
import { tap } from 'rxjs/operators';
import { PortalAPI } from './services/portal-api';
import { FactionService } from './services/faction-service';

@Component({
    template: '<span>Page not Found</span>'
})
export class PageNotFoundComponent {
}

const routes: Routes = [
    { path: '', component: ApdIndex },
    {
        path: 'faction/:id',
        children: [
            {
                path: '',
                component: ApdFaction,
                children: [
                    {
                        path: ':puid/edit',
                        component: PlayerDialog,
                    },
                ],
            },
            {
                path: ':puid/details',
                component: PlayerDetails,
                children: [
                    {
                        path: ':puid/edit',
                        component: PlayerDialog,
                    },
                ],
            },
        ]
    },
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
    factions: any[] = [];
    @ViewChild('sidenav') sidenav: MatSidenav;

    private initialLoad: boolean;

    constructor(private router: Router, private loc: Location, private loginService: LoginService) {
        this.initialLoad = true;
        router.events.subscribe((evt: Event) => {
            if (evt instanceof NavigationEnd) {
                if (!this.initialLoad) {
                    this.sidenav.close();
                }
                this.initialLoad = false;
            }
        });
        this.factions = [
            {
                id: 'apd',
                name: 'APD',
            },
            //{
            //    id: 'rnr',
            //    name: 'R&R'
            //},
        ];
    }

    private updateLoginStatus() {
        this.loginService.isLoggedIn.subscribe(s => {
            this.loggedIn = s;
        });
    }

    logout(): void {
        this.loginService.logout()
            .pipe(
                tap((r) => this.updateLoginStatus()) // TODO: find out how to wait on this
            )
            .subscribe(end => {
                console.log('logged out');
                this.loc.go('/');
            });

    }

    sidenavGo(p: string): void {
        this.loc.go(p);
    }

    ngOnInit() {
        this.updateLoginStatus();
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
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        MatMenuModule,
        MatSidenavModule,
        MatIconModule,
        MatButtonToggleModule,
        MatButtonModule,
        MatTableModule,
        MatCardModule,
        MatDialogModule,
        MatTabsModule,
        MatTooltipModule,
        MatProgressSpinnerModule,
        MatFormFieldModule,
        MatInputModule,
        MatPaginatorModule,
        MatSortModule,
        MatSelectModule,
        MatSnackBarModule,
        BidiModule,
        RouterModule.forRoot(routes, {}),
    ],
    declarations: [
        ToolbarCard,
        Login,
        ApdFaction,
        ApdSidenavRouterHeader,
        ApdSidenavRouter,
        ApdIndex,
        ApdPortalComponent,
        PlayerDialog,
        PlayerDialogBox,
        PlayerDetails,
        RemoveDialog,
        ApdRowCard,
        ApdSpinner,
        AddNewDialog,
        PageNotFoundComponent,
    ],
    providers: [
        CookieService,
        LoginService,
        PortalAPI,
        FactionService,
    ],
    bootstrap: [ ApdPortalComponent ],
    entryComponents: [
        PlayerDialogBox,
        RemoveDialog,
        AddNewDialog,
    ],
})
export class AppModule {}

document.addEventListener('DOMContentLoaded', function () {
    platformBrowserDynamic().bootstrapModule(AppModule);
});
