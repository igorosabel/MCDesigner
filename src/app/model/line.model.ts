import { LineInterface } from '@interfaces/interfaces';
import Point from '@model/point.model';

export default class Line {
  constructor(
    public start: Point = new Point(),
    public end: Point = new Point()
  ) {}

  fromInterface(l: LineInterface): Line {
    this.start = new Point().fromInterface(l.start);
    this.end = new Point().fromInterface(l.end);

    return this;
  }

  toInterface(): LineInterface {
    return {
      start: this.start.toInterface(),
      end: this.end.toInterface(),
    };
  }
}
