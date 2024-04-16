import { Component, WritableSignal, inject, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatToolbarModule } from "@angular/material/toolbar";
import { Router, RouterModule } from "@angular/router";
import { LoginResult, RegisterData } from "@interfaces/interfaces";
import { User } from "@model/user.model";
import { ApiService } from "@services/api.service";
import { UserService } from "@services/user.service";
import { LoadingComponent } from "@shared/components/loading/loading.component";

@Component({
  standalone: true,
  selector: "mcd-register",
  templateUrl: "./register.component.html",
  imports: [
    FormsModule,
    LoadingComponent,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export default class RegisterComponent {
  private as: ApiService = inject(ApiService);
  private us: UserService = inject(UserService);
  private router: Router = inject(Router);

  registerData: RegisterData = {
    email: "",
    pass: "",
    conf: "",
  };
  registerEmailError: WritableSignal<boolean> = signal<boolean>(false);
  registerPassError: WritableSignal<boolean> = signal<boolean>(false);
  registerSending: WritableSignal<boolean> = signal<boolean>(false);

  doRegister(ev: Event): void {
    ev.preventDefault();

    if (
      this.registerData.email === "" ||
      this.registerData.pass === "" ||
      this.registerData.conf === ""
    ) {
      return;
    }

    this.registerEmailError.set(false);
    this.registerPassError.set(false);
    if (this.registerData.pass !== this.registerData.conf) {
      this.registerPassError.set(true);
      return;
    }

    this.registerSending.set(true);
    this.as
      .register(this.registerData)
      .subscribe((result: LoginResult): void => {
        this.registerSending.set(false);
        if (result.status === "ok") {
          this.us.logged.set(true);
          this.us.user = new User().fromInterface({
            id: result.id,
            token: result.token,
            email: this.registerData.email,
          });
          this.us.saveLogin();

          this.router.navigate(["/main"]);
        } else {
          this.registerEmailError.set(true);
        }
      });
  }
}
