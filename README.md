# GRUPO 1
Este es el repositorio del grupo 1, cuyos integrantes son:

* Nicolás Muñoz Ramírez Rol: 202104641-0
* Lucas Enríquez  Rol: 202373521-3
* Cristobal Martinez Rol: 201941541-7
* Hans Toledo Rol: 201704591-4
  
* **tutor** : Sebastian Salgado

## WIKI
Puede acceder a la Wiki mediante el siguiente [enlace](https://github.com/HanstoC/GRUPO01-2025-PROYINF/wiki)

## Videos

* [video resultados finales Hito 5](https://youtu.be/zY7TzRxbgvU)

* [video presentacion Hito 3](https://youtu.be/6xBzfmOZk-A)

* [video presentacion cliente](https://aula.usm.cl/pluginfile.php/6994529/mod_resource/content/1/video1943571039.mp4)


## Proyecto Svelte

Este es un proyecto creado con [Svelte](https://svelte.dev/).

## Requisitos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

- [Node.js](https://nodejs.org/)(última version)
- [npm](https://www.npmjs.com/) 
- [Docker](https://docs.docker.com/get-started/get-docker/)

Puedes verificar si los tienes instalados con:
```
node -v
npm -v
```

## Instalación

Clona el repositorio:
```
git clone https://github.com/HanstoC/GRUPO01-2025-PROYINF.git
```
Luego visualizaras dos carpetas, frontend y backend, para poder levantar todo necesitaras tener abierto docker y ejecutar el siguiente comando
```
docker compose up --build

```

si ya existen elementos es necesario volver a iniciarla, para poder bajar los volumenes se debe utilizar:
```
docker compose down --volumes

```
## Dentro de la página

Dento del proyecto, en la carpeta db se encuentra la información de los usuarios creados a modo de prueba de igual manera las credenciales para cada uno son:

- Profesor:
  ```
  rut: 11223344-5
  contraseña: profesor123

  ```
- Alumno:
  ```
  rut: 55667788-9
  contraseña: alumnocomun

  ```

- Visualizador de reportes:
  ```
  rut: 22334455-6
  contraseña: visualizadorcomun

  ```

## Scripts

para poder tener mayor cantidad de datos en la plataforma se implemento un script que carga datos en las bases de datos, para poder ejecutarlo en docker son necesarios los siguientes comandos ejecutandolos en otra terminal:
  ```
docker exec -it proyectoanalisis-backend-1 sh
npm run "cargar info"
  ```

## Comandos utiles:

- docker compose up Si quieren levantar el proyecto en segundo plano pueden usar:
- docker compose up -d Para ver el estado de los servicios que están corriendo:
- docker compose ps Para ver los logs en tiempo real de todos los servicios:
- docker compose logs -f O de un servicio específico:
- docker compose logs -f nombre_servicio Para reiniciar un servicio específico:
- docker compose restart nombre_servicio Para detener todos los contenedores sin eliminar volúmenes:
- docker compose down


