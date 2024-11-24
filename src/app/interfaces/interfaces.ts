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

export interface UserInterface {
  id: number;
  token: string | null;
  email: string | null;
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

export interface LevelInterface {
  id: number;
  name: string | null;
  height: number;
  data: number[][];
}

export interface DesignInterface {
  id: number;
  name: string | null;
  slug: string;
  sizeX: number;
  sizeY: number;
  levels?: LevelInterface[];
}

export interface DesignListResult {
  status: string;
  list: DesignInterface[];
}

export interface DesignResult {
  status: string;
  design: DesignInterface;
}

export interface StatusResult {
  status: string;
}

export interface LevelData {
  id: number;
  idDesign: number;
  name: string | null;
}

export interface LevelResult {
  status: string;
  level: LevelInterface;
}

export interface TextureInterface {
  id: number;
  name: string;
}

export interface PointInterface {
  x: number;
  y: number;
}

export interface LineInterface {
  start: PointInterface;
  end: PointInterface;
}

export interface UndoAction {
  x: number;
  y: number;
  previous: number;
}

export interface ToolInterface {
  option: string;
  name: string;
}
