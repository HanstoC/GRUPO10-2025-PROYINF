export type Usuario = { [key: string]: any };

export enum RolUsuario {
	Alumno = 'alumno',
	Profesor = 'profesor',
	Visualizador = 'visualizador'
}

// Clave para localStorage
const LOCAL_STORAGE_KEY = 'app_local_user_data';

// Función para obtener el valor inicial desde localStorage
function getInitialUser(): Usuario | null {
	if (typeof window === 'undefined') {
		return null;
	}
	const storedValue = localStorage.getItem(LOCAL_STORAGE_KEY);
	if (storedValue) {
		try {
			return JSON.parse(storedValue);
		} catch (e) {
			console.error("Error al cargar usuario desde localStorage:", e);
			localStorage.removeItem(LOCAL_STORAGE_KEY); // Limpiar datos corruptos
			return null;
		}
	}
	return null;
}

// Función para guardar el valor en localStorage
function saveUser(user: Usuario | null) {
	if (typeof window === 'undefined') {
		return;
	}
	if (user) {
		localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
	} else {
		localStorage.removeItem(LOCAL_STORAGE_KEY);
	}
}

const userState: { value: Usuario | null } = $state({
	value: getInitialUser()
});

export const Usuario = {
	get value(): Usuario | null {
		return userState.value;
	},
	set value(newUser: Usuario | null) {
		userState.value = newUser; // Actualiza el estado reactivo interno
		saveUser(newUser);        // Sincroniza con localStorage
	}
};