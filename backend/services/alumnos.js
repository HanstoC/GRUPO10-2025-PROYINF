const cursos = require('../api_sim/alumnos.json');
const docentes = require('../api_sim/docentes.json');
const directivos = require('../api_sim/directivos.json');

const findAlumnoByRut = (rut) => {
    const curso = cursos.find(curso => 
        curso.alumnos.some(alumno => alumno.rut === rut)
    );

    if (!curso) return null;

    const alumno = curso.alumnos.find(alumno => alumno.rut === rut);
    
    return {
        ...alumno,
        nombre: `${alumno.nombre} ${alumno.paterno} ${alumno.materno}`.trim(),
        codigo_curso: curso.codigo_curso,
        nivel: curso.nivel,
        letra: curso.letra,
        tipo_ensenanza: curso.tipo_ensenanza
    };
}

const findDocenteByRut = (rut) => {
    const docente = docentes.find(docente => docente.rut === rut);
    if (!docente) return null;
    
    return {
        ...docente,
        nombre: docente.nombres
    };
}

const findDirectivoByRut = (rut) => {
    const directivo = directivos.find(directivo => directivo.rut === rut);
    if (!directivo) return null;
    
    return {
        ...directivo,
        nombre: directivo.nombres
    };
}

const getAllAlumnos = () => {
    let allAlumnos = [];
    cursos.forEach(curso => { 
        curso.alumnos.forEach(alumno => { 
            allAlumnos.push({
                
                id: alumno.rut,
                rut: alumno.rut,
                
                nombre: `${alumno.nombre} ${alumno.paterno} ${alumno.materno}`.trim(),
                email: alumno.email || 'No disponible',                
                curso_codigo: curso.codigo_curso,
                curso_nivel: curso.nivel,
                curso_letra: curso.letra,
                curso_tipo_ensenanza: curso.tipo_ensenanza,
            });
        });
    });
    return allAlumnos;
};


module.exports = {
    findAlumnoByRut,
    findDocenteByRut,
    findDirectivoByRut,
    getAllAlumnos
}