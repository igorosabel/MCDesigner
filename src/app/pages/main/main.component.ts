import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';
import { ApiService }        from '../../services/api.service';
import { Design }            from '../../interfaces/interfaces';
import { DialogService }     from '../../services/dialog.service';
import { UserService }       from '../../services/user.service';

@Component({
  selector: 'mcd-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
	designList: Design[] = [];
	designsEdit: boolean = false;

	constructor(private router: Router, private as: ApiService, private dialog: DialogService, private user: UserService) {}

	ngOnInit() {
		this.as.loadDesigns().subscribe(result => {
			this.designList = result.list;
		});
	}

	logout(ev) {
		ev.preventDefault();
		this.user.logout();
		this.router.navigate(['/']);
	}

	editDesigns() {
		this.designsEdit = !this.designsEdit;
	}

	deleteDesign(design: Design) {
		this.dialog.confirm({
			title: 'Delete design',
			content: 'Are you sure you want to delete this design?',
			ok: 'Continue',
			cancel: 'Cancel'
		}).subscribe(result => {
			if (result===true) {
				this.as.deleteDesign(design.id).subscribe(result => {
					if (result.status=='ok') {
						this.dialog.alert({title:'Success', content:'Design "'+design.name+'" has been deleted.', ok:'Continue'}).subscribe(result => {});
						const ind = this.designList.findIndex(x => x.id==design.id);
						this.designList.splice(ind, 1);
					}
					else {
						this.dialog.alert({title:'Error', content:'There was an error attempting to delete the design. Please try again.', ok:'Continue'}).subscribe(result => {});
					}
				});
			}
		});
	}
}