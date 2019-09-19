import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Design } from '../../interfaces/interfaces';

@Component({
  selector: 'mcd-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
	designList: Design[] = [];

	constructor(private as: ApiService) {}
	ngOnInit() {
		this.as.loadDesigns().subscribe(result => {
			this.designList = result.list;
		});
	}
}