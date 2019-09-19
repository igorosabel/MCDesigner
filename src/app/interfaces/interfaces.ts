export interface DialogField {
	title: string;
	type: string;
	value: string;
	hint?: string;
}

export interface DialogOptions {
	title: string;
	content: string;
	fields?: DialogField[];
	ok: string;
	cancel?: string;
}

export interface LoginData {
	email: string;
	pass: string;
}

export interface LoginResult {
	status: string;
	id: number;
	token: string;
}

export interface RegisterData {
	email: string;
	pass: string;
	conf: string;
}

export interface Design {
	id: number;
	name: string;
	slug: string;
	sizeX: number;
	sizeY: number;
}

export interface DesignResult {
	status: string;
	list: Design[];
}