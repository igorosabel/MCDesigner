import { Component, WritableSignal, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'mcd-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  imports: [MatDialogModule, MatButtonModule],
})
export default class AlertDialogComponent {
  public title: WritableSignal<string> = signal<string>('');
  public content: WritableSignal<string> = signal<string>('');
  public ok: WritableSignal<string> = signal<string>('Continue');

  constructor(public dialogRef: MatDialogRef<AlertDialogComponent>) {}
}
