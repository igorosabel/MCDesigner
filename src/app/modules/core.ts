import { Provider } from "@angular/core";
import { ApiService } from "@services/api.service";
import { AuthService } from "@services/auth.service";
import { ClassMapperService } from "@services/class-mapper.service";
import { DialogService } from "@services/dialog.service";
import { UserService } from "@services/user.service";

export function provideCore(): Provider[] {
  return [
    ApiService,
    DialogService,
    UserService,
    AuthService,
    ClassMapperService,
  ];
}
