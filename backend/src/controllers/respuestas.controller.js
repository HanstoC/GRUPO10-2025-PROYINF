
const respuestasService = require('../services/respuestas.service');

async function crearRespuesta(req, res) {
    const { id_ensayo, id_pregunta, id_alternativa, id_alumno, estado } = req.body;
    const data = req.body;

    // 1. Validación de datos de entrada
    if (!id_ensayo || !id_pregunta || !id_alternativa || !id_alumno || estado === undefined) {
        return res.status(400).send('Faltan campos requeridos para la respuesta.');
    }
    
    try {
        // 2. Llamar al servicio
        await respuestasService.registrarRespuesta(data);

        // 3. Responder
        res.status(200).send('Respuesta registrada');

    } catch (err) {
        // 4. Manejo de errores genéricos (500)
        console.error('Error guardando respuesta:', err);
        res.status(500).send('Error al guardar respuesta');
    }
}

module.exports = {
    crearRespuesta,
};

