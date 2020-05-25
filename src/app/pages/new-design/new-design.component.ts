import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';
import { Design }            from '../../interfaces/interfaces';
import { ApiService }        from '../../services/api.service';
import { DialogService }     from '../../services/dialog.service';

@Component({
  selector: 'mcd-new-design',
  templateUrl: './new-design.component.html',
  styleUrls: []
})
export class NewDesignComponent implements OnInit {
	newDesign = {
		id: null,
		name: 'New design',
		slug: null,
		sizeX: 50,
		sizeY: 50
	} as Design;
	saveSending: boolean = false;

	constructor(private dialog: DialogService, private as: ApiService, private router: Router) {}
	ngOnInit() {}
	
	saveDesign(ev){
		ev.preventDefault();
		this.saveSending = true;
		this.as.newDesign(this.newDesign).subscribe(result => {
			if (result.status=='ok'){
				this.dialog.alert({title: 'OK', content: 'New design "'+this.newDesign.name+'" has been saved.', ok: 'Continue'}).subscribe(result => {
					this.router.navigate(['/main']);
				});
			}
			else{
				this.dialog.alert({title: 'Error', content: 'There was an error when saving the new design. Please try again later.', ok: 'Continue'}).subscribe(result => {});
			}
		});
	}
}