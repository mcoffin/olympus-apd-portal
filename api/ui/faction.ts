import { AfterViewInit, Component, ChangeDetectorRef, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { RemoveDialog } from './remove-dialog';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { tap } from 'rxjs/operators';
import { PortalAPI, Player } from './services/portal-api';

interface Page {
    offset: number;
    pageSize: number;
}

class PageInfo implements Page {
    offset: number;
    pageSize: number;

    constructor(evt: PageEvent) {
        this.pageSize = evt.pageSize;
        this.offset = this.pageSize * evt.pageIndex;
    }
}

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
export class ApdFaction implements AfterViewInit {
    factionId: Observable<string>;
    displayedColumns: string[] = ['p_name', 'puid', 'rank', '_next'];
    sortedPlayers: Observable<Player[]>;
    sort: Subject<Sort>;
    page: Subject<Page>;
    loading: boolean = true;
    playersDataSource: Observable<Player[]>;
    user?: Player;
    pageSize: number = 1;
    playerCount: number = 0;

    constructor(private cdr: ChangeDetectorRef, private route: ActivatedRoute, private http: HttpClient, private portalApi: PortalAPI, private dialog: MatDialog) {
        this.sort = new Subject();
        this.page = new Subject();
        this.playersDataSource = Observable.combineLatest(this.page, this.sort)
            .flatMap(([page, sort]) => {
                return this.portalApi.getPlayersPaginated({}, page.offset, page.pageSize, sort)
                    .pipe(
                        tap(() => this.loading = false)
                    );
            });

        this.factionId = route.paramMap.map((params): string => params.get('id'));

        portalApi.getPlayerCount()
            .subscribe(c => {
                this.playerCount = c;
                console.log(`updated player count: ${JSON.stringify(this.playerCount)}`);
            });
        portalApi.getUser()
            .subscribe(user => {
                this.user = user;
            });
    }

    onSortChange(evt: Sort) {
        this.sort.next(evt);
    }

    onPaginationChange(evt: PageEvent) {
        this.page.next(new PageInfo(evt));
    }

    openRemoveDialog(player: Player) {
        const dialogRef = this.dialog.open(RemoveDialog, {
            data: player,
            minWidth: '50%',
        });
        dialogRef.afterClosed()
            .filter((removedPlayer?: Player) => removedPlayer ? true : false)
            .subscribe((removedPlayer?: Player) => {
                console.warn('TODO: trigger table update');
            });
    }

    ngAfterViewInit() {
        this.sort.next({active: 'p_name', direction: 'asc'});
        this.page.next({offset: 0, pageSize: 50});
        this.cdr.detectChanges();
    }
}
