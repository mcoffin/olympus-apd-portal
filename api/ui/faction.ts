import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';
import { RemoveDialog } from './remove-dialog';
import { Observable } from 'rxjs/Observable';
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
    playersDataSource: Observable<Player[]>;
    user: Player;
    pageSize: number = 1;

    constructor(private route: ActivatedRoute, private http: HttpClient, private portalApi: PortalAPI, private dialog: MatDialog) {
        this.factionId = route.paramMap.map((params): string => params.get('id'));
        this.playersDataSource = portalApi.getPlayersPaginated({}, this.pageSize);
        portalApi.getUser()
            .subscribe(user => {
                this.user = user;
            });
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
