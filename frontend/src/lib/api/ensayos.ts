import { API_URL } from "./base";

const API_BASE = API_URL + 'ensayo/'

export const EnsayosService = {
    async preguntas(id: string) {
        const res = await fetch(API_BASE + `${id}/preguntas`, {
            credentials: 'include'
        });
        return await res.json();
    }
}