
const TematicaRepository = require('../repositories/TematicaRepository'); 
// Opcionalmente, podrías crear un servicio, pero simplificamos a Repositorio

async function obtenerPorAsignatura(req, res) {
    // 1. Obtener y validar el ID del parámetro
    const idAsignatura = Number.parseInt(req.params.idAsignatura, 10);
    // console.log(idAsignatura); // La línea de log original se queda aquí o se elimina

    if (isNaN(idAsignatura)) {
        return res.status(400).json({ error: 'ID de asignatura inválido' });
    }

    try {
        // 2. Llamar al Repositorio
        const topicos = await TematicaRepository.findByAsignaturaId(idAsignatura);
        
        // 3. Responder
        res.json(topicos);

    } catch (err) {
        // 4. Manejo de errores
        console.error('Error al obtener tópicos:', err);
        res.status(500).send('Error al obtener los tópicos');
    }
}

module.exports = {
    obtenerPorAsignatura,
};