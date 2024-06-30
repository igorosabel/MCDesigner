import { PointInterface } from '@interfaces/interfaces';

export default class Point {
  constructor(public x: number = 0, public y: number = 0) {}

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
