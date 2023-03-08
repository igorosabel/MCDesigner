import { TextureInterface } from "src/app/interfaces/interfaces";

export class Texture {
  constructor(public id: number = null, public name: string = null) {}

  fromInterface(t: TextureInterface): Texture {
    this.id = t.id;
    this.name = t.name;

    return this;
  }

  toInterface(): TextureInterface {
    return {
      id: this.id,
      name: this.name,
    };
  }
}
