import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Design, Texture } from '../../interfaces/interfaces';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { DialogService }     from '../../services/dialog.service';

@Component({
  selector: 'mcd-edit-design',
  templateUrl: './edit-design.component.html',
  styleUrls: ['./edit-design.component.css']
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
	
	initialPosition = { x: 100, y: 100 };
	position = { ...this.initialPosition };
	offset = { x: 0, y: 0 };

	toolsClosed: boolean = false;
	selectedTool = {
		option: 'paint',
		name: 'Paint'
	};
	zoomLevel: number = 100;
	line = {start: {x: -1, y: -1}, end: {x: -1, y: -1}};
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

	constructor(private activatedRoute: ActivatedRoute, private as: ApiService, private cs: CommonService, private dialog: DialogService, private router: Router, private snack: MatSnackBar) {}
	ngOnInit() {
		if (localStorage.getItem('position_x') && localStorage.getItem('position_y')){
			this.initialPosition.x = parseInt(localStorage.getItem('position_x'));
			this.initialPosition.y = parseInt(localStorage.getItem('position_y'));
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
	
	closeTools() {
		this.toolsClosed = !this.toolsClosed;
	}
	
	toolsDragEnd(event: CdkDragEnd) {
		const transform = this.toolBox.nativeElement.style.transform;
		let regex = /translate3d\(\s?(?<x>[-]?\d*)px,\s?(?<y>[-]?\d*)px,\s?(?<z>[-]?\d*)px\)/;
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
	
	deployLevels() {
		this.showLevels = !this.showLevels;
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
				this.design.levels[this.currentLevel].data[i][j] = this.currentTexture;
				this.resetAutoSave();
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
					this.resetAutoSave();
				}
			}
			break;
		}
	}
	
	resetLine() {
		this.line.start = {x: -1, y: -1};
		this.line.end = {x: -1, y: -1};
	}
	
	drawLine() {
		console.log(this.line);
	}

	resetAutoSave() {
		clearTimeout(this.saveTimer);
		this.saveTimer = window.setTimeout(() => { this.saveDesign(); }, 10000); 
	}

	saveDesign() {
		this.savingDesign = true;
		this.as.updateDesign(this.design).subscribe(result => {
			this.savingDesign = false;
			if (result.status=='error'){
				this.dialog.alert({title: 'Error', content: 'There was an error when saving the design. Please try again later.', ok: 'Continue'}).subscribe(result => {});
			}
			else {
				this.snack.open('Design saved');
			}
		});
	}
}