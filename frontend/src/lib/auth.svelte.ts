import { browser } from "$app/environment";
import { STORAGE } from "./global/storage";

export interface Usuario {
	rol: RolUsuario;
	rut: string;
}

export enum RolUsuario {
	Alumno = 'alumno',
	Profesor = 'profesor',
	Visualizador = 'visualizador'
}

export const NombreUsuario = browser ? (localStorage?.getItem(STORAGE.NOMBRE_USUARIO) ?? 'Invitado') : ''
export const Usuario: { value: Usuario | null } = $state({
	value: null
});
