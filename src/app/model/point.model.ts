import { PointInterface } from "@interfaces/interfaces";

export class Point {
  constructor(public x: number | null = null, public y: number | null = null) {}

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
