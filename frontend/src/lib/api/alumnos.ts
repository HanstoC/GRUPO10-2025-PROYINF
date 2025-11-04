import { API_URL } from "./base";

const API_BASE = API_URL + 'alumnos/';

export const AlumnosService = {
    async getCombinada() {
        return await fetch(API_BASE + 'data/combined', {
            credentials: 'include'
        }).then(r => r.json());
    }
};