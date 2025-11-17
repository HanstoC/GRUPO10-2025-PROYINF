# Issues encontrados por SonarQube

En las imagenes contenidas en esta misma carpeta se muestran los problemas encontrados por el analizador de proyectos SonarQube, cabe destacar que en este analisis no se encuentran problemas de seguridad, y la mayoria son de fiabilidad y mantenibilidad.

En la imagen "general" y "general2" se muestra el resumen donde se aprecia lo anteriormente comentado. Además se puede ver que solo existe un problema de severidad alta, el que se explicara más adelante.

Respecto al problema de severidad alta, se puede apreciar en la imagen con este mismo nombre que, a pesar de tener una mayor importancia para el analizador de problemas, este solo afecta a un codigo que se preocupa de cargar información en la BD para realizar las pruebas por lo que no es esencialmente de la aplicación. por lo que no se considerará para la mejoria del codigo.

Los recomendaciones que se considerarán son las que llevan a errores de fiabilidad, como primer arreglo se realizara el cambio respectivo de "parsefloat" a "Number.parseFloat" en distintos servicios del backend ya que esto puede llevar a comportamientos inedeseados en la aplicación (estos errores se muestran en la imagen "erroresParseFloat") sin el arreglo se obtienen 65 porblemas de severidad media.

Al Arreglar el problema descrito anteriormente se procede a realizar nuevamente el analisis de sonarQube lo que entrega un total de 53 problemas de severidad media

Otro problema a resolver del mismo indole que el primero es utilizar Number.parseInt sobre parseInt, Actualmente el proyecto obtiene 53 problemas de severidad media y realizando este arreglo se obtienen 34 problemas de esta misma severidad.

Asi la mayoria de problemas detectados son de consistencia, se tratara de arreglar la mayoria de estos (reemplazar isNaN por Number.isNan y especificar los path y fs como node:path y node:fs) realizando estos arreglos se llega al numero de 12 problemas de severidad media.

Además gracias a la aplicación detectamos un archivo duplicado lo que aumentaba considerablemente los errores detectados, luego de eliminar este archivo SonarQube aprobo sus puntos de control, lo que queda expuesto en las imagenes LastFix y LastFix2