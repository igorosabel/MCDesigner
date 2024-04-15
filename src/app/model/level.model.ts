import { LevelInterface } from "@interfaces/interfaces";
import { Utils } from "@shared/utils.class";

export class Level {
  constructor(
    public id: number | null = null,
    public name: string | null = null,
    public height: number | null = null,
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
