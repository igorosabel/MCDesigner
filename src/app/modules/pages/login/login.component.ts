import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatToolbarModule } from "@angular/material/toolbar";
import { Router, RouterModule } from "@angular/router";
import { LoginData, LoginResult } from "src/app/interfaces/interfaces";
import { User } from "src/app/model/user.model";
import { LoadingComponent } from "src/app/modules/shared/components/loading/loading.component";
import { ApiService } from "src/app/services/api.service";
import { AuthService } from "src/app/services/auth.service";
import { UserService } from "src/app/services/user.service";

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
  loginData: LoginData = {
    email: "",
    pass: "",
  };
  loginError: boolean = false;
  loginSending: boolean = false;

  constructor(
    private as: ApiService,
    private us: UserService,
    private router: Router,
    private auth: AuthService
  ) {}

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

    this.loginSending = true;
    this.as.login(this.loginData).subscribe((result: LoginResult): void => {
      this.loginSending = false;
      if (result.status === "ok") {
        this.us.logged = true;
        this.us.user = new User().fromInterface({
          id: result.id,
          token: result.token,
          email: this.loginData.email,
        });
        this.us.saveLogin();

        this.router.navigate(["/main"]);
      } else {
        this.loginError = true;
      }
    });
  }
}
