import { Injectable } from "@angular/core";
import { DesignInterface, LevelInterface } from "src/app/interfaces/interfaces";
import { Design } from "src/app/model/design.model";
import { Level } from "src/app/model/level.model";

@Injectable({
  providedIn: "root",
})
export class ClassMapperService {
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
}
