import { LevelInterface } from '@interfaces/interfaces';
import Utils from '@shared/utils.class';

export default class Level {
  constructor(
    public id: number = 0,
    public name: string = '',
    public height: number = 0,
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
