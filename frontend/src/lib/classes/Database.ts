import { goto } from "$app/navigation";
import { RolUsuario, Usuario } from "$lib/auth.svelte";
import { API } from "$lib/global/api";
import { Utils } from "../../utils/Utils.svelte";

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

export default class Database {
    public static async login(rut: string, contraseña: string) {
        rut = rut.replace(/[^\d-]/g, '').trim()

        const delay = Utils.timeout(2000);
        const response = await fetch(API.LOGIN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ rut, contraseña }),
            credentials: 'include'
        });

        if (!response.ok) {
            let { error } = await response.json().catch(() => ({ error: null }));
            error ??= await response.clone().text();
            throw error
        }

        const { user } = await response.json();
        await delay;

        if (user.tipo == 'alumno') {
            console.log(user);
            Usuario.value = {
                rut,
                nombre: user.nombre,
                rol: user.tipo,
                correo: user.correo,
                curso: user.curso,
                asistencia: user.asistencia,
                apoderado: user.apoderado,
                direccion: user.direccion,
                fecha_nacimiento: user.fecha_nacimiento,
                genero: user.genero,
                situacion_alumno: user.situacion_alumno,
                tipo_ensenanza: user.tipo_ensenanza
            };
        } else {
            Usuario.value = {
                rut,
                nombre: user.nombre,
                rol: user.tipo,
                correo: user.correo
            }

        }
    }

    public static async checkLogged() {
        const response = await fetch(API.CHECK_SESIÓN, {
            credentials: 'include'
        })

        if (!response.ok)
            return void goto('login');
        if (Usuario.value) return

        const { user } = await response.json();
        const value = {
            rut: user.rut,
            rol: user.tipo
        }

        Usuario.value = value;
        return value
    }

    public static async logout() {
        fetch(API.LOGOUT, {
            credentials: 'include'
        });
        Usuario.value = null;
    }
}