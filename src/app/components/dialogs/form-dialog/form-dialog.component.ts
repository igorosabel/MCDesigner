import { Component }    from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogField }  from '../../../interfaces/interfaces';

@Component({
  selector: 'mcd-form-dialog',
  templateUrl: './form-dialog.component.html',
  styleUrls: ['../styles/dialog.component.scss']
})
export class FormDialogComponent {
    public title: string;
    public content: string;
	public fields: DialogField[];
    public ok: string;
    public cancel: string;

    constructor(public dialogRef: MatDialogRef<FormDialogComponent>) {}
}
