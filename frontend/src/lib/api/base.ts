import type { ApiErrorBody, ApiResponse } from "$lib/types/api";

export const API_URL = 'http://localhost:8000/'

/**
 * Función de fetch genérica para centralizar el manejo de errores HTTP y cabeceras.
 * Si la respuesta no es OK (status 4xx o 5xx), lanza una excepción.
 * @param endpoint - La ruta específica de la API (ej: 'auth/login').
 * @param options - Opciones estándar de la solicitud fetch.
 * @returns Una promesa que resuelve a ApiResponse<T> si es exitoso.
 */
export async function apiFetcher<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {

    const url = API_URL + endpoint;

    const defaultOptions: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers // Permite sobrescribir cabeceras
        },
        ...options
    };

    const response = await fetch(url, defaultOptions);

    if (!response.ok) {
        let errorBody: ApiErrorBody = { error: `Error HTTP ${response.status}` };

        try {
            errorBody = await response.clone().json();
        } catch (e) {
        }

        const errorMessage = errorBody.error || `Error desconocido (${response.status})`;
        throw new Error(errorMessage);
    }

    return response.json();
}