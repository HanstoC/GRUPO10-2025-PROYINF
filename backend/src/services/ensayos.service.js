
const EnsayoRepository = require('../repositories/EnsayoRepository');
const db = require('../config/db');
/**
 * Procesa los filtros recibidos desde el controlador y llama al repositorio.
 * @param {object} queryParams - Contiene req.query (profesor, asignatura)
 */
async function obtenerEnsayos(queryParams) {
    const filters = {};

    // Lógica 1: Procesar filtro 'profesor'
    if (queryParams.profesor) {
        // Asegura que sea un número (puede haber validación más estricta aquí)
        filters.profesorId = Number(queryParams.profesor); 
    }

    // Lógica 2: Procesar filtro 'asignatura' (maneja arrays y strings)
    if (queryParams.asignatura) {
        let asignaturas = Array.isArray(queryParams.asignatura)
            ? queryParams.asignatura
            : [queryParams.asignatura];
        
        // Convierte todos los IDs de asignatura a números
        filters.asignaturaIds = asignaturas.map(Number).filter(id => !Number.isNaN(id));
    }

    // Llama al repositorio con el objeto de filtros limpios
    return EnsayoRepository.findEnsayosWithFilters(filters);
}

/**
 * Crea un ensayo y sus preguntas asociadas dentro de una transacción.
 * @param {object} data - Datos del ensayo y array de preguntas.
 */
async function crearEnsayo(data) {
    const client = await db.connect(); 
    try {
        await client.query('BEGIN'); 

        // 1. Crear el Ensayo principal
        const id_ensayo = await EnsayoRepository.createEnsayo(data, client);

        // 2. Asociar las Preguntas
        await EnsayoRepository.addPreguntasToEnsayo(id_ensayo, data.preguntas, client);
        
        await client.query('COMMIT'); 
        
        return { message: 'Ensayo creado', id_ensayo };

    } catch (error) {
        await client.query('ROLLBACK'); 
        // Propagar el error
        throw error; 
    } finally {
        client.release(); 
    }
}

/**
 * Obtiene el listado de preguntas de un ensayo específico.
 * @param {number} ensayoId - ID del ensayo.
 */
async function obtenerPreguntasDeEnsayo(ensayoId) {
    // 💡 Lógica de negocio (ej. validación de existencia de ensayo) iría aquí.
    return EnsayoRepository.findPreguntasByEnsayoId(ensayoId);
}

/**
 * Procesa las respuestas del alumno, calcula el puntaje y guarda el resultado de forma transaccional.
 * @param {number} ensayoId - ID del ensayo.
 * @param {number} alumnoId - ID del usuario (alumno).
 * @param {object} respuestas - { [preguntaId]: alternativaId, ... }
 * @param {number} tiempo - Tiempo empleado.
 */
async function guardarRespuestas(ensayoId, alumnoId, respuestas, tiempo) {
    const client = await db.connect(); 
    try {
        await client.query('BEGIN'); // INICIO de la transacción

        // 1. Obtener datos clave (Respuestas Correctas)
        const preguntas = await EnsayoRepository.findRespuestasCorrectas(ensayoId, client);

        // 2. LÓGICA DE NEGOCIO: CÁLCULO DEL PUNTAJE
        let correctas = 0;
        let erroneas = 0;
        let omitidas = 0;

        for (const row of preguntas) {
            const respuesta = respuestas[row.pregunta_id];
            
            if (respuesta === undefined) {
                omitidas++;
            } else if (Number(respuesta) === row.alternativa_correcta) {
                correctas++;
            } else {
                erroneas++;
            }
        }
        
        const puntaje = correctas; // Lógica de puntaje simplificada

        // 3. Guardar Resultado (en la misma transacción)
        const resultado = {
            ensayoId,
            puntaje,
            correctas,
            erroneas,
            omitidas,
            tiempo
        };
        await EnsayoRepository.saveResultado(alumnoId, resultado, client);

        await client.query('COMMIT'); // COMMIT exitoso

        // 4. Retornar los resultados calculados
        return resultado;

    } catch (error) {
        await client.query('ROLLBACK'); // ROLLBACK en caso de fallo
        throw error; 
    } finally {
        client.release(); 
    }
}

async function getEnsayoResultsAndFacets() {
    // 1. Obtener datos crudos del Repositorio
    const resultados = await EnsayoRepository.findAllEnsayoResults(); 
    
    // 2. Lógica de negocio/cálculo de facetas
    const totalResultados = resultados.length;
    const asignaturas = [...new Set(resultados.map(r => r.asignatura_nombre))];
    
    // 3. Devolver la data organizada
    return {
        resultados: resultados,
        facets: {
            total: totalResultados,
            asignaturas_disponibles: asignaturas,
            // ... otras facetas como promedio de puntaje por dificultad
        }
    };
}


/**
 * Actualiza un ensayo (asignatura, dificultad) y sus preguntas asociadas dentro de una transacción.
 * @param {number} ensayoId - ID del ensayo a actualizar.
 * @param {object} data - { id_asignatura, dificultad, preguntas }
 */
async function actualizarEnsayoCompleto(ensayoId, data) {
    const { id_asignatura, dificultad, preguntas } = data;
    
    // 1. Obtener cliente para la transacción
    const client = await db.connect();

    try {
        await client.query('BEGIN'); // 🔑 INICIO DE LA TRANSACCIÓN

        // 2. Actualizar la cabecera del ENSAYO
        await EnsayoRepository.updateEnsayo(ensayoId, id_asignatura, dificultad, client);

        // 3. Eliminar las relaciones antiguas (ENSAYO_PREGUNTA)
        await EnsayoRepository.deleteEnsayoPreguntas(ensayoId, client);

        // 4. Insertar las nuevas relaciones (ENSAYO_PREGUNTA)
        await EnsayoRepository.insertEnsayoPreguntas(ensayoId, preguntas, client);

        await client.query('COMMIT'); // 🔑 CIERRE DE LA TRANSACCIÓN (Éxito)
        return true;

    } catch (error) {
        await client.query('ROLLBACK'); // 🔑 DESHACER (Fallo)
        console.error('Transacción de actualización de ensayo fallida:', error);
        throw error; // Propagar el error al controlador
    } finally {
        client.release(); // Liberar el cliente
    }
}

async function obtenerEnsayoPorId(id) {
    return EnsayoRepository.findEnsayoById(id);
}

/**
 * Elimina uno o más ensayos de forma transaccional, verificando la autoría.
 * @param {Array<number>} ensayoIds - IDs de los ensayos a eliminar.
 * @param {number} idProfesor - ID del profesor que realiza la acción.
 * @returns {Array<number>} IDs de los ensayos que fueron efectivamente eliminados.
 */
async function eliminarEnsayosMasivo(ensayoIds, idProfesor) {
    const client = await db.connect();

    try {
        await client.query('BEGIN'); // 🔑 INICIO DE LA TRANSACCIÓN

        // 1. Eliminar entradas dependientes (ENSAYO_PREGUNTA)
        await EnsayoRepository.deleteEnsayoPreguntasByIds(ensayoIds, client);

        // 2. Eliminar los ensayos principales (ENSAYO), aplicando el filtro de autor
        const eliminadosRows = await EnsayoRepository.deleteEnsayos(ensayoIds, idProfesor, client);

        await client.query('COMMIT'); // 🔑 CIERRE DE LA TRANSACCIÓN

        // Devolver solo los IDs eliminados
        return eliminadosRows.map(r => r.id);

    } catch (error) {
        await client.query('ROLLBACK'); // 🔑 DESHACER
        console.error('Transacción de eliminación de ensayos fallida:', error);
        throw error; 
    } finally {
        client.release();
    }
}


async function eliminarEnsayos(req, res) {
    const { ids, id_profesor } = req.body;
    
    // 1. Validación de entrada
    if (!Array.isArray(ids) || ids.length === 0 || !id_profesor) {
        return res.status(400).send('Faltan datos: ids (array de números) o id_profesor');
    }

    // Convertir IDs a números (aunque el servicio lo manejará, mejor validar aquí)
    const ensayoIds = ids.map(id => Number.parseInt(id, 10)).filter(id => !Number.isNaN(id));

    if (ensayoIds.length !== ids.length) {
        return res.status(400).send('IDs de ensayo deben ser números válidos.');
    }

    try {
        // 2. Llamar al servicio, que maneja la transacción
        const eliminados = await ensayosService.eliminarEnsayosMasivo(ensayoIds, id_profesor);
        
        // 3. Manejo de 404 (si no se eliminó nada, pero no hubo error de DB)
        if (eliminados.length === 0) {
            // Esto ocurre si los IDs existían pero no pertenecían al id_profesor dado
            return res.status(404).send('No se eliminaron ensayos. Verifica IDs y profesor.');
        }

        // 4. Respuesta exitosa
        res.status(200).json({
            message: 'Ensayos eliminados',
            eliminados: eliminados
        });

    } catch (err) {
        // 5. Manejo de errores
        console.error('Error al eliminar ensayos:', err);
        res.status(500).send('Error interno del servidor');
    }
}




module.exports = {
    obtenerEnsayos,
    crearEnsayo,
    obtenerPreguntasDeEnsayo,
    guardarRespuestas,
    getEnsayoResultsAndFacets,
    actualizarEnsayoCompleto,
    obtenerEnsayoPorId,
    eliminarEnsayosMasivo,
    eliminarEnsayos,
};