import { UserInterface } from "src/app/interfaces/interfaces";
import { Utils } from "src/app/modules/shared/utils.class";

export class User {
  constructor(
    public id: number = null,
    public token: string = null,
    public email: string = null
  ) {}

  fromInterface(u: UserInterface): User {
    this.id = u.id;
    this.token = Utils.urldecode(u.token);
    this.email = Utils.urldecode(u.email);

    return this;
  }

  toInterface(): UserInterface {
    return {
      id: this.id,
      token: Utils.urlencode(this.token),
      email: Utils.urlencode(this.email),
    };
  }
}
