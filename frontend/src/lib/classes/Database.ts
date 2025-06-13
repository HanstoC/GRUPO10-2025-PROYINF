import { RolUsuario, Usuario } from "$lib/auth.svelte";
import { API } from "$lib/global/api";

const STORAGE_KEY = 'user_session';

export default class Database {
    public static async login(rut: string, contraseña: string) {
        rut = rut.replace(/[^\d-]/g, '')

        const response = await fetch(API.LOGIN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ rut, contraseña })
        });

        if (!response.ok) {
            const { error } = await response
                .json()
                .catch(async () => ({ error: await response.text() }));
            throw error
        }

        const { message, user } = await response.json();
        console.debug(message);

        const userData = {
            id: user.id,
            rut,
            correo: user.correo,
            rol: user.tipo,
            imagen: '',
            nombre: user.nombre,
            ...(user.tipo === 'alumno' && {
                apoderado: user.apoderado,
                asistencia: user.asistencia,
                curso: user.curso,
                direccion: user.direccion,
                fecha_nacimiento: user.fecha_nacimiento,
                genero: user.genero,
                situacion_alumno: user.situacion_alumno,
                tipo_ensenanza: user.tipo_ensenanza
            })
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));

        Usuario.value = userData;
    }

    public static logout() {
        localStorage.removeItem(STORAGE_KEY);
        
        Usuario.value = null;
    }

    public static restoreSession(): boolean {
        try {
            const storedData = localStorage.getItem(STORAGE_KEY);
            if (!storedData) return false;

            const userData = JSON.parse(storedData);
            
            if (!userData.rut || !userData.correo || !userData.rol) {
                this.logout();
                return false;
            }

            Usuario.value = userData;
            return true;
        } catch (error) {
            console.error('Error restoring session:', error);
            this.logout();
            return false;
        }
    }
}