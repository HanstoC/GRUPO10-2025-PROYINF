<script lang="ts">
	import Card from '../common/Card.svelte';
	import SearchBar from '../common/SearchBar.svelte';
	import { API } from '$lib/global/api'; 

	
	let alumnos = $state([]); // Aquí guardaremos la lista de alumnos
	let cargando = $state(true); // Para mostrar un indicador de carga
	let error = $state(''); // Para mostrar mensajes de error

	
	$effect(() => {
		cargarAlumnos();
	});

	
	async function cargarAlumnos() {
		try {
			// Reiniciar estados para nueva carga (útil si se implementara un botón de recarga)
			cargando = true;
			error = '';

			// Realizamos la petición GET a nuestro endpoint de alumnos
			// API.ALUMNOS() ahora apunta a "http://localhost:8000/AllAlumnos"
			const respuesta = await fetch(API.ALUMNOS());

			// Verificamos si la respuesta fue exitosa (código de estado HTTP 2xx)
			if (!respuesta.ok) {
				// Si la respuesta no fue OK, lanzamos un error con un mensaje descriptivo
				const errorData = await respuesta.json().catch(() => ({ message: 'Error desconocido del servidor.' }));
				throw new Error(`Error ${respuesta.status}: ${errorData.message || 'No se pudieron cargar los alumnos.'}`);
			}

			// Parseamos la respuesta JSON y la asignamos a nuestra variable de estado `alumnos`
			alumnos = await respuesta.json();
		} catch (e) {
			// Capturamos cualquier error (de red, de parseo, o el lanzado arriba)
			// y lo guardamos en la variable 'error' para mostrarlo al usuario.
			error = e instanceof Error ? e.message : 'Ocurrió un error inesperado al cargar los alumnos.';
		} finally {
			// Finalmente, sin importar si hubo éxito o error, desactivamos el estado de carga.
			cargando = false;
		}
	}
</script>

<Card class="flex w-full flex-col gap-4">
	<h2 class="text-xl font-semibold">Alumnos Agrupados</h2>
	<SearchBar placeholder="Buscar alumnos" />

	<div class="mt-4">
		{#if cargando}
			<div class="flex justify-center py-4">
				<div class="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
				<p class="ml-2 text-gray-600">Cargando alumnos...</p>
			</div>
		{:else if error}
			<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
				<strong class="font-bold">¡Error!</strong>
				<span class="block sm:inline"> {error}</span>
				<p class="text-sm mt-1">Por favor, intenta recargar la página.</p>
			</div>
		{:else if alumnos.length === 0}
			<div class="p-4 text-center text-gray-500 bg-gray-50 rounded-md">
				<p>No hay alumnos registrados o disponibles en este momento.</p>
			</div>
		{:else}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{#each alumnos as alumno (alumno.id)}
					<div class="border border-gray-200 p-4 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow duration-200">
						<h3 class="font-bold text-lg text-gray-800">
                            {alumno.nombre}
                        </h3>
						<p class="text-sm text-gray-600">RUT: {alumno.rut}</p>
						<p class="text-sm text-gray-600">Email: {alumno.email || 'No disponible'}</p>
                        <p class="text-sm text-gray-600 mt-2 font-medium">
                            Curso: {alumno.curso_nivel} {alumno.curso_letra}
                        </p>
                        <p class="text-xs text-gray-500">
                            Tipo de Enseñanza: {alumno.curso_tipo_ensenanza} (Código: {alumno.curso_codigo})
                        </p>
						</div>
				{/each}
			</div>
		{/if}
	</div>
</Card>
