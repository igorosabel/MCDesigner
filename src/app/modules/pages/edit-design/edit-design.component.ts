import { CdkDrag } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnInit,
  Signal,
  WritableSignal,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import {
  DesignResult,
  DialogOptions,
  LevelData,
  LevelResult,
  StatusResult,
  ToolInterface,
  UndoAction,
} from '@interfaces/interfaces';
import Design from '@model/design.model';
import Level from '@model/level.model';
import Line from '@model/line.model';
import Point from '@model/point.model';
import Texture from '@model/texture.model';
import ApiService from '@services/api.service';
import ClassMapperService from '@services/class-mapper.service';
import DialogService from '@services/dialog.service';
import LoadingComponent from '@shared/components/loading/loading.component';
import TEXTURES from '@shared/textures.class';
import Utils from '@shared/utils.class';

@Component({
  selector: 'mcd-edit-design',
  templateUrl: './edit-design.component.html',
  styleUrls: ['./edit-design.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    LoadingComponent,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    CdkDrag,
  ],
  providers: [DialogService],
})
export default class EditDesignComponent implements OnInit {
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private as: ApiService = inject(ApiService);
  private dialog: DialogService = inject(DialogService);
  private cms: ClassMapperService = inject(ClassMapperService);
  private router: Router = inject(Router);
  private snack: MatSnackBar = inject(MatSnackBar);

  designLoading: WritableSignal<boolean> = signal<boolean>(true);
  design: Design = new Design(0, 'Cargando...', 'cargando', 0, 0, []);
  rowWidth: WritableSignal<number> = signal<number>(0);
  boardHeight: WritableSignal<number> = signal<number>(0);

  toolBox: Signal<ElementRef> = viewChild.required('toolBox');

  initialPosition: Point = new Point(0, 0);
  position: Point = new Point(0, 0);
  offset: Point = new Point(0, 0);

  toolsClosed: WritableSignal<boolean> = signal<boolean>(false);
  mobileToolsClosed: WritableSignal<boolean> = signal<boolean>(false);
  selectedTool: ToolInterface = {
    option: 'paint',
    name: 'Paint',
  };
  zoomLevel: WritableSignal<number> = signal<number>(100);
  line: Line = new Line(new Point(-1, -1), new Point(-1, -1));
  showRulers: WritableSignal<boolean> = signal<boolean>(false);

  textures: Texture[] = TEXTURES;
  currentTexture: WritableSignal<number> = signal<number>(0);
  currentLevel: WritableSignal<number> = signal<number>(0);
  showLevels: WritableSignal<boolean> = signal<boolean>(false);
  showTextures: WritableSignal<boolean> = signal<boolean>(false);
  savingDesign: WritableSignal<boolean> = signal<boolean>(false);
  saveTimer: number = -1;

  undoList: UndoAction[] = [];

  fillTexture: number | null = null;
  fillToBePainted: Point[] = [];

  ngOnInit(): void {
    if (window.innerWidth < 600) {
      this.initialPosition.x = 0;
      this.initialPosition.y = 64;
    } else {
      const posX: string | null = localStorage.getItem('position_x');
      const posY: string | null = localStorage.getItem('position_y');
      this.initialPosition.x = posX !== null ? parseInt(posX) : 100;
      this.initialPosition.y = posY !== null ? parseInt(posY) : 100;
    }
    this.activatedRoute.params.subscribe((params: Params): void => {
      this.loadDesign(params['id']);
    });
  }

  loadDesign(id: number): void {
    this.as.loadDesign(id).subscribe((result: DesignResult): void => {
      this.designLoading.set(false);
      if (result.status == 'ok') {
        this.design = this.cms.getDesign(result.design);
        this.updateRowWidth();
      } else {
        this.dialog
          .alert({
            title: 'Error',
            content:
              'There was an error when loading the required design. Please try again later.',
            ok: 'Continue',
          })
          .subscribe((): void => {
            this.router.navigate(['/main']);
          });
      }
    });
  }

  updateRowWidth(): void {
    this.rowWidth.set(
      this.design.levels[0].data[0].length * (this.zoomLevel() * 0.2)
    );
    this.boardHeight.set(
      this.design.levels[0].data[0].length * (this.zoomLevel() * 0.2)
    );
  }

  mobileCloseTools(): void {
    this.mobileToolsClosed.update((value: boolean): boolean => !value);
  }

  closeTools(): void {
    this.toolsClosed.update((value: boolean): boolean => !value);
  }

  toolsDragEnd(): void {
    const transform: string = this.toolBox().nativeElement.style.transform;
    const regex =
      /translate3d\(\s?(?<x>[-]?\d*)px,\s?(?<y>[-]?\d*)px,\s?(?<z>[-]?\d*)px\)/;
    const values: RegExpExecArray | null = regex.exec(transform);

    this.offset = new Point(0, 0);
    if (values !== null) {
      this.offset.x = parseInt(values[1]);
      this.offset.y = parseInt(values[2]);
    }

    this.position.x = this.initialPosition.x + this.offset.x;
    this.position.y = this.initialPosition.y + this.offset.y;

    localStorage.setItem('position_x', this.position.x.toString());
    localStorage.setItem('position_y', this.position.y.toString());
  }

  selectOption(option: string, name: string): void {
    if (this.selectedTool.option == 'line' && option != 'line') {
      this.resetLine();
    }
    this.selectedTool.option = option;
    this.selectedTool.name = name;
  }

  openTextures(): void {
    this.showTextures.update((value: boolean): boolean => !value);
  }

  selectTexture(texture: Texture): void {
    this.currentTexture.set(
      this.textures.findIndex((x: Texture): boolean => x.id == texture.id)
    );
    this.openTextures();
  }

  addNewLevel(): void {
    this.dialog
      .form({
        title: 'Add new level',
        content: 'Enter the name of the new level',
        ok: 'Continue',
        cancel: 'Cancel',
        fields: [
          {
            title: 'Name',
            type: 'text',
            value: '',
          },
        ],
      })
      .subscribe((result: DialogOptions): void => {
        if (result && result.fields) {
          if (!result.fields[0].value) {
            this.dialog.alert({
              title: 'Error',
              content: 'Name of the new level is required.',
              ok: 'Continue',
            });
          } else {
            const newLevel: LevelData = {
              id: 0,
              idDesign: this.design.id,
              name: Utils.urlencode(result.fields[0].value),
            };
            this.as
              .addNewLevel(newLevel)
              .subscribe((result: LevelResult): void => {
                if (result.status == 'ok') {
                  this.dialog.alert({
                    title: 'Success',
                    content:
                      'New level "' +
                      Utils.urldecode(newLevel.name) +
                      '" has been added.',
                    ok: 'Continue',
                  });
                  this.design.levels.push(this.cms.getLevel(result.level));
                }
              });
          }
        }
      });
  }

  deployLevels(): void {
    this.showLevels.update((value: boolean): boolean => !value);
  }

  selectLevel(level: Level): void {
    this.currentLevel.set(
      this.design.levels.findIndex((x: Level): boolean => x.id == level.id)
    );
    this.deployLevels();
  }

  renameLevel(level: Level): void {
    this.dialog
      .form({
        title: 'Rename level',
        content: 'Enter the new name of this level',
        ok: 'Continue',
        cancel: 'Cancel',
        fields: [
          {
            title: 'Name',
            type: 'text',
            value: level.name,
          },
        ],
      })
      .subscribe((result: DialogOptions): void => {
        if (result && result.fields) {
          if (!result.fields[0].value) {
            this.dialog.alert({
              title: 'Error',
              content: 'Name of the new level is required.',
              ok: 'Continue',
            });
          } else {
            const levelData: LevelData = {
              id: level.id,
              idDesign: this.design.id,
              name: result.fields[0].value,
            };
            this.as
              .renameLevel(levelData)
              .subscribe((result: StatusResult): void => {
                if (result.status == 'ok') {
                  this.dialog.alert({
                    title: 'Success',
                    content:
                      'Level has been renamed to "' + levelData.name + '"',
                    ok: 'Continue',
                  });
                  const ind: number = this.design.levels.findIndex(
                    (x: Level): boolean => x.id == level.id
                  );
                  this.design.levels[ind].name = levelData.name;
                } else {
                  this.dialog.alert({
                    title: 'Error',
                    content:
                      'There was an error attempting to change the name of the level. Please try again.',
                    ok: 'Continue',
                  });
                }
              });
          }
        }
      });
  }

  copyLevel(level: Level): void {
    this.dialog
      .confirm({
        title: 'Copy level',
        content: 'Are you sure you want to copy this level?',
        ok: 'Continue',
        cancel: 'Cancel',
      })
      .subscribe((result: boolean): void => {
        if (result === true && level.id !== null) {
          this.as.copyLevel(level.id).subscribe((result: LevelResult): void => {
            if (result.status == 'ok') {
              const newLevelCopied: Level = this.cms.getLevel(result.level);
              this.design.levels.push(newLevelCopied);
              this.dialog.alert({
                title: 'Success',
                content:
                  'New level "' + newLevelCopied.name + '" has been added.',
                ok: 'Continue',
              });
            } else {
              this.dialog.alert({
                title: 'Error',
                content:
                  'There was an error attempting to copy the level. Please try again.',
                ok: 'Continue',
              });
            }
          });
        }
      });
  }

  deleteLevel(level: Level): void {
    this.dialog
      .confirm({
        title: 'Delete level',
        content: 'Are you sure you want to delete this level?',
        ok: 'Continue',
        cancel: 'Cancel',
      })
      .subscribe((result: boolean): void => {
        if (result === true && level.id !== null) {
          this.as
            .deleteLevel(level.id)
            .subscribe((result: StatusResult): void => {
              if (result.status == 'ok') {
                this.dialog.alert({
                  title: 'Success',
                  content: 'Level "' + level.name + '" has been deleted.',
                  ok: 'Continue',
                });
                const ind: number = this.design.levels.findIndex(
                  (x: Level): boolean => x.id == level.id
                );
                if (ind == this.currentLevel()) {
                  this.currentLevel.set(0);
                }
                this.design.levels.splice(ind, 1);
              } else {
                this.dialog.alert({
                  title: 'Error',
                  content:
                    'There was an error attempting to delete the level. Please try again.',
                  ok: 'Continue',
                });
              }
            });
        }
      });
  }

  changeRulers(): void {
    this.showRulers.update((value: boolean): boolean => !value);
  }

  adjustZoom(mode: string): void {
    if (mode == 'l') {
      if (this.zoomLevel() == 10) {
        return;
      }
      this.zoomLevel.update((value: number): number => (value -= 10));
    }
    if (mode == 'r') {
      this.zoomLevel.set(100);
    }
    if (mode == 'm') {
      if (this.zoomLevel() == 200) {
        return;
      }
      this.zoomLevel.update((value: number): number => (value += 10));
    }
    this.updateRowWidth();
  }

  selectCell(i: number, j: number): void {
    switch (this.selectedTool.option) {
      case 'paint':
        {
          if (
            this.design.levels[this.currentLevel()].data[i][j] !=
            this.currentTexture()
          ) {
            const action: UndoAction = {
              x: i,
              y: j,
              previous: this.design.levels[this.currentLevel()].data[i][j],
            };
            this.undoList = [action];

            this.design.levels[this.currentLevel()].data[i][j] =
              this.currentTexture();
            this.resetAutoSave();
          }
        }
        break;
      case 'picker':
        {
          this.currentTexture.set(
            this.design.levels[this.currentLevel()].data[i][j]
          );
        }
        break;
      case 'line':
        {
          if (this.line.start.x == -1 && this.line.start.y == -1) {
            this.line.start.x = i;
            this.line.start.y = j;
          } else {
            this.line.end.x = i;
            this.line.end.y = j;
            this.drawLine();
            this.resetLine();
            this.resetAutoSave();
          }
        }
        break;
      case 'fill':
        {
          this.fillTexture = this.design.levels[this.currentLevel()].data[i][j];
          this.fillToBePainted = [];
          this.undoList = [];

          const p: Point = new Point(i, j);
          this.fillAddCell(p);
          this.paintToBeFilled();
        }
        break;
    }
  }

  resetLine(): void {
    this.line.start = new Point(-1, -1);
    this.line.end = new Point(-1, -1);
  }

  generatePath(p0: Point, p1: Point): Point[] {
    const points: Point[] = [];
    const dx: number = p1.x - p0.x;
    const dy: number = p1.y - p0.y;
    const N: number = Math.max(Math.abs(dx), Math.abs(dy));
    const divN: number = N == 0 ? 0 : 1 / N;
    const xstep: number = dx * divN;
    const ystep: number = dy * divN;
    let x: number = p0.x;
    let y: number = p0.y;
    for (let step: number = 0; step <= N; step++, x += xstep, y += ystep) {
      points.push(new Point(Math.round(x), Math.round(y)));
    }
    return points;
  }

  drawLine(): void {
    const coordinates: Point[] = this.generatePath(
      this.line.start,
      this.line.end
    );
    this.undoList = [];
    for (const p of coordinates) {
      if (
        this.design.levels[this.currentLevel()].data[p.x][p.y] !=
        this.currentTexture()
      ) {
        const action: UndoAction = {
          x: p.x,
          y: p.y,
          previous: this.design.levels[this.currentLevel()].data[p.x][p.y],
        };
        this.undoList.push(action);

        this.design.levels[this.currentLevel()].data[p.x][p.y] =
          this.currentTexture();
      }
    }
  }

  getSurroundingCells(p: Point): Point[] {
    const surrounding: Point[] = [];
    for (let x: number = p.x - 1; x <= p.x + 1; x++) {
      for (let y: number = p.y - 1; y <= p.y + 1; y++) {
        if (
          (x != p.x || y != p.y) &&
          x >= 0 &&
          y >= 0 &&
          x < this.design.sizeX &&
          y < this.design.sizeY
        ) {
          const point: Point = new Point(x, y);
          surrounding.push(point);
        }
      }
    }
    return surrounding;
  }

  fillAddCell(p: Point): void {
    this.fillToBePainted.push(p);

    const surrounding: Point[] = this.getSurroundingCells(p);
    for (const newP of surrounding) {
      if (
        this.design.levels[this.currentLevel()].data[newP.x][newP.y] ==
        this.fillTexture
      ) {
        const ind: number = this.fillToBePainted.findIndex(
          (e: Point): boolean => e.x == newP.x && e.y == newP.y
        );
        if (ind == -1) {
          this.fillAddCell(newP);
        }
      }
    }
  }

  paintToBeFilled(): void {
    for (const p of this.fillToBePainted) {
      const action: UndoAction = {
        x: p.x,
        y: p.y,
        previous: this.design.levels[this.currentLevel()].data[p.x][p.y],
      };
      this.undoList.push(action);

      this.design.levels[this.currentLevel()].data[p.x][p.y] =
        this.currentTexture();
    }
  }

  undo(): void {
    if (this.undoList.length == 0) {
      return;
    }
    for (const action of this.undoList) {
      this.design.levels[this.currentLevel()].data[action.x][action.y] =
        action.previous;
    }
    this.undoList = [];
    this.resetAutoSave();
  }

  resetAutoSave(): void {
    window.clearTimeout(this.saveTimer);
    this.saveTimer = window.setTimeout((): void => {
      this.saveDesign();
    }, 10000);
  }

  saveDesign(): void {
    window.clearTimeout(this.saveTimer);
    this.savingDesign.set(true);
    this.as
      .updateDesign(this.design.toInterface())
      .subscribe((result: StatusResult): void => {
        this.savingDesign.set(false);
        if (result.status == 'error') {
          this.dialog.alert({
            title: 'Error',
            content:
              'There was an error when saving the design. Please try again later.',
            ok: 'Continue',
          });
        } else {
          this.snack.open('Design saved', '', {
            duration: 3000,
          });
        }
      });
  }
}
