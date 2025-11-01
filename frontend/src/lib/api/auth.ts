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

        const { tipo, ...data } = user;

        Usuario.value = {
            rut,
            rol: tipo,
            ...data
        }

        return Usuario.value;
    },
    async checkLogged() {
        const response = await fetch(API_BASE + 'check-session', { credentials: 'include' });
        const text = await response.text();
        let payload: any = null;
        try { payload = text ? JSON.parse(text) : null; } catch { payload = text; }

        if (!response.ok) {
            Usuario.value = null;
            return false;
        }

        const user = payload?.user ?? payload;
        if (!user) {
            Usuario.value = null;
            return false;
        }

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