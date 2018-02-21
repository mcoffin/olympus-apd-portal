import { Component, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PortalAPI, Player } from './services/portal-api';

export interface PlayerDialogData {
    title: string;
    locked: { [key: string]: boolean },
    player?: Player;
}

@Component({
    selector: 'apd-add-new-dialog',
    template: require('./add-new.html'),
    styles: [
        require('./add-new.scss').toString(),
    ],
})
export class AddNewDialog {
    squads: string[] = [
        'Alpha',
        'Bravo',
        'Charlie',
        'Delta',
        'Echo',
        'Foxtrot',
        'Exemptions',
    ];

    constructor(public dialogRef: MatDialogRef<AddNewDialog>, private portalApi: PortalAPI, @Inject(MAT_DIALOG_DATA) public data: PlayerDialogData) {
        if (!this.data.player) {
            this.data.player = <Player> {};
        }
    }
    onSubmit(f: NgForm) {
        if (f.valid) {
            const r: { player: Player, comment?: string } = {
                player: <Player> f.value,
            };
            r.comment = r.player['comment'];
            r.player['comment'] = undefined;

            this.portalApi.addPlayer(r)
                .subscribe(p => this.dialogRef.close(r.player));
        }
    }
}
