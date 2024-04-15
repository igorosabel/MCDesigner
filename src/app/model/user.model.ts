import { UserInterface } from "@interfaces/interfaces";
import { Utils } from "@shared/utils.class";

export class User {
  constructor(
    public id: number = 0,
    public token: string = "",
    public email: string = ""
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
