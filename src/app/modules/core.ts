import { Provider } from "@angular/core";
import { ApiService } from "@services/api.service";
import { AuthService } from "@services/auth.service";
import { ClassMapperService } from "@services/class-mapper.service";
import { DataShareService } from "@services/data-share.service";
import { DialogService } from "@services/dialog.service";
import { UserService } from "@services/user.service";

export function provideCore(): Provider[] {
  return [
    ApiService,
    DataShareService,
    DialogService,
    UserService,
    AuthService,
    ClassMapperService,
  ];
}
