
const asignaturasService = require('../services/asignaturas.service');

async function obtenerTodas(req, res) {
    try {
        const asignaturas = await asignaturasService.obtenerTodas();
        // Envía la respuesta HTTP
        res.json(asignaturas); 
    } catch (err) {
        // Manejo de errores HTTP
        console.error('Error al obtener asignaturas:', err);
        res.status(500).send('Error al obtener las asignaturas');
    }
}

async function crearAsignatura(req, res) {
    try {
        // 1. Obtener datos de la petición (req.body)
        const { nombre } = req.body; 

        // 2. Llamar al servicio que contiene la lógica
        const result = await asignaturasService.crearAsignatura(nombre);
        
        // 3. Manejar respuesta HTTP:
        // Si el objeto ya existía (fue retornado por el servicio)
        if (result.nombre === nombre) {
             return res.json(result); // Devuelve 200/201 dependiendo de cómo quieras la respuesta
        }

        // Si se creó una nueva
        res.status(201).json(result); 

    } catch (err) {
        // 4. Manejo de errores genéricos (500)
        console.error('Error al crear asignatura:', err);
        res.status(500).send('Error al crear la asignatura');
    }
}

async function obtenerPorNombre(req, res) {
    // 1. Obtener y validar el nombre del parámetro
    const { nombre } = req.params;

    if (!nombre || typeof nombre !== 'string') {
         return res.status(400).json({ error: 'Parámetro de nombre inválido.' });
    }

    try {
        // 2. Llamar al servicio o repositorio
        const asignatura = await asignaturasService.obtenerPorNombre(nombre); // Asumimos una función en el servicio

        // 3. Manejo de la lógica de "No Encontrada"
        if (!asignatura) {
            return res.status(404).json({ error: 'Asignatura no encontrada' });
        }

        // 4. Responder con éxito
        res.json(asignatura);

    } catch (err) {
        // 5. Manejo de errores
        console.error('Error al buscar asignatura por nombre:', err);
        res.status(500).send('Error en el servidor');
    }
}


module.exports = {
    obtenerTodas,
    crearAsignatura,
    obtenerPorNombre
};