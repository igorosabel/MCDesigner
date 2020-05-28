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

export interface Profile {
	email: string;
	oldPass: string;
	newPass: string;
	confPass: string;
}

export interface Level {
	id: number;
	name: string;
	height: number;
	data: number[][];
}

export interface Design {
	id: number;
	name: string;
	slug: string;
	sizeX: number;
	sizeY: number;
	levels?: Level[];
}

export interface DesignListResult {
	status: string;
	list: Design[];
}

export interface DesignResult {
	status: string;
	design: Design;
}

export interface StatusResult {
  status: string;
}

export interface LevelData {
	id: number;
	idDesign: number;
	name: string;
}

export interface LevelResult {
	status: string;
	level: Level;
}

export interface Texture {
	id: number;
	name: string;
}

export interface Point {
	x: number;
	y: number;
}

export interface Line {
	start: Point;
	end: Point;
}

export interface UndoAction {
	x: number;
	y: number;
	previous: number;
}