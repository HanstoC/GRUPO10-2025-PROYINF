import { API_URL } from "./base"

const API_BASE = API_URL + 'resultados/'

export const ResultadosService = {
    async get() {
        const res = await fetch(API_BASE, {
            credentials: 'include'
        });
        if (!res.ok) {
            console.error(res);
            throw new Error('No se cargaron los resultados');
        }
        return await res.json();
    }
}