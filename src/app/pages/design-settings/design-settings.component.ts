import { Component, OnInit }             from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { Design }                        from '../../interfaces/interfaces';
import { CommonService }                 from '../../services/common.service';
import { ApiService }                    from '../../services/api.service';
import { DialogService }                 from '../../services/dialog.service';

@Component({
	selector: 'mcd-design-settings',
	templateUrl: './design-settings.component.html',
	styleUrls: ['./design-settings.component.scss']
})
export class DesignSettingsComponent implements OnInit {
	designLoading: boolean = true;
	initialSizeX: number = 0;
	initialSizeY: number = 0;
	design: Design = {
		id: null,
		name: 'Cargando...',
		slug: 'cargando',
		sizeX: 0,
		sizeY: 0,
		levels: []
	};
	saveSending: boolean = false;

	constructor(private activatedRoute: ActivatedRoute, private router: Router, private cs: CommonService, private as: ApiService, private dialog: DialogService) {}

	ngOnInit(): void {
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

				this.initialSizeX = result.design.sizeX;
				this.initialSizeY = result.design.sizeY;
			}
			else{
				this.dialog.alert({title: 'Error', content: 'There was an error when loading the required design. Please try again later.', ok: 'Continue'}).subscribe(result => {
					this.router.navigate(['/main']);
				});
			}
		});
	}

	updateDesign(ev) {
		ev.preventDefault();
		if (this.design.name=='') {
			this.dialog.alert({title: 'Error', content: 'Name is required.', ok: 'Continue'}).subscribe(result => {});
			return;
		}
		if (isNaN(this.design.sizeX) || this.design.sizeX==null || isNaN(this.design.sizeY) || this.design.sizeY==null) {
			this.dialog.alert({title: 'Error', content: 'Size is required.', ok: 'Continue'}).subscribe(result => {});
			return;
		}
		if (this.design.sizeX<this.initialSizeX || this.design.sizeY<this.initialSizeY) {
			this.dialog.confirm({
				title: 'Confirm',
				content: 'Designs original size was bigger than entered and data could be lost. Are you sure you want to continue?',
				ok: 'Continue',
				cancel: 'Cancel'
			}).subscribe(result => {
				if (result===true) {
					this.confirmUpdate();
				}
			});
			return;
		}
		this.confirmUpdate();
	}
	
	confirmUpdate() {
		this.saveSending = true;
		this.as.updateDesignSettings(this.design).subscribe(result => {
			this.saveSending = false;
			if (result.status=='ok') {
				this.dialog.alert({title: 'Success', content: 'Design settings have been updated.', ok: 'Continue'}).subscribe(result => {});
			}
			else{
				this.dialog.alert({title: 'Error', content: 'There was an error updating the design. Please try again later.', ok: 'Continue'}).subscribe(result => {});
			}
		});
	}
}