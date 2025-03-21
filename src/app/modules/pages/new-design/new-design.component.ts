import { Component, WritableSignal, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { StatusResult } from '@interfaces/interfaces';
import Design from '@model/design.model';
import { DialogService } from '@osumi/angular-tools';
import ApiService from '@services/api.service';
import LoadingComponent from '@shared/components/loading/loading.component';

@Component({
  selector: 'mcd-new-design',
  templateUrl: './new-design.component.html',
  imports: [
    FormsModule,
    RouterModule,
    LoadingComponent,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export default class NewDesignComponent {
  private dialog: DialogService = inject(DialogService);
  private as: ApiService = inject(ApiService);
  private router: Router = inject(Router);

  newDesign: Design = new Design();
  saveSending: WritableSignal<boolean> = signal<boolean>(false);

  saveDesign(ev: MouseEvent): void {
    ev.preventDefault();
    this.saveSending.set(true);
    this.as
      .newDesign(this.newDesign.toInterface())
      .subscribe((result: StatusResult): void => {
        this.saveSending.set(false);
        if (result.status == 'ok') {
          this.dialog
            .alert({
              title: 'OK',
              content:
                'New design "' + this.newDesign.name + '" has been saved.',
              ok: 'Continue',
            })
            .subscribe((): void => {
              this.router.navigate(['/main']);
            });
        } else {
          this.dialog.alert({
            title: 'Error',
            content:
              'There was an error when saving the new design. Please try again later.',
            ok: 'Continue',
          });
        }
      });
  }
}
