import { Routes } from "@angular/router";
import { isLoggedGuardFn } from "src/app/guard/auth.guard.fn";
import { LoginComponent } from "src/app/modules/pages/login/login.component";

export const routes: Routes = [
  { path: "", component: LoginComponent },
  {
    path: "register",
    loadComponent: () =>
      import("src/app/modules/pages/register/register.component"),
  },
  {
    path: "main",
    loadComponent: () => import("src/app/modules/pages/main/main.component"),
    canActivate: [isLoggedGuardFn],
  },
  {
    path: "new-design",
    loadComponent: () =>
      import("src/app/modules/pages/new-design/new-design.component"),
    canActivate: [isLoggedGuardFn],
  },
  {
    path: "edit-design/:id/:slug",
    loadComponent: () =>
      import("src/app/modules/pages/edit-design/edit-design.component"),
    canActivate: [isLoggedGuardFn],
  },
  {
    path: "design-settings/:id/:slug",
    loadComponent: () =>
      import("src/app/modules/pages/design-settings/design-settings.component"),
    canActivate: [isLoggedGuardFn],
  },
  {
    path: "profile",
    loadComponent: () =>
      import("src/app/modules/pages/profile/profile.component"),
    canActivate: [isLoggedGuardFn],
  },
  { path: "**", redirectTo: "/", pathMatch: "full" },
];
