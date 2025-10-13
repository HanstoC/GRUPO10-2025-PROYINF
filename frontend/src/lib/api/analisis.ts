import type { ApiResponse } from "$lib/types/api";
import { apiFetcher } from "./base";

export type ResumenData = {
    total_alumnos: number;
    total_preguntas_ensayo: number;
    porcentaje_acierto_general: number;
    promedios_por_alumno: {
        aciertos: number;
        errores: number;
        omisiones: number;
    };
};

export type GraphDataItem = {
    question_number: number;
    nombre_tematica: string;
    aciertos_total: number;
    erorres_total: number;
    omisiones_total: number;
    acierto_promedio: number;
    error_promedio: number;
    omision_promedio: number;
};

export type DetallesData = {
    total_alumnos: number;
    graph_data: GraphDataItem[];
};

export const AnalisisService = {
    async resumen(id: string): Promise<ApiResponse<ResumenData>> {
        return apiFetcher<ResumenData>('analisis/essays/' + id + '/summary', {
            credentials: 'include'
        });
    },
    async detalles(id: string): Promise<ApiResponse<DetallesData>> {
        return apiFetcher<DetallesData>('analisis/essays/' + id + '/detail', {
            credentials: 'include'
        });
    }
}