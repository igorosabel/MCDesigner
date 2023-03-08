import { LineInterface } from "src/app/interfaces/interfaces";
import { Point } from "src/app/model/point.model";

export class Line {
  constructor(public start: Point = null, public end: Point = null) {}

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
