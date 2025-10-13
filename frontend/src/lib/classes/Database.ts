export enum ASIGNATURAS {
    Lenguaje = 'lenguaje',
    'Matemáticas M1' = 'm1',
    'Matemáticas M2' = 'm2',
    'Ciencias' = 'ciencias',
    "Historia" = 'historia'
}

export enum MENCIONES_CIENCIAS {
    'Mención Física' = 'física',
    'Mención Biología' = 'biología',
    'Mención Química' = 'química'
}

export class DatabaseUtils {
    public static parseAsignatura(asignatura: ASIGNATURAS): string {
        return Object.entries(ASIGNATURAS).find(([, v]) => v === asignatura)?.[0] ?? "Desconocida"
    }

    public staticparseMenciónCiencias(mención: MENCIONES_CIENCIAS): string {
        return Object.entries(MENCIONES_CIENCIAS).find(([, v]) => v === mención)?.[0] ?? "Mención Desconocida"
    }
}