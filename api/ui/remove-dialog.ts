import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NgForm, FormControl, Validators } from '@angular/forms';
import { PortalAPI, Player } from './services/portal-api';

interface Removal {
    comment: string;
}

@Component({
    selector: 'apd-remove-dialog',
    template: require('./remove-dialog.html'),
    styles: [
        require('./remove-dialog.scss').toString()
    ],
    host: {
        '[class.apd-primary-dialog]': 'true',
    },
})
export class RemoveDialog {
    constructor(public dialogRef: MatDialogRef<RemoveDialog>, @Inject(MAT_DIALOG_DATA) public data: Player, private portalApi: PortalAPI) {}
    onSubmit(f: NgForm) {
        if (f.valid) {
            this.portalApi.removePlayer(this.data.puid, f.value.comment)
                .subscribe(() => this.dialogRef.close(this.data));
        }
    }
}
