import {
  Component,
  OnInit,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { Profile, StatusResult } from '@interfaces/interfaces';
import { DialogService } from '@osumi/angular-tools';
import ApiService from '@services/api.service';
import UserService from '@services/user.service';
import LoadingComponent from '@shared/components/loading/loading.component';

@Component({
  selector: 'mcd-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
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
export default class ProfileComponent implements OnInit {
  private us: UserService = inject(UserService);
  private dialog: DialogService = inject(DialogService);
  private as: ApiService = inject(ApiService);

  saveSending: WritableSignal<boolean> = signal<boolean>(false);
  profile: Profile = {
    email: '',
    oldPass: '',
    newPass: '',
    confPass: '',
  };

  ngOnInit(): void {
    if (this.us.user !== null) {
      this.profile.email = this.us.user.email;
    }
  }

  updateProfile(ev: MouseEvent): void {
    ev.preventDefault();
    if (this.profile.email == '') {
      this.dialog.alert({
        title: 'Error',
        content: 'Email field is required.',
        ok: 'Continue',
      });
      return;
    }
    if (
      this.profile.oldPass != '' ||
      this.profile.newPass != '' ||
      this.profile.confPass != ''
    ) {
      if (this.profile.oldPass == '') {
        this.dialog.alert({
          title: 'Error',
          content:
            'If you want to change your password, the current password is required.',
          ok: 'Continue',
        });
        return;
      }
      if (this.profile.newPass == '') {
        this.dialog.alert({
          title: 'Error',
          content:
            'If you want to change your password, the new password is required.',
          ok: 'Continue',
        });
        return;
      }
      if (this.profile.confPass == '') {
        this.dialog.alert({
          title: 'Error',
          content:
            'If you want to change your password, you have to confirm the new password.',
          ok: 'Continue',
        });
        return;
      }
      if (this.profile.newPass != this.profile.confPass) {
        this.dialog.alert({
          title: 'Error',
          content: "New password and its confirmation don't match.",
          ok: 'Continue',
        });
        return;
      }
    }

    this.saveSending.set(true);
    this.as
      .updateProfile(this.profile)
      .subscribe((result: StatusResult): void => {
        this.saveSending.set(false);
        if (result.status == 'ok') {
          if (this.us.user !== null) {
            this.us.user.email = this.profile.email;
            this.us.saveLogin();
          }
          this.profile.oldPass = '';
          this.profile.newPass = '';
          this.profile.confPass = '';

          this.dialog.alert({
            title: 'Success',
            content: 'Profile information was successfully updated.',
            ok: 'Continue',
          });
        }
        if (result.status == 'pass-error') {
          this.dialog.alert({
            title: 'Error',
            content: 'Current password is wrong.',
            ok: 'Continue',
          });
        }
        if (result.status == 'error') {
          this.dialog.alert({
            title: 'Error',
            content:
              'There was an error updating your user profile. Please try again later.',
            ok: 'Continue',
          });
        }
      });
  }
}
