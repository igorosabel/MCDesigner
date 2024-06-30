import { Injectable } from '@angular/core';
import {
  DesignInterface,
  LevelInterface,
  UserInterface,
} from '@interfaces/interfaces';
import Design from '@model/design.model';
import Level from '@model/level.model';
import User from '@model/user.model';

@Injectable({
  providedIn: 'root',
})
export default class ClassMapperService {
  getLevel(l: LevelInterface): Level {
    return new Level().fromInterface(l);
  }

  getLevels(ls: LevelInterface[]): Level[] {
    return ls.map((l: LevelInterface): Level => {
      return this.getLevel(l);
    });
  }

  getDesign(d: DesignInterface): Design {
    return new Design().fromInterface(d);
  }

  getDesigns(ds: DesignInterface[]): Design[] {
    return ds.map((d: DesignInterface): Design => {
      return this.getDesign(d);
    });
  }

  getUser(u: UserInterface): User {
    return new User().fromInterface(u);
  }
}
