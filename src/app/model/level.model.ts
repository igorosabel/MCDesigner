import { LevelInterface } from "src/app/interfaces/interfaces";
import { Utils } from "../modules/shared/utils.class";

export class Level {
  constructor(
    public id: number = null,
    public name: string = null,
    public height: number = null,
    public data: number[][] = []
  ) {}

  fromInterface(l: LevelInterface): Level {
    this.id = l.id;
    this.name = Utils.urldecode(l.name);
    this.height = l.height;
    this.data = l.data;

    return this;
  }

  toInterface(): LevelInterface {
    return {
      id: this.id,
      name: Utils.urlencode(this.name),
      height: this.height,
      data: this.data,
    };
  }
}
