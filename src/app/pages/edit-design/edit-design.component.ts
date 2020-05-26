import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, Params}            from '@angular/router';
import { CdkDragEnd }                               from '@angular/cdk/drag-drop';
import { MatSnackBar }                              from '@angular/material/snack-bar';
import { ApiService }                               from '../../services/api.service';
import { CommonService }                            from '../../services/common.service';
import { DialogService }                            from '../../services/dialog.service';
import {
	Design,
	Texture,
	Point,
	Line,
	Level,
	LevelData,
	UndoAction
} from '../../interfaces/interfaces';

@Component({
  selector: 'mcd-edit-design',
  templateUrl: './edit-design.component.html',
  styleUrls: ['./edit-design.component.scss']
})
export class EditDesignComponent implements OnInit {
	designLoading: boolean = true;
	design: Design = {
		id: null,
		name: 'Cargando...',
		slug: 'cargando',
		sizeX: 0,
		sizeY: 0,
		levels: []
	};
	rowWidth: number = 0;
	
	@ViewChild("toolBox", {static: true}) toolBox: ElementRef;
	
	initialPosition: Point = { x: 0, y: 0 };
	position = { ...this.initialPosition };
	offset = { x: 0, y: 0 };

	toolsClosed: boolean = false;
	mobileToolsClosed: boolean = false;
	selectedTool = {
		option: 'paint',
		name: 'Paint'
	};
	zoomLevel: number = 100;
	line: Line = {start: {x: -1, y: -1} as Point, end: {x: -1, y: -1} as Point};
	showRulers: boolean = false;
	textures: Texture[] = [
		{id: 0, name: 'Blank'},
		{id: 1, name: 'Cobblestone'},
		{id: 2, name: 'Dirt'},
		{id: 3, name: 'Cobblestone (built)'},
		{id: 4, name: 'Wood planks'},
		{id: 5, name: 'Sand'},
		{id: 6, name: 'Gravel'},
		{id: 7, name: 'Gold ore'},
		{id: 8, name: 'Iron ore'},
		{id: 9, name: 'Wood'},
		{id: 10, name: 'Snow'},
		{id: 11, name: 'Water'},
		{id: 12, name: 'Stone wall'},
		{id: 13, name: 'Sandstone'},
		{id: 14, name: 'Dark wood'},
		{id: 15, name: 'Andesite'},
		{id: 16, name: 'Dandelion'},
		{id: 17, name: 'Poppy'},
		{id: 18, name: 'Mushroom'},
		{id: 19, name: 'Red mushrooom'},
		{id: 20, name: 'Gold block'},
		{id: 21, name: 'Snow block'},
		{id: 22, name: 'Stone bricks'},
		{id: 23, name: 'Red bricks'},
		{id: 24, name: 'TNT'},
		{id: 25, name: 'Book shelf'},
		{id: 26, name: 'Limestone'},
		{id: 27, name: 'Obsidian'},
		{id: 28, name: 'Torch'},
		{id: 29, name: 'Chest'},
		{id: 30, name: 'Ice block'},
		{id: 31, name: 'Workbench'},
		{id: 32, name: 'Furnace'},
		{id: 33, name: 'Stair'},
		{id: 34, name: 'Railroad'},
		{id: 35, name: 'Redstone torch'},
		{id: 36, name: 'Wool'},
		{id: 37, name: 'Cactus'},
		{id: 38, name: 'Infested stone'},
		{id: 39, name: 'Jukebox'},
		{id: 40, name: 'Wall torch'},
		{id: 41, name: 'Halloween pumpkin'},
		{id: 42, name: 'Granite'},
		{id: 43, name: 'Soulsand'},
		{id: 44, name: 'Glowstone'}
	];
	currentTexture: number = 0;
	currentLevel: number = 0;
	showLevels: boolean = false;
	showTextures: boolean = false;
	savingDesign: boolean = false;
	saveTimer: number = null;
	
	undoList: UndoAction[] = [];

	fillTexture: number = null;
	fillToBePainted: Point[] = [];

	constructor(private activatedRoute: ActivatedRoute, private as: ApiService, private cs: CommonService, private dialog: DialogService, private router: Router, private snack: MatSnackBar) {}

	ngOnInit() {
		if (window.innerWidth<600) {
			this.initialPosition.x = 0;
			this.initialPosition.y = 64;
		}
		else {
			if (localStorage.getItem('position_x') && localStorage.getItem('position_y')) {
				this.initialPosition.x = parseInt(localStorage.getItem('position_x'));
				this.initialPosition.y = parseInt(localStorage.getItem('position_y'));
			}
			else {
				this.initialPosition.x = 100;
				this.initialPosition.y = 100;
			}
		}
		this.activatedRoute.params.subscribe((params: Params) => {
			this.loadDesign(params.id);
		});
	}
	
	loadDesign(id: number) {
		this.as.loadDesign(id).subscribe(result => {
			this.designLoading = false;
			if (result.status=='ok'){
				this.design.id = result.design.id;
				this.design.name = this.cs.urldecode(result.design.name);
				this.design.slug = result.design.slug;
				this.design.sizeX = result.design.sizeX;
				this.design.sizeY = result.design.sizeY;
				this.design.levels = [];
				for (let level of result.design.levels){
					level.name = this.cs.urldecode(level.name);
					this.design.levels.push(level);
				}
				this.updateRowWidth();
			}
			else{
				this.dialog.alert({title: 'Error', content: 'There was an error when loading the required design. Please try again later.', ok: 'Continue'}).subscribe(result => {
					this.router.navigate(['/main']);
				});
			}
		});
	}
	
	updateRowWidth() {
		this.rowWidth = this.design.levels[0].data[0].length * (this.zoomLevel * 0.2);
	}
	
	mobileCloseTools() {
		this.mobileToolsClosed = !this.mobileToolsClosed;
	}
	
	closeTools() {
		this.toolsClosed = !this.toolsClosed;
	}
	
	toolsDragEnd(event: CdkDragEnd) {
		const transform = this.toolBox.nativeElement.style.transform;
		const regex = /translate3d\(\s?(?<x>[-]?\d*)px,\s?(?<y>[-]?\d*)px,\s?(?<z>[-]?\d*)px\)/;
		const values = regex.exec(transform);

		this.offset = { x: parseInt(values[1]), y: parseInt(values[2]) };

		this.position.x = this.initialPosition.x + this.offset.x;
		this.position.y = this.initialPosition.y + this.offset.y;
		
		localStorage.setItem('position_x', this.position.x.toString());
		localStorage.setItem('position_y', this.position.y.toString());
	}
	
	selectOption(option: string, name: string) {
		if (this.selectedTool.option=='line' && option!='line') {
			this.resetLine();
		}
		this.selectedTool.option = option;
		this.selectedTool.name = name;
	}
	
	openTextures() {
		this.showTextures = !this.showTextures;
	}
	
	selectTexture(texture: Texture) {
		this.currentTexture = this.textures.findIndex(x => x.id==texture.id);
		this.openTextures();
	}

	addNewLevel() {
		this.dialog.form({
			title: 'Add new level',
			content: 'Enter the name of the new level',
			ok: 'Continue',
			cancel: 'Cancel',
			fields: [{
				title: 'Name',
				type: 'text',
				value: ''
			}]
		}).subscribe(result => {
			if (result) {
				if (!result[0].value) {
					this.dialog.alert({title:'Error', content:'Name of the new level is required.', ok:'Continue'}).subscribe(result => {});
				}
				else {
					const newLevel: LevelData = {
						id: null,
						idDesign: this.design.id,
						name: result[0].value
					}
					this.as.addNewLevel(newLevel).subscribe(result => {
						if (result.status=='ok') {
							this.dialog.alert({title:'Success', content:'New level "'+newLevel.name+'" has been added.', ok:'Continue'}).subscribe(result => {});
							result.level.name = this.cs.urldecode(result.level.name);
							this.design.levels.push(result.level);
						}
					});
				}
			}
		});
	}
	
	deployLevels() {
		this.showLevels = !this.showLevels;
	}

	selectLevel(level: Level) {
		this.currentLevel = this.design.levels.findIndex(x => x.id==level.id);
		this.deployLevels();
	}

	renameLevel(level: Level) {
		this.dialog.form({
			title: 'Rename level',
			content: 'Enter the new name of this level',
			ok: 'Continue',
			cancel: 'Cancel',
			fields: [{
				title: 'Name',
				type: 'text',
				value: level.name
			}]
		}).subscribe(result => {
			if (result) {
				if (!result[0].value) {
					this.dialog.alert({title:'Error', content:'Name of the new level is required.', ok:'Continue'}).subscribe(result => {});
				}
				else {
					const levelData: LevelData = {
						id: level.id,
						idDesign: this.design.id,
						name: result[0].value
					}
					this.as.renameLevel(levelData).subscribe(result => {
						if (result.status=='ok') {
							this.dialog.alert({title:'Success', content:'Level has been renamed to "'+levelData.name+'"', ok:'Continue'}).subscribe(result => {});
							const ind = this.design.levels.findIndex(x => x.id==level.id);
							this.design.levels[ind].name = levelData.name;
						}
						else {
							this.dialog.alert({title:'Error', content:'There was an error attempting to change the name of the level. Please try again.', ok:'Continue'}).subscribe(result => {});
						}
					});
				}
			}
		});
	}

	copyLevel(level: Level) {
		this.dialog.confirm({
			title: 'Copy level',
			content: 'Are you sure you want to copy this level?',
			ok: 'Continue',
			cancel: 'Cancel'
		}).subscribe(result => {
			if (result===true) {
				this.as.copyLevel(level.id).subscribe(result => {
					if (result.status=='ok') {
						result.level.name = this.cs.urldecode(result.level.name);
						this.dialog.alert({title:'Success', content:'New level "'+result.level.name+'" has been added.', ok:'Continue'}).subscribe(result => {});
						this.design.levels.push(result.level);
					}
					else {
						this.dialog.alert({title:'Error', content:'There was an error attempting to copy the level. Please try again.', ok:'Continue'}).subscribe(result => {});
					}
				});
			}
		});
	}

	deleteLevel(level: Level) {
		this.dialog.confirm({
			title: 'Delete level',
			content: 'Are you sure you want to delete this level?',
			ok: 'Continue',
			cancel: 'Cancel'
		}).subscribe(result => {
			if (result===true) {
				this.as.deleteLevel(level.id).subscribe(result => {
					if (result.status=='ok') {
						this.dialog.alert({title:'Success', content:'Level "'+level.name+'" has been deleted.', ok:'Continue'}).subscribe(result => {});
						const ind = this.design.levels.findIndex(x => x.id==level.id);
						if (ind==this.currentLevel) {
							this.currentLevel = 0;
						}
						this.design.levels.splice(ind, 1);
					}
					else {
						this.dialog.alert({title:'Error', content:'There was an error attempting to delete the level. Please try again.', ok:'Continue'}).subscribe(result => {});
					}
				});
			}
		});
	}

	changeRulers() {
		this.showRulers = !this.showRulers;
	}

	adjustZoom(mode: string) {
		if (mode=='l') {
			if (this.zoomLevel==10) {
				return false;
			}
			this.zoomLevel -= 10;
		}
		if (mode=='r') {
			this.zoomLevel = 100;
		}
		if (mode=='m') {
			if (this.zoomLevel==200) {
				return false;
			}
			this.zoomLevel += 10;
		}
		this.updateRowWidth();
	}
	
	selectCell(i: number, j: number) {
		switch (this.selectedTool.option) {
			case 'paint': {
				if (this.design.levels[this.currentLevel].data[i][j] != this.currentTexture) {
					const action: UndoAction = {
						x: i,
						y: j,
						previous: this.design.levels[this.currentLevel].data[i][j]
					};
					this.undoList = [action];

					this.design.levels[this.currentLevel].data[i][j] = this.currentTexture;
					this.resetAutoSave();
				}
			}
			break;
			case 'picker': {
				this.currentTexture = this.design.levels[this.currentLevel].data[i][j];
			}
			break;
			case 'line': {
				if (this.line.start.x==-1 && this.line.start.y==-1) {
					this.line.start.x = i;
					this.line.start.y = j;
				}
				else {
					this.line.end.x = i;
					this.line.end.y = j;
					this.drawLine();
					this.resetLine();
					this.resetAutoSave();
				}
			}
			break;
			case 'fill': {
				this.fillTexture     = this.design.levels[this.currentLevel].data[i][j];
				this.fillToBePainted = [];
				this.undoList        = [];

				const p: Point = {x: i, y: j};
				this.fillAddCell(p);
				this.paintToBeFilled();
			}
			break;
		}
	}
	
	resetLine() {
		this.line.start = {x: -1, y: -1};
		this.line.end = {x: -1, y: -1};
	}

	generatePath(p0: Point, p1: Point) {
		const points: Point[] = [];
		const dx = p1.x - p0.x;
		const dy = p1.y - p0.y;
		const N = Math.max(Math.abs(dx), Math.abs(dy));
		const divN = (N == 0) ? 0 : 1 / N;
		const xstep = dx * divN;
		const ystep = dy * divN;
		let x = p0.x;
		let y = p0.y;
		for (let step = 0; step <= N; step++, x += xstep, y += ystep) {
			points.push({x: Math.round(x), y: Math.round(y)} as Point);
		}
		return points;
	}

	drawLine() {
		const coordinates: Point[] = this.generatePath(this.line.start, this.line.end);
		this.undoList = [];
		for (let p of coordinates) {
			if (this.design.levels[this.currentLevel].data[p.x][p.y] != this.currentTexture) {
				let action: UndoAction = {
					x: p.x,
					y: p.y,
					previous: this.design.levels[this.currentLevel].data[p.x][p.y]
				};
				this.undoList.push(action);

				this.design.levels[this.currentLevel].data[p.x][p.y] = this.currentTexture;
			}
		}
	}

	getSurroundingCells(p: Point) {
		let surrounding = [];
		for (let x=(p.x -1); x<=(p.x +1); x++) {
			for (let y=(p.y -1); y<=(p.y +1); y++) {
				if ( (x!=p.x || y!=p.y) && (x>=0) && (y>=0) && (x<this.design.sizeX) && (y<this.design.sizeY)) {
					let point: Point = {x, y};
					surrounding.push(point);
				}
			}
		}
		return surrounding;
	}

	fillAddCell(p: Point) {
		this.fillToBePainted.push(p);

		const surrounding = this.getSurroundingCells(p);
		for (let newP of surrounding) {
			if (this.design.levels[this.currentLevel].data[newP.x][newP.y]==this.fillTexture) {
				const ind = this.fillToBePainted.findIndex(e => e.x==newP.x && e.y==newP.y);
				if (ind==-1) {
					this.fillAddCell(newP);
				}
			}
		}
	}
	
	paintToBeFilled() {
		for (let p of this.fillToBePainted) {
			let action: UndoAction = {
				x: p.x,
				y: p.y,
				previous: this.design.levels[this.currentLevel].data[p.x][p.y]
			};
			this.undoList.push(action);

			this.design.levels[this.currentLevel].data[p.x][p.y] = this.currentTexture;
		}
	}

	undo() {
		if (this.undoList.length==0) {
			return;
		}
		for (let action of this.undoList) {
			this.design.levels[this.currentLevel].data[action.x][action.y] = action.previous;
		}
		this.undoList = [];
		this.resetAutoSave();
	}

	resetAutoSave() {
		clearTimeout(this.saveTimer);
		this.saveTimer = window.setTimeout(() => { this.saveDesign(); }, 10000); 
	}

	saveDesign() {
		clearTimeout(this.saveTimer);
		this.savingDesign = true;
		this.as.updateDesign(this.design).subscribe(result => {
			this.savingDesign = false;
			if (result.status=='error'){
				this.dialog.alert({title: 'Error', content: 'There was an error when saving the design. Please try again later.', ok: 'Continue'}).subscribe(result => {});
			}
			else {
				this.snack.open('Design saved', '', {
					duration: 3000,
				});
			}
		});
	}
}