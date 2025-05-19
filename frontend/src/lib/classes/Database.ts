import { RolUsuario, Usuario } from "$lib/auth.svelte";
import { API } from "$lib/global/api";

export default class Database {
    public static async login(rut: string, contraseña: string) {
        rut = rut.replace(/[^\d-]/g, '')

        const response = await fetch(API.LOGIN, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ rut, contraseña })
        });

        if (!response.ok) {
            const { error } = await response
                .json()
                .catch(async () => ({ error: await response.text() }));
            throw error
        }

        const { message, user } = await response.json();
        console.debug(message);

        Usuario.value = {
            rut,
            correo: user.correo,
            rol: user.tipo,
            imagen: '',
            nombre: {
                [RolUsuario.Alumno]: "Juan Pérez González",
                [RolUsuario.Profesor]: "Profesor Pepe",
                [RolUsuario.Visualizador]: "Visualizador Pepe"
            }[user.tipo as number] ?? "Desconocido Pepe"
        };
    }
}