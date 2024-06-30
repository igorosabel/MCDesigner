import { TextureInterface } from '@interfaces/interfaces';

export default class Texture {
  constructor(public id: number = 0, public name: string = '') {}

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
