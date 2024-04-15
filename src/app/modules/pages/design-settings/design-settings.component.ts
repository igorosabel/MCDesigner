import { Component, OnInit, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatToolbarModule } from "@angular/material/toolbar";
import { ActivatedRoute, Params, Router, RouterModule } from "@angular/router";
import { DesignResult, StatusResult } from "@interfaces/interfaces";
import { Design } from "@model/design.model";
import { ApiService } from "@services/api.service";
import { DialogService } from "@services/dialog.service";
import { LoadingComponent } from "@shared/components/loading/loading.component";
import { Utils } from "@shared/utils.class";

@Component({
  standalone: true,
  selector: "mcd-design-settings",
  templateUrl: "./design-settings.component.html",
  styleUrls: ["./design-settings.component.scss"],
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
  providers: [DialogService],
})
export default class DesignSettingsComponent implements OnInit {
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private as: ApiService = inject(ApiService);
  private dialog: DialogService = inject(DialogService);

  designLoading: boolean = true;
  initialSizeX: number = 0;
  initialSizeY: number = 0;
  design: Design = new Design(0, "Loading...", "loading", 0, 0, []);
  saveSending: boolean = false;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: Params): void => {
      this.loadDesign(params["id"]);
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
          .subscribe((): void => {
            this.router.navigate(["/main"]);
          });
      }
    });
  }

  updateDesign(ev: MouseEvent): void {
    ev.preventDefault();
    if (this.design.name == "") {
      this.dialog.alert({
        title: "Error",
        content: "Name is required.",
        ok: "Continue",
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
        title: "Error",
        content: "Size is required.",
        ok: "Continue",
      });
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
          this.dialog.alert({
            title: "Success",
            content: "Design settings have been updated.",
            ok: "Continue",
          });
        } else {
          this.dialog.alert({
            title: "Error",
            content:
              "There was an error updating the design. Please try again later.",
            ok: "Continue",
          });
        }
      });
  }
}
