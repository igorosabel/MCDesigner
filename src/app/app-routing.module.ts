import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { DesignSettingsComponent } from "src/app/modules/pages/design-settings/design-settings.component";
import { EditDesignComponent } from "src/app/modules/pages/edit-design/edit-design.component";
import { LoginComponent } from "src/app/modules/pages/login/login.component";
import { MainComponent } from "src/app/modules/pages/main/main.component";
import { NewDesignComponent } from "src/app/modules/pages/new-design/new-design.component";
import { ProfileComponent } from "src/app/modules/pages/profile/profile.component";
import { RegisterComponent } from "src/app/modules/pages/register/register.component";

import { AuthGuard } from "src/app/guard/auth.guard";

const routes: Routes = [
  { path: "", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "main", component: MainComponent, canActivate: [AuthGuard] },
  {
    path: "new-design",
    component: NewDesignComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "edit-design/:id/:slug",
    component: EditDesignComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "design-settings/:id/:slug",
    component: DesignSettingsComponent,
    canActivate: [AuthGuard],
  },
  { path: "profile", component: ProfileComponent, canActivate: [AuthGuard] },
  { path: "**", redirectTo: "/", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
