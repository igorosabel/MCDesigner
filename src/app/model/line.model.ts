import { LineInterface } from "@interfaces/interfaces";
import { Point } from "@model/point.model";

export class Line {
  constructor(
    public start: Point | null = null,
    public end: Point | null = null
  ) {}

  fromInterface(l: LineInterface): Line {
    this.start = l.start !== null ? new Point().fromInterface(l.start) : null;
    this.end = l.end !== null ? new Point().fromInterface(l.end) : null;

    return this;
  }

  toInterface(): LineInterface {
    return {
      start: this.start !== null ? this.start.toInterface() : null,
      end: this.end !== null ? this.end.toInterface() : null,
    };
  }
}
