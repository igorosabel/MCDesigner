import { Injectable } from '@angular/core';
import { DataShareService } from './data-share.service';

@Injectable()
export class UserService {
	logged: boolean = false;
	id: number = null;
	token: string = null;
	email: string = null;

	constructor(private dss: DataShareService) {}

	loadLogin() {
		const loginObj = this.dss.getGlobal('login');
		if (loginObj === null){
			this.logout();
		}
		else{
			this.logged = true;
			this.id = loginObj.id;
			this.token = loginObj.token;
			this.email = loginObj.email;
		}
	}
  
	saveLogin() {
		const loginObj = {
			status: 'ok',
			id: this.id,
			token: this.token,
			email: this.email
		};
		this.dss.setGlobal('login', loginObj);
	}
  
	logout() {
		this.logged = false;
		this.id = null;
		this.token = null;
		this.email = null;
		this.dss.removeGlobal('login');
	}
}