import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Params, Router, RouterModule } from "@angular/router";
import { DesignResult, StatusResult } from "src/app/interfaces/interfaces";
import { Design } from "src/app/model/design.model";
import { MaterialModule } from "src/app/modules/material/material.module";
import { LoadingComponent } from "src/app/modules/shared/components/loading/loading.component";
import { Utils } from "src/app/modules/shared/utils.class";
import { ApiService } from "src/app/services/api.service";
import { DialogService } from "src/app/services/dialog.service";

@Component({
  standalone: true,
  selector: "mcd-design-settings",
  templateUrl: "./design-settings.component.html",
  styleUrls: ["./design-settings.component.scss"],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    RouterModule,
    LoadingComponent,
  ],
  providers: [DialogService],
})
export class DesignSettingsComponent implements OnInit {
  designLoading: boolean = true;
  initialSizeX: number = 0;
  initialSizeY: number = 0;
  design: Design = new Design(null, "Loading...", "loading", 0, 0, []);
  saveSending: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private as: ApiService,
    private dialog: DialogService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params): void => {
      this.loadDesign(params.id);
    });
  }

  loadDesign(id: number): void {
    this.as.loadDesign(id).subscribe((result: DesignResult): void => {
      this.designLoading = false;
      if (result.status == "ok") {
        this.design.id = result.design.id;
        this.design.name = Utils.urldecode(result.design.name);
        this.design.slug = result.design.slug;
        this.design.sizeX = result.design.sizeX;
        this.design.sizeY = result.design.sizeY;
        this.design.levels = [];

        this.initialSizeX = result.design.sizeX;
        this.initialSizeY = result.design.sizeY;
      } else {
        this.dialog
          .alert({
            title: "Error",
            content:
              "There was an error when loading the required design. Please try again later.",
            ok: "Continue",
          })
          .subscribe((result: boolean): void => {
            this.router.navigate(["/main"]);
          });
      }
    });
  }

  updateDesign(ev: MouseEvent): void {
    ev.preventDefault();
    if (this.design.name == "") {
      this.dialog
        .alert({ title: "Error", content: "Name is required.", ok: "Continue" })
        .subscribe((result: boolean): void => {});
      return;
    }
    if (
      isNaN(this.design.sizeX) ||
      this.design.sizeX == null ||
      isNaN(this.design.sizeY) ||
      this.design.sizeY == null
    ) {
      this.dialog
        .alert({ title: "Error", content: "Size is required.", ok: "Continue" })
        .subscribe((result: boolean): void => {});
      return;
    }
    if (
      this.design.sizeX < this.initialSizeX ||
      this.design.sizeY < this.initialSizeY
    ) {
      this.dialog
        .confirm({
          title: "Confirm",
          content:
            "Designs original size was bigger than entered and data could be lost. Are you sure you want to continue?",
          ok: "Continue",
          cancel: "Cancel",
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
    this.saveSending = true;
    this.as
      .updateDesignSettings(this.design.toInterface())
      .subscribe((result: StatusResult): void => {
        this.saveSending = false;
        if (result.status == "ok") {
          this.dialog
            .alert({
              title: "Success",
              content: "Design settings have been updated.",
              ok: "Continue",
            })
            .subscribe((result: boolean): void => {});
        } else {
          this.dialog
            .alert({
              title: "Error",
              content:
                "There was an error updating the design. Please try again later.",
              ok: "Continue",
            })
            .subscribe((result: boolean): void => {});
        }
      });
  }
}
