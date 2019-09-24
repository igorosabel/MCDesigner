import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { Design, Color } from '../../interfaces/interfaces';
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
	currentLevel: number = 0;
	levelsDeployed: boolean = false;
	colorList: Color[] = [
		{id: 0, name: 'White', color: '#fff'},
		{id: 1, name: 'Black', color: '#000'},
		{id: 2, name: 'Red',   color: '#f00'},
		{id: 3, name: 'Blue',  color: '#00f'}
	];
	selectedColor: number = 0;
	showRulers: boolean = false;
	zoomLevel: number = 100;
	savingDesign: boolean = false;

	constructor(private activatedRoute: ActivatedRoute, private as: ApiService, private cs: CommonService, private dialog: DialogService, private router: Router) {}
	ngOnInit() {
		this.activatedRoute.params.subscribe((params: Params) => {
			this.loadDesign(params.id);
		});
	}
	
	loadDesign(id: number) {
		console.log(id);
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
	
	deployLevels() {
		this.levelsDeployed = !this.levelsDeployed;
	}
	
	selectColor(color: Color) {
		this.selectedColor = color.id;
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
		this.design.levels[this.currentLevel].data[i][j] = this.selectedColor;
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