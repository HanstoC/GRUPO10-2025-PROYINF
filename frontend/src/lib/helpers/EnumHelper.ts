import  { RolUsuario } from "$lib/auth.svelte";

export default class EnumHelper {
    public static rolUsuarioName(rol?: RolUsuario){
       return Object.entries(RolUsuario).find(([, v]) => v == rol)?.[0] ?? 'Desconocido'
    }
}