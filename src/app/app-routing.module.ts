import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent }          from './pages/login/login.component';
import { RegisterComponent }       from './pages/register/register.component';
import { MainComponent }           from './pages/main/main.component';
import { NewDesignComponent }      from './pages/new-design/new-design.component';
import { EditDesignComponent }     from './pages/edit-design/edit-design.component';
import { DesignSettingsComponent } from './pages/design-settings/design-settings.component';
import { ProfileComponent }        from './pages/profile/profile.component';

import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
	{ path: '',                          component: LoginComponent },
	{ path: 'register',                  component: RegisterComponent },
	{ path: 'main',                      component: MainComponent,           canActivate: [AuthGuard] },
	{ path: 'new-design',                component: NewDesignComponent,      canActivate: [AuthGuard] },
	{ path: 'edit-design/:id/:slug',     component: EditDesignComponent,     canActivate: [AuthGuard] },
	{ path: 'design-settings/:id/:slug', component: DesignSettingsComponent, canActivate: [AuthGuard] },
	{ path: 'profile',                   component: ProfileComponent,        canActivate: [AuthGuard] },
	{ path: '**', redirectTo: '/', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
