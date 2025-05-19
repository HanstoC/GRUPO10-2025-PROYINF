export interface Usuario {
	nombre?: string;
	imagen?: string;
	rol: RolUsuario;
	correo: string;
	rut: string;
}

export enum RolUsuario {
	Alumno = 'alumno',
	Profesor = 'profesor',
	Visualizador = 'visualizador'
}

export const Usuario: { value: Usuario | null } = $state({
	value: null
});
