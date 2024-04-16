import {
  Component,
  OnInit,
  WritableSignal,
  inject,
  signal,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatToolbarModule } from "@angular/material/toolbar";
import { Router, RouterModule } from "@angular/router";
import { LoginData, LoginResult } from "@interfaces/interfaces";
import { User } from "@model/user.model";
import { ApiService } from "@services/api.service";
import { AuthService } from "@services/auth.service";
import { UserService } from "@services/user.service";
import { LoadingComponent } from "@shared/components/loading/loading.component";

@Component({
  standalone: true,
  selector: "mcd-login",
  templateUrl: "./login.component.html",
  imports: [
    FormsModule,
    LoadingComponent,
    RouterModule,
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class LoginComponent implements OnInit {
  private as: ApiService = inject(ApiService);
  private us: UserService = inject(UserService);
  private router: Router = inject(Router);
  private auth: AuthService = inject(AuthService);

  loginData: LoginData = {
    email: "",
    pass: "",
  };
  loginError: WritableSignal<boolean> = signal<boolean>(false);
  loginSending: WritableSignal<boolean> = signal<boolean>(false);

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(["/main"]);
    }
  }

  doLogin(ev: Event): void {
    ev.preventDefault();

    if (this.loginData.email === "" || this.loginData.pass === "") {
      return;
    }

    this.loginSending.set(true);
    this.as.login(this.loginData).subscribe((result: LoginResult): void => {
      this.loginSending.set(false);
      if (result.status === "ok") {
        this.us.logged.set(true);
        this.us.user = new User().fromInterface({
          id: result.id,
          token: result.token,
          email: this.loginData.email,
        });
        this.us.saveLogin();

        this.router.navigate(["/main"]);
      } else {
        this.loginError.set(true);
      }
    });
  }
}
