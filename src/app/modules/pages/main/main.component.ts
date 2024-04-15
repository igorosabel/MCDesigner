import { Component, OnInit, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { Router, RouterModule } from "@angular/router";
import { DesignListResult, StatusResult } from "@interfaces/interfaces";
import { Design } from "@model/design.model";
import { ApiService } from "@services/api.service";
import { ClassMapperService } from "@services/class-mapper.service";
import { DialogService } from "@services/dialog.service";
import { UserService } from "@services/user.service";

@Component({
  standalone: true,
  selector: "mcd-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"],
  imports: [
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatSidenavModule,
  ],
  providers: [DialogService],
})
export default class MainComponent implements OnInit {
  private router: Router = inject(Router);
  private as: ApiService = inject(ApiService);
  private dialog: DialogService = inject(DialogService);
  private user: UserService = inject(UserService);
  private cms: ClassMapperService = inject(ClassMapperService);

  designList: Design[] = [];
  designsEdit: boolean = false;

  ngOnInit(): void {
    this.as.loadDesigns().subscribe((result: DesignListResult): void => {
      this.designList = this.cms.getDesigns(result.list);
    });
  }

  logout(ev: MouseEvent): void {
    ev.preventDefault();
    this.user.logout();
    this.router.navigate(["/"]);
  }

  editDesigns(): void {
    this.designsEdit = !this.designsEdit;
  }

  deleteDesign(design: Design): void {
    this.dialog
      .confirm({
        title: "Delete design",
        content: "Are you sure you want to delete this design?",
        ok: "Continue",
        cancel: "Cancel",
      })
      .subscribe((result: boolean): void => {
        if (result === true) {
          this.as
            .deleteDesign(design.id)
            .subscribe((result: StatusResult): void => {
              if (result.status == "ok") {
                this.dialog.alert({
                  title: "Success",
                  content: 'Design "' + design.name + '" has been deleted.',
                  ok: "Continue",
                });
                const ind: number = this.designList.findIndex(
                  (x: Design): boolean => x.id == design.id
                );
                this.designList.splice(ind, 1);
              } else {
                this.dialog.alert({
                  title: "Error",
                  content:
                    "There was an error attempting to delete the design. Please try again.",
                  ok: "Continue",
                });
              }
            });
        }
      });
  }
}
