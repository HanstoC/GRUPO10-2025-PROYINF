
const AsignaturaRepository = require('../repositories/AsignaturaRepository');
const db = require('../config/db');

async function obtenerTodas() {
    // Llama al repositorio para obtener los datos
    return AsignaturaRepository.findAll();
    // Si hubiera lógica de negocio, iría aquí (e.g., filtrar datos por rol)
}

async function crearAsignatura(nombre) {
    const client = await db.connect(); 
    try {
        // 1. Lógica de Negocio: Verificar existencia
        const existingSubject = await AsignaturaRepository.findByName(nombre, client);

        if (existingSubject) {
            return existingSubject; // Retorna la asignatura existente
        }

        // 2. Lógica de Negocio: Creación
        const newSubject = await AsignaturaRepository.create(nombre, client);
        
        // Si hubiera más sentencias, haríamos COMMIT o ROLLBACK aquí

        return newSubject;
    } catch (error) {
        // En un caso de fallo complejo, aquí iría el client.query('ROLLBACK');
        throw error; // Propaga el error al Controlador
    } finally {
        client.release(); 
    }
}

async function obtenerPorNombre(nombre) {
    // El servicio solo llama al repositorio en este caso simple.
    return AsignaturaRepository.findOneByName(nombre);
}

module.exports = {
    obtenerTodas,
    crearAsignatura,
    obtenerPorNombre
};