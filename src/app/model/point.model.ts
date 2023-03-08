import { PointInterface } from "src/app/interfaces/interfaces";

export class Point {
  constructor(public x: number = null, public y: number = null) {}

  fromInterface(p: PointInterface): Point {
    this.x = p.x;
    this.y = p.y;

    return this;
  }

  toInterface(): PointInterface {
    return {
      x: this.x,
      y: this.y,
    };
  }
}
