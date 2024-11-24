import { UserInterface } from '@interfaces/interfaces';
import { urldecode, urlencode } from '@osumi/tools';

export default class User {
  constructor(
    public id: number = 0,
    public token: string = '',
    public email: string = ''
  ) {}

  fromInterface(u: UserInterface): User {
    this.id = u.id;
    this.token = urldecode(u.token);
    this.email = urldecode(u.email);

    return this;
  }

  toInterface(): UserInterface {
    return {
      id: this.id,
      token: urlencode(this.token),
      email: urlencode(this.email),
    };
  }
}
