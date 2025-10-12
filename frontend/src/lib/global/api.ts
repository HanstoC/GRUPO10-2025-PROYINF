const BACKEND = "http://localhost:8000/"

export const API = {
    GUARDAR_PREGUNTA: BACKEND + "preguntas",
    LOGIN: BACKEND + "login",
    CHECK_SESIÓN: BACKEND + 'check-session',
    LOGOUT: BACKEND + 'logout',
    ENSAYOS: BACKEND + 'ensayos',
    RESULTADOS: BACKEND + 'resultados',
    COMBINED_DATA: () => BACKEND + "api/data/combined"
} as const