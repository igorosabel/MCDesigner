import { Routes } from "@angular/router";
import { isLoggedGuardFn } from "@app/guard/auth.guard.fn";
import { LoginComponent } from "@pages/login/login.component";

export const routes: Routes = [
  { path: "", component: LoginComponent },
  {
    path: "register",
    loadComponent: () => import("@pages/register/register.component"),
  },
  {
    path: "main",
    loadComponent: () => import("@pages/main/main.component"),
    canActivate: [isLoggedGuardFn],
  },
  {
    path: "new-design",
    loadComponent: () => import("@pages/new-design/new-design.component"),
    canActivate: [isLoggedGuardFn],
  },
  {
    path: "edit-design/:id/:slug",
    loadComponent: () => import("@pages/edit-design/edit-design.component"),
    canActivate: [isLoggedGuardFn],
  },
  {
    path: "design-settings/:id/:slug",
    loadComponent: () =>
      import("@pages/design-settings/design-settings.component"),
    canActivate: [isLoggedGuardFn],
  },
  {
    path: "profile",
    loadComponent: () => import("@pages/profile/profile.component"),
    canActivate: [isLoggedGuardFn],
  },
  { path: "**", redirectTo: "/", pathMatch: "full" },
];
