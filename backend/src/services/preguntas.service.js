const PreguntaRepository = require('../repositories/PreguntaRepository');
const db = require('../config/db'); // Necesario para obtener el cliente/conexión

/**
 * Guarda una nueva pregunta con sus alternativas y maneja la creación de la temática.
 * @param {object} data - Todos los datos del req.body.
 */
async function guardarPregunta(data) {
    const client = await db.connect(); // 🔑 Obtener el cliente para la transacción
    let tematicaId = data.id_tematica;

    try {
        await client.query('BEGIN'); // 🔑 INICIO de la transacción

        // 1. LÓGICA CONDICIONAL: Crear Temática si es necesario
        if (!data.id_tematica && data.topico?.trim()) {
            tematicaId = await PreguntaRepository.createTematica(data.id_asignatura, data.topico, client);
        }
        
        // 2. Crear la Pregunta principal
        const id_pregunta = await PreguntaRepository.createPregunta({
            id_asignatura: data.id_asignatura,
            id_profesor: data.id_profesor,
            tematicaId: tematicaId, // Usamos el ID nuevo o el que vino en la data
            enunciado: data.pregunta,
            imagen: data.imagen
        }, client);

        // 3. Crear las Alternativas (la lógica de bucle se mueve aquí o al Repo)
        await PreguntaRepository.createAlternativas(id_pregunta, data.respuestas, client);

        await client.query('COMMIT'); // 🔑 COMMIT exitoso

        return { message: 'Pregunta guardada', id_pregunta };

    } catch (error) {
        await client.query('ROLLBACK'); // 🔑 ROLLBACK en caso de cualquier fallo
        throw error; // Propaga el error al Controlador
    } finally {
        client.release(); // 🔑 Liberar la conexión
    }
}

/**
 * Obtiene la lista de preguntas filtradas, manejando la transformación de los parámetros de query.
 * @param {string | undefined} asignaturaQuery - String de IDs separados por coma (ej: "1,5,10").
 */
async function obtenerPreguntasConDetalles(asignaturaQuery) {
    let asignaturaIds = [];
    
    // 1. LÓGICA DE NEGOCIO: Transformación y validación del filtro
    if (asignaturaQuery) {
        // Convertir la cadena de IDs separados por coma a un array de números.
        // Solo incluimos IDs que sean números válidos.
        asignaturaIds = asignaturaQuery
            .split(',')
            .map(id => Number.parseInt(id.trim(), 10))
            .filter(id => !Number.isNaN(id));
        
        // Si después de limpiar el filtro, no quedan IDs válidos, podríamos retornar un error o un array vacío.
        if (asignaturaIds.length === 0 && asignaturaQuery.trim() !== "") {
             // Devolver un array vacío si el filtro era inválido pero se intentó usar
             return [];
        }
    }
    
    // 2. Llamada al Repositorio
    return PreguntaRepository.findAllWithDetails(asignaturaIds);
}

/**
 * Obtiene una pregunta completa, sus alternativas y el ID de la alternativa correcta.
 * @param {number} idPregunta - ID de la pregunta.
 * @returns {object | null} El objeto de pregunta enriquecido.
 */
async function obtenerPreguntaCompleta(idPregunta) {
    // 1. Obtener la pregunta básica
    const pregunta = await PreguntaRepository.findPreguntaById(idPregunta);

    if (!pregunta) {
        return null;
    }

    // 2. Obtener las alternativas
    const alternativasCompletas = await PreguntaRepository.findAlternativasByPreguntaId(idPregunta);

    // 3. PROCESAMIENTO DE DATOS: Encontrar la alternativa correcta y mapear las alternativas
    const alternativaCorrecta = alternativasCompletas.find(alt => alt.es_correcta);
    
    // Reformatear el array de alternativas para que solo tenga ID y texto
    const alternativasMapeadas = alternativasCompletas.map(alt => ({
        id: alt.id,
        texto: alt.texto
    }));

    // 4. Componer el objeto final
    pregunta.correcta = alternativaCorrecta ? alternativaCorrecta.id : null;
    pregunta.alternativas = alternativasMapeadas;
    
    // Limpiar propiedades que ya no necesitamos en el output final
    delete pregunta.id_tematica; 

    return pregunta;
}

/**
 * Actualiza una pregunta y sus entidades relacionadas (Temática, Alternativas) dentro de una transacción.
 * @param {number} idPregunta - ID de la pregunta a actualizar.
 * @param {object} data - Datos de la pregunta y alternativas.
 */
async function actualizarPregunta(idPregunta, data) {
    const { enunciado, imagen_base64, id_tematica, topico, respuestas, id_asignatura } = data;
    
    // 1. Obtener cliente para la transacción
    const client = await db.connect();

    try {
        await client.query('BEGIN'); // 🔑 INICIO DE LA TRANSACCIÓN

        // 2. Actualizar PREGUNTA
        await PreguntaRepository.updatePregunta(idPregunta, { enunciado, imagen_base64, id_asignatura }, client);

        // 3. Actualizar TEMATICA
        await PreguntaRepository.updateTematica(id_tematica, topico, client);

        // 4. Actualizar ALTERNATIVAS (Iteración)
        for (const alternativa of respuestas) {
            if (!alternativa.id) {
                throw new Error('Alternativa ID faltante para actualización.');
            }
            await PreguntaRepository.updateAlternativa(alternativa.id, alternativa, client);
        }

        await client.query('COMMIT'); // 🔑 CIERRE DE LA TRANSACCIÓN (Éxito)
        return true;

    } catch (error) {
        await client.query('ROLLBACK'); // 🔑 DESHACER (Fallo)
        console.error('Transacción de actualización de pregunta fallida:', error);
        throw error;
    } finally {
        client.release(); // Liberar el cliente a la Pool
    }
}


module.exports = {
    guardarPregunta,
    obtenerPreguntasConDetalles,
    obtenerPreguntaCompleta,
    actualizarPregunta,
};