import { TextureInterface } from "@interfaces/interfaces";

export class Texture {
  constructor(
    public id: number | null = null,
    public name: string | null = null
  ) {}

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
