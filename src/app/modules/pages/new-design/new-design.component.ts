import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { StatusResult } from "src/app/interfaces/interfaces";
import { Design } from "src/app/model/design.model";
import { MaterialModule } from "src/app/modules/material/material.module";
import { LoadingComponent } from "src/app/modules/shared/components/loading/loading.component";
import { ApiService } from "src/app/services/api.service";
import { DialogService } from "src/app/services/dialog.service";

@Component({
  standalone: true,
  selector: "mcd-new-design",
  templateUrl: "./new-design.component.html",
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    RouterModule,
    LoadingComponent,
  ],
  providers: [DialogService],
})
export default class NewDesignComponent {
  newDesign: Design = new Design();
  saveSending: boolean = false;

  constructor(
    private dialog: DialogService,
    private as: ApiService,
    private router: Router
  ) {}

  saveDesign(ev: MouseEvent): void {
    ev.preventDefault();
    this.saveSending = true;
    this.as
      .newDesign(this.newDesign.toInterface())
      .subscribe((result: StatusResult): void => {
        if (result.status == "ok") {
          this.dialog
            .alert({
              title: "OK",
              content:
                'New design "' + this.newDesign.name + '" has been saved.',
              ok: "Continue",
            })
            .subscribe((result: boolean): void => {
              this.router.navigate(["/main"]);
            });
        } else {
          this.dialog
            .alert({
              title: "Error",
              content:
                "There was an error when saving the new design. Please try again later.",
              ok: "Continue",
            })
            .subscribe((result: boolean): void => {});
        }
      });
  }
}
