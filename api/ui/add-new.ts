import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { PortalAPI, Player } from './services/portal-api';

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

    constructor(public dialogRef: MatDialogRef<AddNewDialog>, private portalApi: PortalAPI) {}
    onSubmit(f: NgForm) {
        if (f.valid) {
            const r: { player: Player, comment?: string } = {
                player: <Player> f.value,
            };
            r.comment = r.player['comment'];
            r.player['comment'] = undefined;

            this.portalApi.addPlayer(r)
                .subscribe(p => this.dialogRef.close(p));
        }
    }
}
