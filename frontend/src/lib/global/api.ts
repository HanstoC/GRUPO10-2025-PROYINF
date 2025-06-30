const BACKEND = "http://localhost:8000/"

export const API = {
    GUARDAR_PREGUNTA: BACKEND + "preguntas",
    LOGIN: BACKEND + "login",
    CHECK_SESIÓN: BACKEND + 'check-session',
    LOGOUT: BACKEND + 'logout',
    COMBINED_DATA: () => BACKEND + "api/data/combined"
} as const