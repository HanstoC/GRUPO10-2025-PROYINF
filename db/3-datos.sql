-- MATEMÁTICAS

WITH EjesTematicos AS (
    INSERT INTO "CONTENIDO" (id_tipo_contenido, asignatura, nombre)
    VALUES
        ((SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Eje Temático'), 'Competencia Matematica 1 (M1)'::asignatura, 'Números'),
        ((SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Eje Temático'), 'Competencia Matematica 1 (M1)'::asignatura, 'Álgebra y Funciones'),
        ((SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Eje Temático'), 'Competencia Matematica 1 (M1)'::asignatura, 'Geometría'),
        ((SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Eje Temático'), 'Competencia Matematica 1 (M1)'::asignatura, 'Probabilidad y Estadística'),
        ((SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Eje Temático'), 'Competencia Matematica 2 (M2)'::asignatura, 'Números'),
        ((SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Eje Temático'), 'Competencia Matematica 2 (M2)'::asignatura, 'Álgebra y Funciones'),
        ((SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Eje Temático'), 'Competencia Matematica 2 (M2)'::asignatura, 'Geometría'),
        ((SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Eje Temático'), 'Competencia Matematica 2 (M2)'::asignatura, 'Probabilidad y Estadística')
    RETURNING id, asignatura, nombre
)

INSERT INTO "CONTENIDO" (id_tipo_contenido, asignatura, nombre, id_padre)
SELECT 
    (SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Unidad Temática'),
    u.asignatura,
    u.nombre,
    u.id_padre
FROM (
    SELECT id AS id_padre, 'Competencia Matematica 1 (M1)'::asignatura AS asignatura, 'Conjunto de los números enteros y racionales' AS nombre
    FROM EjesTematicos WHERE nombre = 'Números' AND asignatura = 'Competencia Matematica 1 (M1)'::asignatura
    UNION ALL
    SELECT id, 'Competencia Matematica 1 (M1)'::asignatura, 'Porcentaje'
    FROM EjesTematicos WHERE nombre = 'Números' AND asignatura = 'Competencia Matematica 1 (M1)'::asignatura
    UNION ALL
    SELECT id, 'Competencia Matematica 1 (M1)'::asignatura, 'Potencias y raíces enésimas'
    FROM EjesTematicos WHERE nombre = 'Números' AND asignatura = 'Competencia Matematica 1 (M1)'::asignatura
    UNION ALL
    SELECT id, 'Competencia Matematica 1 (M1)'::asignatura, 'Expresiones algebraicas'
    FROM EjesTematicos WHERE nombre = 'Álgebra y Funciones' AND asignatura = 'Competencia Matematica 1 (M1)'::asignatura
    UNION ALL
    SELECT id, 'Competencia Matematica 1 (M1)'::asignatura, 'Proporcionalidad'
    FROM EjesTematicos WHERE nombre = 'Álgebra y Funciones' AND asignatura = 'Competencia Matematica 1 (M1)'::asignatura
    UNION ALL
    SELECT id, 'Competencia Matematica 1 (M1)'::asignatura, 'Ecuaciones e inecuaciones de primer grado'
    FROM EjesTematicos WHERE nombre = 'Álgebra y Funciones' AND asignatura = 'Competencia Matematica 1 (M1)'::asignatura
    UNION ALL
    SELECT id, 'Competencia Matematica 1 (M1)'::asignatura, 'Sistemas de ecuaciones lineales (2x2)'
    FROM EjesTematicos WHERE nombre = 'Álgebra y Funciones' AND asignatura = 'Competencia Matematica 1 (M1)'::asignatura
    UNION ALL
    SELECT id, 'Competencia Matematica 1 (M1)'::asignatura, 'Función lineal y afín'
    FROM EjesTematicos WHERE nombre = 'Álgebra y Funciones' AND asignatura = 'Competencia Matematica 1 (M1)'::asignatura
    UNION ALL
    SELECT id, 'Competencia Matematica 1 (M1)'::asignatura, 'Función cuadrática'
    FROM EjesTematicos WHERE nombre = 'Álgebra y Funciones' AND asignatura = 'Competencia Matematica 1 (M1)'::asignatura
    UNION ALL
    SELECT id, 'Competencia Matematica 1 (M1)'::asignatura, 'Figuras geométricas'
    FROM EjesTematicos WHERE nombre = 'Geometría' AND asignatura = 'Competencia Matematica 1 (M1)'::asignatura
    UNION ALL
    SELECT id, 'Competencia Matematica 1 (M1)'::asignatura, 'Cuerpos geométricos'
    FROM EjesTematicos WHERE nombre = 'Geometría' AND asignatura = 'Competencia Matematica 1 (M1)'::asignatura
    UNION ALL
    SELECT id, 'Competencia Matematica 1 (M1)'::asignatura, 'Transformaciones isométricas'
    FROM EjesTematicos WHERE nombre = 'Geometría' AND asignatura = 'Competencia Matematica 1 (M1)'::asignatura
    UNION ALL
    SELECT id, 'Competencia Matematica 1 (M1)'::asignatura, 'Representación de datos a través de tablas y gráficos'
    FROM EjesTematicos WHERE nombre = 'Probabilidad y Estadística' AND asignatura = 'Competencia Matematica 1 (M1)'::asignatura
    UNION ALL
    SELECT id, 'Competencia Matematica 1 (M1)'::asignatura, 'Medidas de tendencia central y rango'
    FROM EjesTematicos WHERE nombre = 'Probabilidad y Estadística' AND asignatura = 'Competencia Matematica 1 (M1)'::asignatura
    UNION ALL
    SELECT id, 'Competencia Matematica 1 (M1)'::asignatura, 'Medidas de posición'
    FROM EjesTematicos WHERE nombre = 'Probabilidad y Estadística' AND asignatura = 'Competencia Matematica 1 (M1)'::asignatura
    UNION ALL
    SELECT id, 'Competencia Matematica 1 (M1)'::asignatura, 'Reglas de las probabilidades'
    FROM EjesTematicos WHERE nombre = 'Probabilidad y Estadística' AND asignatura = 'Competencia Matematica 1 (M1)'::asignatura
    UNION ALL
    SELECT id, 'Competencia Matematica 2 (M2)'::asignatura, 'Conjunto de los números reales'
    FROM EjesTematicos WHERE nombre = 'Números' AND asignatura = 'Competencia Matematica 2 (M2)'::asignatura
    UNION ALL
    SELECT id, 'Competencia Matematica 2 (M2)'::asignatura, 'Logaritmos'
    FROM EjesTematicos WHERE nombre = 'Números' AND asignatura = 'Competencia Matematica 2 (M2)'::asignatura
    UNION ALL
    SELECT id, 'Competencia Matematica 2 (M2)'::asignatura, 'Sistemas de ecuaciones lineales (2x2)'
    FROM EjesTematicos WHERE nombre = 'Álgebra y Funciones' AND asignatura = 'Competencia Matematica 2 (M2)'::asignatura
    UNION ALL
    SELECT id, 'Competencia Matematica 2 (M2)'::asignatura, 'Ecuaciones de segundo grado'
    FROM EjesTematicos WHERE nombre = 'Álgebra y Funciones' AND asignatura = 'Competencia Matematica 2 (M2)'::asignatura
    UNION ALL
    SELECT id, 'Competencia Matematica 2 (M2)'::asignatura, 'Homotecia de figuras planas'
    FROM EjesTematicos WHERE nombre = 'Geometría' AND asignatura = 'Competencia Matematica 2 (M2)'::asignatura
    UNION ALL
    SELECT id, 'Competencia Matematica 2 (M2)'::asignatura, 'Razones trigonométricas en triángulos rectángulos'
    FROM EjesTematicos WHERE nombre = 'Geometría' AND asignatura = 'Competencia Matematica 2 (M2)'::asignatura
    UNION ALL
    SELECT id, 'Competencia Matematica 2 (M2)'::asignatura, 'Medidas de dispersión'
    FROM EjesTematicos WHERE nombre = 'Probabilidad y Estadística' AND asignatura = 'Competencia Matematica 2 (M2)'::asignatura
    UNION ALL
    SELECT id, 'Competencia Matematica 2 (M2)'::asignatura, 'Probabilidad condicional'
    FROM EjesTematicos WHERE nombre = 'Probabilidad y Estadística' AND asignatura = 'Competencia Matematica 2 (M2)'::asignatura
    UNION ALL
    SELECT id, 'Competencia Matematica 2 (M2)'::asignatura, 'Permutación y combinatoria'
    FROM EjesTematicos WHERE nombre = 'Probabilidad y Estadística' AND asignatura = 'Competencia Matematica 2 (M2)'::asignatura
) u;

INSERT INTO "CONTENIDO" (id_tipo_contenido, asignatura, nombre)
VALUES
    ((SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Habilidad'), 'Competencia Matematica 1 (M1)'::asignatura, 'Resolver problemas'),
    ((SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Habilidad'), 'Competencia Matematica 1 (M1)'::asignatura, 'Modelar'),
    ((SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Habilidad'), 'Competencia Matematica 1 (M1)'::asignatura, 'Representar'),
    ((SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Habilidad'), 'Competencia Matematica 1 (M1)'::asignatura, 'Argumentar'),
    ((SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Habilidad'), 'Competencia Matematica 2 (M2)'::asignatura, 'Resolver problemas'),
    ((SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Habilidad'), 'Competencia Matematica 2 (M2)'::asignatura, 'Modelar'),
    ((SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Habilidad'), 'Competencia Matematica 2 (M2)'::asignatura, 'Representar'),
    ((SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Habilidad'), 'Competencia Matematica 2 (M2)'::asignatura, 'Argumentar');

------------------------

-- HISTORIA
WITH Historia AS (
    INSERT INTO "CONTENIDO" (id_tipo_contenido, asignatura, nombre)
    VALUES (
        (SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Eje Temático'),
        'Historia y Ciencias Sociales'::asignatura,
        'Historia: Mundo, América y Chile'
    )
    RETURNING id
)
INSERT INTO "CONTENIDO" (id_tipo_contenido, asignatura, nombre, id_padre)
SELECT (SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Unidad Temática'),
       'Historia y Ciencias Sociales'::asignatura,
       'Cambios políticos, económicos, sociales y culturales del siglo XIX en Europa, América y Chile: El Estado-nación durante el siglo XIX en América y Europa',
       id
FROM Historia
UNION ALL
SELECT (SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Unidad Temática'),
       'Historia y Ciencias Sociales'::asignatura,
       'Chile durante el siglo XIX: El proceso de formación y organización de la República, la idea de nación y las transformaciones sociales de finales del siglo XIX en Chile',
       id
FROM Historia
UNION ALL
SELECT (SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Unidad Temática'),
       'Historia y Ciencias Sociales'::asignatura,
       'Europa, América y Chile durante la primera mitad del siglo XX: Procesos económicos y políticos durante la primera mitad del siglo XX en Europa, América y Chile',
       id
FROM Historia
UNION ALL
SELECT (SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Unidad Temática'),
       'Historia y Ciencias Sociales'::asignatura,
       'Segunda mitad del siglo XX y el nuevo orden internacional después de la Segunda Guerra Mundial (Europa, América y Chile): Características del nuevo orden mundial posterior a la Segunda Guerra Mundial. La sociedad chilena a mediados del siglo XX. La Dictadura Militar (1973-1990) y el retorno a la democracia en Chile.',
       id
FROM Historia;

WITH FormacionCiudadana AS (
    INSERT INTO "CONTENIDO" (id_tipo_contenido, asignatura, nombre)
    VALUES (
        (SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Eje Temático'),
        'Historia y Ciencias Sociales'::asignatura,
        'Formacion ciudadana'
    )
    RETURNING id
)
INSERT INTO "CONTENIDO" (id_tipo_contenido, asignatura, nombre, id_padre)
SELECT (SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Unidad Temática'),
       'Historia y Ciencias Sociales'::asignatura,
       'Sociedad democratica: Estado, democracia y ciudadania. Institucionalidad democratica en Chile. La democracia en la sociedad de la informacion. El acceso a la justicia y el resguardo de los derechos de las personas en Chile.',
       id
FROM FormacionCiudadana;

WITH SistemaEconomico AS (
    INSERT INTO "CONTENIDO" (id_tipo_contenido, asignatura, nombre)
    VALUES (
        (SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Eje Temático'),
        'Historia y Ciencias Sociales'::asignatura,
        'Sistema economico'
    )
    RETURNING id
)
INSERT INTO "CONTENIDO" (id_tipo_contenido, asignatura, nombre, id_padre)
SELECT (SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Unidad Temática'),
       'Historia y Ciencias Sociales'::asignatura,
       'Funcionamiento del sistema economico: Formación económica: las personas y el funcionamiento del mercado. Modelos de desarrollo y política económica.',
       id
FROM SistemaEconomico
UNION ALL
SELECT (SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Unidad Temática'),
       'Historia y Ciencias Sociales'::asignatura,
       'Derechos laborales: Importancia de los derechos laborales en Chile',
       id
FROM SistemaEconomico;

INSERT INTO "CONTENIDO" (id_tipo_contenido, asignatura, nombre)
VALUES
    ((SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Habilidad'),
     'Historia y Ciencias Sociales'::asignatura,
     'Pensamiento temporal y espacial'),
    ((SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Habilidad'),
     'Historia y Ciencias Sociales'::asignatura,
     'Analisis de fuentes de informacion'),
    ((SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Habilidad'),
     'Historia y Ciencias Sociales'::asignatura,
     'Pensamiento critico');

---------------------------------------------

-- LENGUAJE
WITH
    Conocimientos AS (
        INSERT INTO "CONTENIDO" (id_tipo_contenido, asignatura, nombre)
        VALUES
            (
                (SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Conocimiento'),
                'Competencia Lectora'::asignatura,
                'Textos literarios'
            ),
            (
                (SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Conocimiento'),
                'Competencia Lectora'::asignatura,
                'Textos no literarios'
            )
        RETURNING id, nombre
    ),
    Habilidades AS (
        INSERT INTO "CONTENIDO" (id_tipo_contenido, asignatura, nombre)
        VALUES
            (
                (SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Habilidad'),
                'Competencia Lectora'::asignatura,
                'Localizar: Extraer información explícita del texto.'
            ),
            (
                (SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Habilidad'),
                'Competencia Lectora'::asignatura,
                'Localizar: Identificar información explícita formulada a través de sinónimos y de paráfrasis.'
            ),
            (
                (SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Habilidad'),
                'Competencia Lectora'::asignatura,
                'Interpretar: Establecer la relación (problema/solución, categoría/ejemplo, causa/consecuencia, etc.) entre distintas partes o entre distintas informaciones de un texto.'
            ),
            (
                (SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Habilidad'),
                'Competencia Lectora'::asignatura,
                'Interpretar: Elaborar inferencias sobre el significado local y global del texto a partir de marcas textuales.'
            ),
            (
                (SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Habilidad'),
                'Competencia Lectora'::asignatura,
                'Interpretar: Determinar el significado de una parte, párrafo, sección o de la globalidad del texto.'
            ),
            (
                (SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Habilidad'),
                'Competencia Lectora'::asignatura,
                'Interpretar: Sintetizar las ideas centrales de una sección o del texto, Identificar la jerarquía de las ideas de una parte del texto.'
            ),
            (
                (SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Habilidad'),
                'Competencia Lectora'::asignatura,
                'Interpretar: Reconocer la función de un elemento textual (ejemplos, citas, figuras retóricas, etc.)'
            ),
            (
                (SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Habilidad'),
                'Competencia Lectora'::asignatura,
                'Evaluar: Determinar la intención comunicativa del emisor(a) o narrador(a) en función del destinatario.'
            ),
            (
                (SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Habilidad'),
                'Competencia Lectora'::asignatura,
                'Evaluar: Juzgar la información presente en el texto (como la calidad, pertinencia, suficiencia o consistencia).'
            ),
            (
                (SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Habilidad'),
                'Competencia Lectora'::asignatura,
                'Evaluar: Juzgar la forma en relación con la información del texto (como el registro, estructura, propósito, pertinencia o calidad).'
            ),
            (
                (SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Habilidad'),
                'Competencia Lectora'::asignatura,
                'Evaluar: Calificar la posición, actitud o tono del emisor(a) o narrador(a) respecto de un elemento, idea o del texto completo.'
            ),
            (
                (SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Habilidad'),
                'Competencia Lectora'::asignatura,
                'Evaluar: Valorar la pertinencia de los recursos lingüísticos y no lingüísticos (imagen, color, tipografía, disposición gráfica).'
            ),
            (
                (SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Habilidad'),
                'Competencia Lectora'::asignatura,
                'Evaluar: Valorar la información textual en relación con nuevos contextos.'
            )
        RETURNING id, nombre
    )
SELECT
    'Competencia Lectora'::asignatura AS asignatura,
    'Datos de Lenguaje insertados correctamente.';

---------------------------------------------

-- CIENCIAS

WITH
    DisciplinasCiencias AS (
        INSERT INTO "CONTENIDO" (id_tipo_contenido, asignatura, nombre)
        VALUES
            (
                (SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Eje Temático'),
                'Ciencias - Biologia'::asignatura,
                'Biología'
            ),
            (
                (SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Eje Temático'),
                'Ciencias - Fisica'::asignatura,
                'Física'
            ),
            (
                (SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Eje Temático'),
                'Ciencias - Quimica'::asignatura,
                'Química'
            )
        RETURNING id, asignatura
    ),
    TemasBiologia AS (
        INSERT INTO "CONTENIDO" (id_tipo_contenido, asignatura, nombre, id_padre)
        VALUES
            (
                (SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Unidad Temática'),
                'Ciencias - Biologia'::asignatura,
                'Organización, estructura y actividad celular',
                (SELECT id FROM DisciplinasCiencias WHERE asignatura = 'Ciencias - Biologia'::asignatura)
            ),
            (
                (SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Unidad Temática'),
                'Ciencias - Biologia'::asignatura,
                'Procesos y funciones biológicas',
                (SELECT id FROM DisciplinasCiencias WHERE asignatura = 'Ciencias - Biologia'::asignatura)
            ),
            (
                (SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Unidad Temática'),
                'Ciencias - Biologia'::asignatura,
                'Herencia y evolución',
                (SELECT id FROM DisciplinasCiencias WHERE asignatura = 'Ciencias - Biologia'::asignatura)
            ),
            (
                (SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Unidad Temática'),
                'Ciencias - Biologia'::asignatura,
                'Organismo y ambiente',
                (SELECT id FROM DisciplinasCiencias WHERE asignatura = 'Ciencias - Biologia'::asignatura)
            )
        RETURNING id
    ),
    TemasFisica AS (
        INSERT INTO "CONTENIDO" (id_tipo_contenido, asignatura, nombre, id_padre)
        VALUES
            (
                (SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Unidad Temática'),
                'Ciencias - Fisica'::asignatura,
                'Ondas',
                (SELECT id FROM DisciplinasCiencias WHERE asignatura = 'Ciencias - Fisica'::asignatura)
            ),
            (
                (SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Unidad Temática'),
                'Ciencias - Fisica'::asignatura,
                'Mecánica',
                (SELECT id FROM DisciplinasCiencias WHERE asignatura = 'Ciencias - Fisica'::asignatura)
            ),
            (
                (SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Unidad Temática'),
                'Ciencias - Fisica'::asignatura,
                'Energía-Tierra',
                (SELECT id FROM DisciplinasCiencias WHERE asignatura = 'Ciencias - Fisica'::asignatura)
            ),
            (
                (SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Unidad Temática'),
                'Ciencias - Fisica'::asignatura,
                'Electricidad',
                (SELECT id FROM DisciplinasCiencias WHERE asignatura = 'Ciencias - Fisica'::asignatura)
            )
        RETURNING id
    ),
    TemasQuimica AS (
        INSERT INTO "CONTENIDO" (id_tipo_contenido, asignatura, nombre, id_padre)
        VALUES
            (
                (SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Unidad Temática'),
                'Ciencias - Quimica'::asignatura,
                'Estructura atómica',
                (SELECT id FROM DisciplinasCiencias WHERE asignatura = 'Ciencias - Quimica'::asignatura)
            ),
            (
                (SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Unidad Temática'),
                'Ciencias - Quimica'::asignatura,
                'Química orgánica',
                (SELECT id FROM DisciplinasCiencias WHERE asignatura = 'Ciencias - Quimica'::asignatura)
            ),
            (
                (SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Unidad Temática'),
                'Ciencias - Quimica'::asignatura,
                'Reacciones químicas y estequimetría',
                (SELECT id FROM DisciplinasCiencias WHERE asignatura = 'Ciencias - Quimica'::asignatura)
            )
        RETURNING id
    ),
    HabilidadesTransversales AS (
        INSERT INTO "CONTENIDO" (id_tipo_contenido, asignatura, nombre)
        VALUES
            (
                (SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Habilidad'),
                'Ciencias - Biologia'::asignatura,
                'Observar y plantear preguntas'
            ),
            (
                (SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Habilidad'),
                'Ciencias - Biologia'::asignatura,
                'Planificar y conducir una investigación'
            ),
            (
                (SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Habilidad'),
                'Ciencias - Biologia'::asignatura,
                'Procesar y analizar la evidencia'
            ),
            (
                (SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Habilidad'),
                'Ciencias - Biologia'::asignatura,
                'Evaluar'
            ),
            (
                (SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Habilidad'),
                'Ciencias - Biologia'::asignatura,
                'Comunicar'
            ),
            (
                (SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Habilidad'),
                'Ciencias - Fisica'::asignatura,
                'Observar y plantear preguntas'
            ),
            (
                (SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Habilidad'),
                'Ciencias - Fisica'::asignatura,
                'Planificar y conducir una investigación'
            ),
            (
                (SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Habilidad'),
                'Ciencias - Fisica'::asignatura,
                'Procesar y analizar la evidencia'
            ),
            (
                (SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Habilidad'),
                'Ciencias - Fisica'::asignatura,
                'Evaluar'
            ),
            (
                (SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Habilidad'),
                'Ciencias - Fisica'::asignatura,
                'Comunicar'
            ),
            (
                (SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Habilidad'),
                'Ciencias - Quimica'::asignatura,
                'Observar y plantear preguntas'
            ),
            (
                (SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Habilidad'),
                'Ciencias - Quimica'::asignatura,
                'Planificar y conducir una investigación'
            ),
            (
                (SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Habilidad'),
                'Ciencias - Quimica'::asignatura,
                'Procesar y analizar la evidencia'
            ),
            (
                (SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Habilidad'),
                'Ciencias - Quimica'::asignatura,
                'Evaluar'
            ),
            (
                (SELECT id FROM "TIPO_CONTENIDO" WHERE nombre = 'Habilidad'),
                'Ciencias - Quimica'::asignatura,
                'Comunicar'
            )
        RETURNING id
    )
SELECT
    'Ciencias - Datos de Biología, Física y Química insertados correctamente.';