import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable }              from '@angular/core';
import { Observable }              from 'rxjs';
import { environment }             from '../../environments/environment';

import {
	LoginData,
	LoginResult,
	RegisterData,
	DesignListResult,
	Design,
	StatusResult,
	DesignResult,
	LevelData,
	LevelResult,
	Profile
} from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
	apiUrl = environment.apiUrl;

	constructor(private http : HttpClient){}

	login(data: LoginData): Observable<LoginResult> {
		return this.http.post<LoginResult>(this.apiUrl + 'login', data);
	}

	register(data: RegisterData): Observable<LoginResult> {
		return this.http.post<LoginResult>(this.apiUrl + 'register', data);
	}

	updateProfile(profile: Profile): Observable<StatusResult> {
		return this.http.post<StatusResult>(this.apiUrl + 'update-profile', profile);
	}

	loadDesigns(): Observable<DesignListResult> {
		return this.http.post<DesignListResult>(this.apiUrl + 'load-designs', {});
	}

	deleteDesign(id: number): Observable<StatusResult> {
		return this.http.post<StatusResult>(this.apiUrl + 'delete-design', {id});
	}
	
	updateDesignSettings(design: Design): Observable<StatusResult> {
		return this.http.post<StatusResult>(this.apiUrl + 'update-design-settings', design);
	}

	newDesign(newDesign: Design): Observable<StatusResult> {
		return this.http.post<StatusResult>(this.apiUrl + 'new-design', newDesign);
	}

	loadDesign(id: number): Observable<DesignResult> {
		return this.http.post<DesignResult>(this.apiUrl + 'design', {id});
	}

	updateDesign(design: Design): Observable<StatusResult> {
		return this.http.post<StatusResult>(this.apiUrl + 'update-design', design);
	}

	addNewLevel(newLevel: LevelData): Observable<LevelResult> {
		return this.http.post<LevelResult>(this.apiUrl + 'new-level', newLevel);
	}

	renameLevel(levelData: LevelData): Observable<StatusResult> {
		return this.http.post<StatusResult>(this.apiUrl + 'rename-level', levelData);
	}

	copyLevel(id: number): Observable<LevelResult> {
		return this.http.post<LevelResult>(this.apiUrl + 'copy-level', {id});
	}
	
	deleteLevel(id: number): Observable<StatusResult> {
		return this.http.post<StatusResult>(this.apiUrl + 'delete-level', {id});
	}
}