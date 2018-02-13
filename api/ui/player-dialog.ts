import { Component, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PortalAPI, Player } from './services/portal-api';
import { Observable } from 'rxjs/Observable';
import Lazy from 'lazy.js';

@Component({
    selector: 'player-dialog-box',
    template: require('./player-dialog.html'),
    styles: [
        require('./player-dialog.scss').toString(),
    ],
})
export class PlayerDialogBox {
    canEdit: boolean = false;

    constructor(public dialogRef: MatDialogRef<PlayerDialogBox>, @Inject(MAT_DIALOG_DATA) public data: any, private portalApi: PortalAPI) {
        portalApi.getUser()
            .map(user => user.admin_level >= 1)
            .subscribe(canEdit => this.canEdit = canEdit);
    }
}

@Component({
    selector: 'player-dialog',
    template: '',
})
export class PlayerDialog {
    private puid: Observable<string>;

    constructor(private portalApi: PortalAPI, private activatedRoute: ActivatedRoute, private dialog: MatDialog, private router: Router) {
        this.puid = activatedRoute.paramMap
            .map(params => params.get('puid'));

        const statsO = this.puid
            .flatMap(puid => portalApi.olympusStats(puid));

        this.puid
            .flatMap(puid => portalApi.getPlayer(puid))
            .flatMap(player => {
                return statsO.map(stats => Lazy(player).merge(stats).toObject());
            })
            .subscribe(player => this.openDialog(player));
    }

    openDialog(player: Player) {
        let dialogRef = this.dialog.open(PlayerDialogBox, {
            data: player,
        });
        dialogRef.afterClosed().subscribe((newPlayer?: Player) => {
            if (newPlayer) {
                console.warn('TODO: save player');
            }
            this.router.navigate(['.'], { relativeTo: this.activatedRoute.parent });
        });
    }
}
