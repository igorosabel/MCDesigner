import { Component, OnInit } from '@angular/core';
import { Design } from '../../interfaces/interfaces';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'mcd-new-design',
  templateUrl: './new-design.component.html',
  styleUrls: ['./new-design.component.css']
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

	constructor(private as: ApiService) {}
	ngOnInit() {}
	
	saveDesign(ev){
		ev.preventDefault();
		this.saveSending = true;
		this.as.newDesign(this.newDesign).subscribe(result => {
			
		});
	}
}