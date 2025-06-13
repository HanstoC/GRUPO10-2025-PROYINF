import { RolUsuario } from "$lib/auth.svelte";

const COLORS_ASIGNATURA: ((input: string) => string | null)[] = [
    (i) => (i.match(/\b(?:lectora|lenguaje)\b/gi) ? '#b31530' : null),
    (i) => (i.match(/\bM2\b/gi) ? '#362782' : null),
    (i) => (i.match(/\bmatem.tica/gi) ? '#1464b5' : null),
    (i) => (i.match(/\bhistoria\b/gi) ? '#cf5615' : null),
    (i) => (i.match(/\bciencias?\b/gi) ? '#7b1da3' : null),
    () => '#222'
];

export default class EnumHelper {
    public static rolUsuarioName(rol?: RolUsuario) {
        return Object.entries(RolUsuario).find(([, v]) => v == rol)?.[0] ?? 'Desconocido'
    }

    public static colorsAsignatura(asignatura?: string) {
        for (const fn of COLORS_ASIGNATURA) {
            const color = fn(asignatura ?? '');
            if (color) return color;
        }
        return '';
    }
}