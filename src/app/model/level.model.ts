import { LevelInterface } from '@interfaces/interfaces';
import { urldecode, urlencode } from '@osumi/tools';

export default class Level {
  constructor(
    public id: number = 0,
    public name: string | null = '',
    public height: number = 0,
    public data: number[][] = []
  ) {}

  fromInterface(l: LevelInterface): Level {
    this.id = l.id;
    this.name = urldecode(l.name);
    this.height = l.height;
    this.data = l.data;

    return this;
  }

  toInterface(): LevelInterface {
    return {
      id: this.id,
      name: urlencode(this.name),
      height: this.height,
      data: this.data,
    };
  }
}
