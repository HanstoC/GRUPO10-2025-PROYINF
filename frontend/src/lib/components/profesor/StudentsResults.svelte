<script lang="ts">
	import { onMount } from 'svelte';
	import Card from '../common/Card.svelte';
	import SearchBar from '../common/SearchBar.svelte';
	import LoadingIndicator from '../common/utils/LoadingIndicator.svelte';

	let currentPage = 1;
	const itemsPerPage = 5;

	$: totalPages = Math.ceil(alumnosFiltrados.length / itemsPerPage);

	$: alumnosPaginados = alumnosFiltrados.slice(
  		(currentPage - 1) * itemsPerPage,
  		currentPage * itemsPerPage
	);

	interface Alumno {
		id: number;
		nombre: string;
		rut: string;
		curso: string;
	}

	interface Resultado {
		id_ensayo: number;
		asignatura: string;
		dificultad: string;
		puntaje: number;
	}

	let alumnos: Alumno[] = [];
	let resultados: Resultado[] = [];
	let query = '';
	let loadingAlumnos = false;
	let loadingResultados = false;
	let selectedAlumno: Alumno | null = null;

	onMount(async () => {
	loadingAlumnos = true;
		try {
			const res = await fetch('http://localhost:8000/alumnos', {
				credentials: 'include'
			});
			const data = await res.json();

			// Aplanar los alumnos desde cada curso
			alumnos = data.flatMap((curso: any) =>
				curso.alumnos.map((a: any) => ({
					id: a.id,
					nombre: `${a.nombre} ${a.paterno} ${a.materno}`,
					rut: a.rut,
					curso: curso.nivel + ' ' + curso.letra // por ejemplo "1ro Medio A"
				}))
			);
		} catch (err) {
			console.error('Error cargando alumnos:', err);
		} finally {
			loadingAlumnos = false;
		}
	});

	async function cargarResultados(id: number) {
		loadingResultados = true;
		resultados = [];
		selectedAlumno = alumnos.find((a) => a.id === id) ?? null;

		try {
			const res = await fetch(`http://localhost:8000/resultados?alumno=${id}`, {
				credentials: 'include'
			});
			resultados = await res.json();
		} catch (err) {
			console.error('Error cargando resultados:', err);
		} finally {
			loadingResultados = false;
		}
	}

	// Computar resultados filtrados
	$: alumnosFiltrados = query.trim()
		? alumnos.filter(
				(a) =>
					a.nombre.toLowerCase().includes(query.toLowerCase()) ||
					a.rut.toLowerCase().includes(query.toLowerCase())
			)
		: alumnos;
</script>
<Card class="flex w-full flex-col gap-4 p-4">
	<h2 class="text-xl font-semibold">Resultados de alumnos</h2>

	<SearchBar bind:value={query} placeholder="Buscar alumnos por nombre o RUT" />

	{#if loadingAlumnos}
		<div class="flex justify-center p-4">
			<LoadingIndicator size="md" />
		</div>
	{:else if alumnosFiltrados.length === 0}
		<p class="italic opacity-50">No se encontraron alumnos.</p>
	{:else}
		<ul class="flex flex-col gap-2">
			{#each alumnosPaginados as alumno}
				<li
					on:click={() => cargarResultados(alumno.id)}
					class="cursor-pointer border rounded p-3 shadow-sm bg-card"
				>
					<p class="font-bold">{alumno.nombre}</p>
					<p class="text-sm text-gray-600">RUT: {alumno.rut} · Curso: {alumno.curso}</p>
				</li>
			{/each}
		</ul>
	{/if}
	{#if totalPages > 1}
  <div class="flex justify-center gap-2 mt-4 w-full">
    <button
      on:click={() => currentPage = Math.max(1, currentPage - 1)}
      disabled={currentPage === 1}
      class="px-3 py-1 border rounded  hover:bg-gray-200 disabled:opacity-50 hover:text-black"
    >
      Anterior
    </button>
    {#each Array(totalPages) as _, i}
      <button
        on:click={() => currentPage = i + 1}
        class="px-3 py-1 border rounded hover:bg-blue-100 hover:text-black {currentPage === i + 1 ? 'bg-blue-300 font-bold' : ''}"
      >
        {i + 1}
      </button>
    {/each}
    <button
      on:click={() => currentPage = Math.min(totalPages, currentPage + 1)}
      disabled={currentPage === totalPages}
      class="px-3 py-1 border rounded hover:bg-gray-200 disabled:opacity-50 hover:text-black"
    >
      Siguiente
    </button>
  </div>
{/if}
</Card>

{#if selectedAlumno}
	<Card class="flex w-full flex-col gap-4 p-4">
		<h3 class="text-lg font-bold">Resultados de {selectedAlumno.nombre}</h3>
		{#if loadingResultados}
			<LoadingIndicator size="md" />
		{:else if resultados.length === 0}
			<p class="italic opacity-50">Este alumno no tiene resultados registrados.</p>
		{:else}
			<ul class="flex flex-col gap-2">
				{#each resultados as r}
					<li class="border rounded p-3 shadow-sm bg-white hover:bg-gray-100">
						<div class="flex justify-between items-center">
							<div>
							<p class="font-bold">{alumno.nombre}</p>
							<p class="text-sm text-gray-600">RUT: {alumno.rut} · Curso: {alumno.curso}</p>
							</div>
							<button
							class="text-blue-600 text-sm underline"
							on:click={() => cargarResultados(alumno.id)}
							>
							Ver resultados
							</button>
						</div>
					</li>

				{/each}
			</ul>
		{/if}
	</Card>
{/if}