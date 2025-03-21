import {
  Component,
  InputSignalWithTransform,
  OnInit,
  WritableSignal,
  inject,
  input,
  numberAttribute,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { DesignResult, StatusResult } from '@interfaces/interfaces';
import Design from '@model/design.model';
import { DialogService } from '@osumi/angular-tools';
import { urldecode } from '@osumi/tools';
import ApiService from '@services/api.service';
import LoadingComponent from '@shared/components/loading/loading.component';

@Component({
  selector: 'mcd-design-settings',
  templateUrl: './design-settings.component.html',
  styleUrls: ['./design-settings.component.scss'],
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
export default class DesignSettingsComponent implements OnInit {
  private router: Router = inject(Router);
  private as: ApiService = inject(ApiService);
  private dialog: DialogService = inject(DialogService);

  id: InputSignalWithTransform<number, unknown> = input.required({
    transform: numberAttribute,
  });
  designLoading: WritableSignal<boolean> = signal<boolean>(true);
  initialSizeX: number = 0;
  initialSizeY: number = 0;
  design: Design = new Design(0, 'Loading...', 'loading', 0, 0, []);
  saveSending: WritableSignal<boolean> = signal<boolean>(false);

  ngOnInit(): void {
    this.loadDesign(this.id());
  }

  loadDesign(id: number): void {
    this.as.loadDesign(id).subscribe((result: DesignResult): void => {
      this.designLoading.set(false);
      if (result.status == 'ok') {
        this.design.id = result.design.id;
        this.design.name = urldecode(result.design.name);
        this.design.slug = result.design.slug;
        this.design.sizeX = result.design.sizeX;
        this.design.sizeY = result.design.sizeY;
        this.design.levels = [];

        this.initialSizeX = result.design.sizeX;
        this.initialSizeY = result.design.sizeY;
      } else {
        this.dialog
          .alert({
            title: 'Error',
            content:
              'There was an error when loading the required design. Please try again later.',
            ok: 'Continue',
          })
          .subscribe((): void => {
            this.router.navigate(['/main']);
          });
      }
    });
  }

  updateDesign(ev: MouseEvent): void {
    ev.preventDefault();
    if (this.design.name == '') {
      this.dialog.alert({
        title: 'Error',
        content: 'Name is required.',
        ok: 'Continue',
      });
      return;
    }
    if (
      isNaN(this.design.sizeX) ||
      this.design.sizeX == null ||
      isNaN(this.design.sizeY) ||
      this.design.sizeY == null
    ) {
      this.dialog.alert({
        title: 'Error',
        content: 'Size is required.',
        ok: 'Continue',
      });
      return;
    }
    if (
      this.design.sizeX < this.initialSizeX ||
      this.design.sizeY < this.initialSizeY
    ) {
      this.dialog
        .confirm({
          title: 'Confirm',
          content:
            'Designs original size was bigger than entered and data could be lost. Are you sure you want to continue?',
          ok: 'Continue',
          cancel: 'Cancel',
        })
        .subscribe((result: boolean): void => {
          if (result === true) {
            this.confirmUpdate();
          }
        });
      return;
    }
    this.confirmUpdate();
  }

  confirmUpdate(): void {
    this.saveSending.set(true);
    this.as
      .updateDesignSettings(this.design.toInterface())
      .subscribe((result: StatusResult): void => {
        this.saveSending.set(false);
        if (result.status == 'ok') {
          this.dialog.alert({
            title: 'Success',
            content: 'Design settings have been updated.',
            ok: 'Continue',
          });
        } else {
          this.dialog.alert({
            title: 'Error',
            content:
              'There was an error updating the design. Please try again later.',
            ok: 'Continue',
          });
        }
      });
  }
}
