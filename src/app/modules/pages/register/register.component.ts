import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { LoginResult, RegisterData } from "src/app/interfaces/interfaces";
import { User } from "src/app/model/user.model";
import { MaterialModule } from "src/app/modules/material/material.module";
import { LoadingComponent } from "src/app/modules/shared/components/loading/loading.component";
import { ApiService } from "src/app/services/api.service";
import { UserService } from "src/app/services/user.service";

@Component({
  standalone: true,
  selector: "mcd-register",
  templateUrl: "./register.component.html",
  imports: [CommonModule, MaterialModule, FormsModule, LoadingComponent],
})
export default class RegisterComponent {
  registerData: RegisterData = {
    email: "",
    pass: "",
    conf: "",
  };
  registerEmailError: boolean = false;
  registerPassError: boolean = false;
  registerSending: boolean = false;

  constructor(
    private as: ApiService,
    private us: UserService,
    private router: Router
  ) {}

  doRegister(ev: Event): boolean {
    ev.preventDefault();

    if (
      this.registerData.email === "" ||
      this.registerData.pass === "" ||
      this.registerData.conf === ""
    ) {
      return false;
    }

    this.registerEmailError = false;
    this.registerPassError = false;
    if (this.registerData.pass !== this.registerData.conf) {
      this.registerPassError = true;
      return false;
    }

    this.registerSending = true;
    this.as
      .register(this.registerData)
      .subscribe((result: LoginResult): void => {
        this.registerSending = false;
        if (result.status === "ok") {
          this.us.logged = true;
          this.us.user = new User().fromInterface({
            id: result.id,
            token: result.token,
            email: this.registerData.email,
          });
          this.us.saveLogin();

          this.router.navigate(["/main"]);
        } else {
          this.registerEmailError = true;
        }
      });
  }
}
