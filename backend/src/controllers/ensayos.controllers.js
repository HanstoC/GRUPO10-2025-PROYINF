
const ensayosService = require('../services/ensayos.service');

async function obtenerEnsayos(req, res) {
    try {
        // Pasa directamente req.query (los parámetros de la URL) al Servicio
        const ensayos = await ensayosService.obtenerEnsayos(req.query); 
        
        res.json(ensayos);
    } catch (err) {
        // Manejo y respuesta de errores HTTP (500)
        console.error('Error al obtener ensayos:', err);
        res.status(500).send('Error al obtener ensayos');
    }
}

async function crearEnsayo(req, res) {
    // 1. Desestructurar y validar datos (la misma lógica de validación)
    const { id_asignatura, id_profesor, dificultad, preguntas } = req.body;

    if (!id_asignatura || !id_profesor || !dificultad || !Array.isArray(preguntas)) {
        return res.status(400).send('Faltan datos');
    }

    try {
        // 2. Llamar al servicio que maneja la transacción
        const result = await ensayosService.crearEnsayo({ 
            id_asignatura, 
            id_profesor, 
            dificultad, 
            preguntas 
        });

        // 3. Responder con éxito (201 Created)
        res.status(201).json(result); 

    } catch (err) {
        // 4. Manejo de errores genéricos (500)
        console.error('Error al guardar ensayo:', err);
        res.status(500).send('Error interno del servidor');
    }
}

async function obtenerPreguntas(req, res) {
    // 1. Obtener ID del parámetro de la URL y convertir a número
    const ensayoId = Number(req.params.id);

    // 💡 Validación básica de entrada
    if (isNaN(ensayoId)) {
        return res.status(400).send('ID de ensayo inválido.');
    }

    try {
        // 2. Llamar al servicio
        const preguntas = await ensayosService.obtenerPreguntasDeEnsayo(ensayoId); 
        
        // 3. Responder
        res.json(preguntas);
    } catch (err) {
        // 4. Manejo de errores
        console.error('Error obteniendo preguntas:', err);
        res.status(500).send('Error al obtener preguntas');
    }
}

async function responderEnsayo(req, res) {
    // 1. Obtener y validar datos de la petición
    const ensayoId = Number(req.params.id);
    const alumnoId = req.session.user?.id; // Usar el ID del usuario autenticado
    const { respuestas, tiempo } = req.body;

    // Validación de Autorización (req.session)
    if (!alumnoId) {
        return res.status(401).send('No autorizado');
    }
    
    // Validación de Datos de Entrada (req.body)
    if (!respuestas || typeof respuestas !== 'object') {
        return res.status(400).send('Respuestas inválidas');
    }
    if (isNaN(ensayoId)) {
         return res.status(400).send('ID de ensayo inválido');
    }

    try {
        // 2. Llamar al servicio que maneja la lógica y la transacción
        const resultado = await ensayosService.guardarRespuestas(
            ensayoId, 
            alumnoId, 
            respuestas, 
            tiempo
        );

        // 3. Responder con éxito (201 Created)
        res.status(201).json({
            mensaje: 'Respuestas guardadas',
            puntaje: resultado.puntaje,
            correctas: resultado.correctas,
            erroneas: resultado.erroneas,
            omitidas: resultado.omitidas,
            tiempo: resultado.tiempo
        });

    } catch (err) {
        // 4. Manejo de errores genéricos (500)
        console.error('Error al guardar respuestas:', err);
        res.status(500).send('Error al guardar respuestas');
    }
}

async function obtenerResultadosYFacetas(req, res) {
    try {
        // 1. Llamar al servicio y usar AWAIT
        const data = await ensayosService.getEnsayoResultsAndFacets(); 
        
        // 2. Responder
        res.json(data);
    } catch (error) {
        // 3. Manejo de errores
        console.error('Error al obtener datos de ensayos y facetas:', error.message);
        res.status(500).json({ message: 'Error al obtener datos de ensayos y facetas.' });
    }
}

async function actualizarEnsayo(req, res) {
    const ensayoId = parseInt(req.params.id, 10);
    const data = req.body;
    
    // Validación inicial
    if (isNaN(ensayoId) || !Array.isArray(data.preguntas)) {
        return res.status(400).send('Datos incompletos o ID inválido');
    }

    try {
        // 1. Llamar al servicio, que maneja la transacción
        await ensayosService.actualizarEnsayoCompleto(ensayoId, data);
        
        // 2. Responder
        res.status(200).json({ message: 'Ensayo actualizado' });
        
    } catch (err) {
        // 3. Manejo de errores
        console.error('Error al actualizar ensayo:', err);
        res.status(500).send('Error interno del servidor');
    }
}

async function obtenerEnsayoPorId(req, res) {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
        return res.status(400).send('ID de ensayo inválido');
    }

    try {
        // Asumiendo que el servicio tiene una función puente para findEnsayoById
        const ensayo = await ensayosService.obtenerEnsayoPorId(id); 

        // Manejo de 404
        if (!ensayo) {
            return res.status(404).send('Ensayo no encontrado');
        }

        res.json(ensayo);

    } catch (err) {
        console.error('Error al obtener ensayo:', err);
        res.status(500).send('Error al obtener ensayo');
    }
}

async function eliminarEnsayos(req,res) {
    const ensayoId = parseInt(req.params.id, 10);
    const idProfesor = req.session.user?.id; // Usar el ID del usuario autenticado

    const data = req.body;
    
    // Validación inicial
    if (isNaN(ensayoId) || !Array.isArray(data.preguntas)) {
        return res.status(400).send('Datos incompletos o ID inválido');
    }

    try {
        // 1. Llamar al servicio, que maneja la transacción
        await ensayosService.deleteEnsayos(ensayoId, idProfesor, client);
        
        // 2. Responder
        res.status(200).json({ message: 'Ensayo actualizado' });
        
    } catch (err) {
        // 3. Manejo de errores
        console.error('Error al actualizar ensayo:', err);
        res.status(500).send('Error interno del servidor');
    }

    
}


module.exports = {
    obtenerEnsayos,
    crearEnsayo,
    obtenerPreguntas,
    responderEnsayo,
    obtenerResultadosYFacetas,
    actualizarEnsayo,
    obtenerEnsayoPorId,
    eliminarEnsayos,
};