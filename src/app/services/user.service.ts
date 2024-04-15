import { Injectable, inject } from "@angular/core";
import { UserInterface } from "@interfaces/interfaces";
import { User } from "@model/user.model";
import { ClassMapperService } from "@services/class-mapper.service";

@Injectable()
export class UserService {
  private cms: ClassMapperService = inject(ClassMapperService);

  logged: boolean = false;
  user: User | null = null;

  loadLogin(): void {
    const loginStr: string | null = localStorage.getItem("login");
    if (loginStr === null) {
      this.logout();
      return;
    }
    const loginObj: UserInterface = JSON.parse(loginStr);
    if (loginObj === null) {
      this.logout();
      return;
    }
    this.logged = true;
    this.user = this.cms.getUser(loginObj);
  }

  saveLogin(): void {
    if (this.user === null) {
      return;
    }
    const loginObj: UserInterface = this.user.toInterface();
    localStorage.setItem("login", JSON.stringify(loginObj));
  }

  logout(): void {
    this.logged = false;
    this.user = null;
    localStorage.removeItem("login");
  }
}
