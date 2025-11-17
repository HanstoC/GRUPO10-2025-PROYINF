
const preguntasService = require('../services/preguntas.service');

async function crearPregunta(req, res) {
    const data = req.body;
    
    // 1. Validación de datos de entrada mínima (se puede expandir)
    if (!data.id_asignatura || !data.id_profesor || !data.pregunta || !Array.isArray(data.respuestas)) {
        return res.status(400).send('Faltan datos requeridos para la pregunta.');
    }

    // Validación de lógica de negocio simple (ej: debe haber al menos una respuesta correcta)
    const tieneRespuestaCorrecta = data.respuestas.some(alt => alt.es_correcta === true);
    if (!tieneRespuestaCorrecta) {
        return res.status(400).send('La pregunta debe tener al menos una respuesta correcta.');
    }

    try {
        // 2. Llamar al servicio que maneja la lógica y la transacción
        const result = await preguntasService.guardarPregunta(data);

        // 3. Responder con éxito (200 OK o 201 Created si quieres ser más específico)
        return res.status(201).json(result); 

    } catch (err) {
        // 4. Manejo de errores genéricos (500)
        console.error('Error guardando pregunta:', err);
        return res.status(500).send('Error al guardar la pregunta');
    }
}

async function obtenerPreguntas(req, res) {
    // 1. Obtener el parámetro de query (es opcional)
    const asignaturaQuery = req.query.asignatura; 
    
    try {
        // 2. Llamar al servicio, delegando la lógica de transformación/filtro
        const preguntas = await preguntasService.obtenerPreguntasConDetalles(asignaturaQuery);
        
        // 3. Responder
        res.json(preguntas);

    } catch (err) {
        // 4. Manejo de errores
        console.error('Error al obtener preguntas:', err);
        res.status(500).send('Error al obtener preguntas');
    }
}

async function obtenerPreguntaPorId(req, res) {
    const id = Number.parseInt(req.params.id, 10);
    
    if (isNaN(id)) {
        return res.status(400).send('ID de pregunta inválido.');
    }

    try {
        // 1. Llamar al servicio
        const pregunta = await preguntasService.obtenerPreguntaCompleta(id);
        
        // 2. Manejo de 404
        if (!pregunta) {
            return res.status(404).send('Pregunta no encontrada.');
        }

        // 3. Responder
        res.json(pregunta);
        
    } catch (err) {
        // 4. Manejo de errores
        console.error('Error al obtener pregunta:', err);
        res.status(500).send('Error al obtener pregunta');
    }
}

async function actualizarPregunta(req, res) {
    const id = Number.parseInt(req.params.id, 10);
    const data = req.body;
    
    if (isNaN(id)) {
        return res.status(400).send('ID de pregunta inválido.');
    }

    // Validación básica de datos (más validación iría en el servicio)
    if (!data.enunciado || !data.id_tematica || !data.topico || !data.respuestas || !data.id_asignatura) {
        return res.status(400).send('Faltan datos requeridos para la actualización de la pregunta.');
    }

    try {
        // 1. Llamar al servicio, que maneja la transacción
        await preguntasService.actualizarPregunta(id, data);
        
        // 2. Responder
        res.status(200).send('Pregunta actualizada');
        
    } catch (err) {
        // 3. Manejo de errores (el servicio ya hizo el rollback)
        // Nota: Podemos ser más específicos si el error es 404/400, pero aquí usamos 500 para fallos de DB/Server.
        console.error('Error al actualizar pregunta:', err.message);
        res.status(500).send('Error al actualizar pregunta');
    }
}


module.exports = {
    crearPregunta,
    obtenerPreguntas,
    obtenerPreguntaPorId,
    actualizarPregunta,
};