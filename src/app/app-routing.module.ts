import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { LoginComponent } from "src/app/modules/pages/login/login.component";

import { AuthGuard } from "src/app/guard/auth.guard";

const routes: Routes = [
  { path: "", component: LoginComponent },
  {
    path: "register",
    loadComponent: () =>
      import("src/app/modules/pages/register/register.component"),
  },
  {
    path: "main",
    loadComponent: () => import("src/app/modules/pages/main/main.component"),
    canActivate: [AuthGuard],
  },
  {
    path: "new-design",
    loadComponent: () =>
      import("src/app/modules/pages/new-design/new-design.component"),
    canActivate: [AuthGuard],
  },
  {
    path: "edit-design/:id/:slug",
    loadComponent: () =>
      import("src/app/modules/pages/edit-design/edit-design.component"),
    canActivate: [AuthGuard],
  },
  {
    path: "design-settings/:id/:slug",
    loadComponent: () =>
      import("src/app/modules/pages/design-settings/design-settings.component"),
    canActivate: [AuthGuard],
  },
  {
    path: "profile",
    loadComponent: () =>
      import("src/app/modules/pages/profile/profile.component"),
    canActivate: [AuthGuard],
  },
  { path: "**", redirectTo: "/", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
