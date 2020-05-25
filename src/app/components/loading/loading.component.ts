import { Component, Input } from '@angular/core';

@Component({
	selector: 'mcd-loading',
	templateUrl: './loading.component.html',
	styleUrls: ['./loading.component.scss']
})
export class LoadingComponent {
	@Input('big') big: boolean = false;
	constructor() { }
}