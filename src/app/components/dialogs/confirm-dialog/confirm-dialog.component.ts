import { Component }    from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'mcd-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['../styles/dialog.component.scss']
})
export class ConfirmDialogComponent {
    public title: string;
    public content: string;
    public ok: string;
    public cancel: string;

    constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>) {}
}
