import { Usuario } from "$lib/auth.svelte";
import { API_URL } from "./base";

const API_BASE = API_URL + 'login/'

export const AuthService = {
    async login(rut: string, contraseña: string) {
        rut = rut.replace(/[^\d-]/g, '').trim()

        const response = await fetch(API_URL + 'login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ rut, contraseña }),
            credentials: 'include'
        });

        const text = await response.text();
        let payload: any = null;

        try {
            payload = text ? JSON.parse(text) : null;
        } catch {
            payload = text;
        }

        if (!response.ok) {
            const errMsg =
                (payload && (payload.error || payload.message)) ||
                (typeof payload === 'string' && payload) ||
                `Login failed (${response.status})`;
            throw new Error(errMsg);
        }

        const user = payload?.user ?? payload?.User ?? payload;
        if (!user)
            throw new Error('Respuesta inválida del servidor');

        if (user.tipo == 'alumno') {
            Usuario.value = {
                rut,
                id: user.id,
                nombre: user.nombre,
                rol: user.tipo,
                correo: user.correo,
                curso: user.curso,
                asistencia: user.asistencia,
                apoderado: user.apoderado,
                direccion: user.direccion,
                fecha_nacimiento: user.fecha_nacimiento,
                genero: user.genero,
                situacion_alumno: user.situacion_alumno,
                tipo_ensenanza: user.tipo_ensenanza
            };
        } else
            Usuario.value = {
                rut,
                id: user.id,
                nombre: user.nombre,
                rol: user.tipo,
                correo: user.correo
            }

        return Usuario.value;
    },
    async checkLogged() {
        const response = await fetch(API_BASE + 'check-session', { credentials: 'include' });
        const text = await response.text();
        let payload = null;
        try { payload = text ? JSON.parse(text) : null; } catch { payload = text; }

        if (!response.ok) throw payload;

        const user = payload?.user ?? payload;
        if (!user) return false;
        return true;
    },
    async logout() {
        try {
            await fetch(API_BASE + 'logout', {
                credentials: 'include'
            });
        } catch (err) {
            console.warn('logout error', err)
        }
        Usuario.value = null;
    }
}