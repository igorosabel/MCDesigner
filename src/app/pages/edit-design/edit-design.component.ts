import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
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
	selectedTool = {
		option: 'paint',
		name: 'Paint'
	};
	zoomLevel: number = 100;
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

	constructor(private activatedRoute: ActivatedRoute, private as: ApiService, private cs: CommonService, private dialog: DialogService, private router: Router) {}
	ngOnInit() {
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
			}
			else{
				this.dialog.alert({title: 'Error', content: 'There was an error when loading the required design. Please try again later.', ok: 'Continue'}).subscribe(result => {
					this.router.navigate(['/main']);
				});
			}
		});
	}
	
	selectOption(option: string, name: string) {
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
	
	adjustZoom(ev: any, mode: string) {
		ev.preventDefault();
		if (mode=='l'){
			if (this.zoomLevel==10){
				return false;
			}
			this.zoomLevel -= 10;
		}
		if (mode=='m'){
			if (this.zoomLevel==200){
				return false;
			}
			this.zoomLevel += 10;
		}
	}
	
	selectCell(i: number, j: number) {
		switch (this.selectedTool.option) {
			case 'paint': {
				this.design.levels[this.currentLevel].data[i][j] = this.currentTexture;
			}
			break;
			case 'picker': {
				this.currentTexture = this.design.levels[this.currentLevel].data[i][j];
			}
			break;
		}
	}
	
	saveDesign() {
		this.savingDesign = true;
		this.as.updateDesign(this.design).subscribe(result => {
			this.savingDesign = false;
			if (result.status=='error'){
				this.dialog.alert({title: 'Error', content: 'There was an error when saving the design. Please try again later.', ok: 'Continue'}).subscribe(result => {});
			}
		});
	}
}