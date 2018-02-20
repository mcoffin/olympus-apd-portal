import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
    selector: 'apd-add-new-dialog',
    template: require('./add-new.html'),
    styles: [
        require('./add-new.scss').toString(),
    ],
})
export class AddNewDialog {
    constructor(public dialogRef: MatDialogRef<AddNewDialog>) {}
    onSubmit(f: NgForm) {
        if (f.valid) {
            console.warn(`TODO: add: ${JSON.stringify(f.value)}`);
            this.dialogRef.close(f.value);
        }
    }
}
