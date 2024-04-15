import { DesignInterface, LevelInterface } from "@interfaces/interfaces";
import { Level } from "@model/level.model";
import { Utils } from "@shared/utils.class";

export class Design {
  constructor(
    public id: number = 0,
    public name: string = "New design",
    public slug: string = "new-design",
    public sizeX: number = 50,
    public sizeY: number = 50,
    public levels: Level[] = []
  ) {}

  fromInterface(d: DesignInterface): Design {
    this.id = d.id;
    this.name = Utils.urldecode(d.name);
    this.slug = d.slug;
    this.sizeX = d.sizeX;
    this.sizeY = d.sizeY;
    this.levels = d.levels
      ? d.levels.map((l: LevelInterface): Level => {
          return new Level().fromInterface(l);
        })
      : [];

    return this;
  }

  toInterface(): DesignInterface {
    return {
      id: this.id,
      name: Utils.urlencode(this.name),
      slug: this.slug,
      sizeX: this.sizeX,
      sizeY: this.sizeY,
      levels: this.levels
        ? this.levels.map((l: Level): LevelInterface => {
            return l.toInterface();
          })
        : [],
    };
  }
}
