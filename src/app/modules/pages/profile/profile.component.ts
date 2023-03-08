import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { Profile, StatusResult } from "src/app/interfaces/interfaces";
import { MaterialModule } from "src/app/modules/material/material.module";
import { LoadingComponent } from "src/app/modules/shared/components/loading/loading.component";
import { ApiService } from "src/app/services/api.service";
import { DialogService } from "src/app/services/dialog.service";
import { UserService } from "src/app/services/user.service";

@Component({
  standalone: true,
  selector: "mcd-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    RouterModule,
    LoadingComponent,
  ],
  providers: [DialogService],
})
export class ProfileComponent implements OnInit {
  saveSending: boolean = false;
  profile: Profile = {
    email: "",
    oldPass: "",
    newPass: "",
    confPass: "",
  };

  constructor(
    private us: UserService,
    private dialog: DialogService,
    private as: ApiService
  ) {}

  ngOnInit(): void {
    this.profile.email = this.us.user.email;
  }

  updateProfile(ev: MouseEvent): void {
    ev.preventDefault();
    if (this.profile.email == "") {
      this.dialog
        .alert({
          title: "Error",
          content: "Email field is required.",
          ok: "Continue",
        })
        .subscribe((result: boolean): void => {});
      return;
    }
    if (
      this.profile.oldPass != "" ||
      this.profile.newPass != "" ||
      this.profile.confPass != ""
    ) {
      if (this.profile.oldPass == "") {
        this.dialog
          .alert({
            title: "Error",
            content:
              "If you want to change your password, the current password is required.",
            ok: "Continue",
          })
          .subscribe((result: boolean): void => {});
        return;
      }
      if (this.profile.newPass == "") {
        this.dialog
          .alert({
            title: "Error",
            content:
              "If you want to change your password, the new password is required.",
            ok: "Continue",
          })
          .subscribe((result: boolean): void => {});
        return;
      }
      if (this.profile.confPass == "") {
        this.dialog
          .alert({
            title: "Error",
            content:
              "If you want to change your password, you have to confirm the new password.",
            ok: "Continue",
          })
          .subscribe((result: boolean): void => {});
        return;
      }
      if (this.profile.newPass != this.profile.confPass) {
        this.dialog
          .alert({
            title: "Error",
            content: "New password and its confirmation don't match.",
            ok: "Continue",
          })
          .subscribe((result: boolean): void => {});
        return;
      }
    }

    this.saveSending = true;
    this.as
      .updateProfile(this.profile)
      .subscribe((result: StatusResult): void => {
        this.saveSending = false;
        if (result.status == "ok") {
          this.us.user.email = this.profile.email;
          this.us.saveLogin();
          this.profile.oldPass = "";
          this.profile.newPass = "";
          this.profile.confPass = "";

          this.dialog
            .alert({
              title: "Success",
              content: "Profile information was successfully updated.",
              ok: "Continue",
            })
            .subscribe((result: boolean): void => {});
        }
        if (result.status == "pass-error") {
          this.dialog
            .alert({
              title: "Error",
              content: "Current password is wrong.",
              ok: "Continue",
            })
            .subscribe((result: boolean): void => {});
        }
        if (result.status == "error") {
          this.dialog
            .alert({
              title: "Error",
              content:
                "There was an error updating your user profile. Please try again later.",
              ok: "Continue",
            })
            .subscribe((result: boolean): void => {});
        }
      });
  }
}
