import { API_URL } from "./base";

const API_BASE = API_URL + 'ensayos/'

export const EnsayosService = {
    async preguntas(id: string) {
        return await fetch(API_BASE + `${id}/preguntas`, {
            credentials: 'include'
        }).then(r => r.json());
    },

    async responder(id: string, respuestas: Record<number, number>, tiempo: number) {
        return await fetch(API_BASE + `${id}/responder`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ respuestas, tiempo })
        }).then(r => r.json());
    },

}