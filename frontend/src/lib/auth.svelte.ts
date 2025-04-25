export interface Usuario {
	nombre: string;
	pwd: string;
	imagen: string;
	rol: RolUsuario;
}

export enum RolUsuario {
	Alumno,
	Profesor,
	Visualizador
}

export const Usuario: { value: Usuario | null } = $state({
	value: null
});
