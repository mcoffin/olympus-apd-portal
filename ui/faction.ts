import { AfterViewInit, Component, ChangeDetectorRef, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import Lazy from 'lazy.js';
import { RemoveDialog } from './remove-dialog';
import { AddNewDialog } from './add-new';
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

function combineThreeObs(first, second, third) {
    const oneTwo = Observable.combineLatest(first, second);
    return Observable.combineLatest(oneTwo, third)
        .map(([fst, snd]) => [fst[0], fst[1], snd]);
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
    displayedColumns: string[] = ['p_name', 'puid', 'squad', 'rank', '_next'];
    filters: Subject<{ [key: string]: string | string[] }>;
    players: Observable<Player[]>;
    sort: Subject<Sort>;
    page: Subject<Page>;
    localFilter: Subject<string>;
    playersDataSource: Observable<Player[]>;
    loading: boolean = true;
    user?: Player;
    pageSize: number = 1;
    playerCount: number = 0;
    private filterCount: number = 0;

    constructor(private cdr: ChangeDetectorRef, private route: ActivatedRoute, private http: HttpClient, private portalApi: PortalAPI, private dialog: MatDialog, private router: Router) {
        this.localFilter = new Subject();
        this.sort = new Subject();
        this.page = new Subject();
        this.filters = new Subject();
        this.filters
            .subscribe(filters => this.filterCount = Lazy(filters).size());
        this.players = this.filters
            .flatMap(params => this.portalApi.getPlayersPaginated(params))
            //.map(players => Lazy(players).filter(p => p.squad).toArray())
            .pipe(
                tap(() => this.loading = false)
            );
        const filteredPlayers = Observable.combineLatest(this.players, this.localFilter)
            .map(([players, filterString]) => {
                return Lazy(players)
                    .filter(player => Lazy(player).values().map(v => `${v}`).filter(v => v.toLowerCase().includes(filterString.toLowerCase())).size() > 0)
                    .toArray();
            })
            .pipe(
                tap(p => this.playerCount = p.length)
            );
        this.playersDataSource = combineThreeObs(filteredPlayers, this.page, this.sort)
            .map(([players, page, sort]) => {
                return Lazy(players)
                    .sortBy(sort.active, sort.direction === 'desc')
                    .rest(page.offset)
                    .first(page.pageSize)
                    .toArray();
            });

        this.factionId = route.paramMap.map((params): string => params.get('id'));

        portalApi.getUser()
            .subscribe(user => {
                this.user = user;
            });
        router.events
            .filter(evt => evt instanceof NavigationEnd)
            .map(evt => evt.url)
            .filter(u => u.startsWith("/faction/") && Lazy(u).split("/").size() === 3)
            .subscribe(() => this.refreshData());
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
                this.refreshData();
            });
    }

    openAddDialog() {
        const dialogRef = this.dialog.open(AddNewDialog, {
            data: {
                title: 'Add new',
                locked: {},
            },
            minWidth: '70%',
        });
        dialogRef.afterClosed()
            .filter((addedPlayer?: Player) => addedPlayer ? true : false)
            .subscribe((addedPlayer: Player) => {
                this.refreshData();
            });
    }

    refreshData() {
        this.loading = true;
        this.filters.next({});
    }

    onLocalFilterChange(v: string) {
        this.localFilter.next(v);
    }

    ngAfterViewInit() {
        this.sort.next({active: 'p_name', direction: 'asc'});
        this.page.next({offset: 0, pageSize: 50});
        this.filters.next({});
        this.localFilter.next('');
        this.cdr.detectChanges();
    }
}
