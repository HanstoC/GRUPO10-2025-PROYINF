import { browser } from "$app/environment";
import { STORAGE } from "./global/storage";

export type Usuario = { [key: string]: any };

export enum RolUsuario {
	Alumno = 'alumno',
	Profesor = 'profesor',
	Visualizador = 'visualizador'
}

export const Usuario: { value: Usuario | null } = $state({
	value: null
});
