import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { RemoveDialog } from './remove-dialog';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { tap } from 'rxjs/operators';
import { PortalAPI, Player } from './services/portal-api';

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
export class ApdFaction {
    factionId: Observable<string>;
    displayedColumns: string[] = ['p_name', 'puid', 'rank', '_next'];
    playersDataSource: Subject<Player[]> = new Subject<Player[]>();
    user: Player;
    pageSize: number = 1;
    playerCount: number = 0;

    constructor(private route: ActivatedRoute, private http: HttpClient, private portalApi: PortalAPI, private dialog: MatDialog) {
        this.factionId = route.paramMap.map((params): string => params.get('id'));
        portalApi.getPlayersPaginated({}, 0, 50)
            .subscribe(players => this.playersDataSource.next(players));
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

    onPaginationChange(evt: PageEvent) {
        const offset = evt.pageSize * evt.pageIndex;
        this.portalApi.getPlayersPaginated({}, offset, evt.pageSize)
            .subscribe(players => this.playersDataSource.next(players));
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
}
