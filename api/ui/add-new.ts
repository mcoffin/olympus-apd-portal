import { Component, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PortalAPI, Player } from './services/portal-api';
import { catchError } from 'rxjs/operators';

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

    constructor(public dialogRef: MatDialogRef<AddNewDialog>, private portalApi: PortalAPI, @Inject(MAT_DIALOG_DATA) public data: PlayerDialogData, private snackBar: MatSnackBar) {
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
                .pipe(
                    catchError(e => {
                        const msg = e.error['error'] || JSON.stringify(e.error);
                        this.snackBar.open(msg, 'Dismiss', {
                            panelClass: 'apd-warn',
                            duration: 3000,
                        });
                        throw e;
                    })
                )
                .subscribe(p => this.dialogRef.close(r.player));
        }
    }
}
