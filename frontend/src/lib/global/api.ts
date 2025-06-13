const BACKEND = "http://localhost:8000/"

export const API = {
    GUARDAR_PREGUNTA: BACKEND + "preguntas",
    LOGIN: BACKEND + "login",
    ENSAYOS_PROFESOR: (id: string) => BACKEND + `ensayos/profesor/${id}`,
    ASIGNATURAS: BACKEND + "asignaturas",
    CREAR_ENSAYO: BACKEND + "ensayos",
    TEMATICAS: (id_asignatura: string) => BACKEND + `tematicas/${id_asignatura}`,
    PREGUNTAS_COUNT: (id_asignatura: string) => BACKEND + `asignaturas/${id_asignatura}/preguntas/count`,
    ACTUALIZAR_ENSAYO: (id: string) => BACKEND + `ensayos/${id}`,
    ELIMINAR_ENSAYO: (id: string) => BACKEND + `ensayos/${id}`
}