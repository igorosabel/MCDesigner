import { Component, OnInit } from '@angular/core';
import { UserService }       from '../../services/user.service';
import { DialogService }     from '../../services/dialog.service';
import { ApiService }        from '../../services/api.service';
import { Profile }           from '../../interfaces/interfaces';

@Component({
	selector: 'mcd-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
	saveSending: boolean = false;
	profile: Profile = {
		email: '',
		oldPass: '',
		newPass: '',
		confPass: ''
	};

	constructor(private user: UserService, private dialog: DialogService, private as: ApiService) {}

	ngOnInit(): void {
		this.profile.email = this.user.email;
	}

	updateProfile(ev) {
		ev.preventDefault();
		if (this.profile.email=='') {
			this.dialog.alert({
				title: 'Error',
				content: 'Email field is required.',
				ok: 'Continue'
			}).subscribe(result => {});
			return;
		}
		if (this.profile.oldPass!='' || this.profile.newPass!='' || this.profile.confPass!='') {
			if (this.profile.oldPass=='') {
				this.dialog.alert({
					title: 'Error',
					content: 'If you want to change your password, the current password is required.',
					ok: 'Continue'
				}).subscribe(result => {});
				return;
			}
			if (this.profile.newPass=='') {
				this.dialog.alert({
					title: 'Error',
					content: 'If you want to change your password, the new password is required.',
					ok: 'Continue'
				}).subscribe(result => {});
				return;
			}
			if (this.profile.confPass=='') {
				this.dialog.alert({
					title: 'Error',
					content: 'If you want to change your password, you have to confirm the new password.',
					ok: 'Continue'
				}).subscribe(result => {});
				return;
			}
			if (this.profile.newPass!=this.profile.confPass) {
				this.dialog.alert({
					title: 'Error',
					content: 'New password and its confirmation don\'t match.',
					ok: 'Continue'
				}).subscribe(result => {});
				return;
			}
		}

		this.saveSending = true;
		this.as.updateProfile(this.profile).subscribe(result => {
			this.saveSending = false;
			if (result.status=='ok') {
				this.user.email = this.profile.email;
				this.user.saveLogin();
				this.profile.oldPass  = '';
				this.profile.newPass  = '';
				this.profile.confPass = '';

				this.dialog.alert({
					title: 'Success',
					content: 'Profile information was successfully updated.',
					ok: 'Continue'
				}).subscribe(result => {});
			}
			if (result.status=='pass-error') {
				this.dialog.alert({
					title: 'Error',
					content: 'Current password is wrong.',
					ok: 'Continue'
				}).subscribe(result => {});
			}
			if (result.status=='error') {
				this.dialog.alert({
					title: 'Error',
					content: 'There was an error updating your user profile. Please try again later.',
					ok: 'Continue'
				}).subscribe(result => {});
			}
		});
	}
}