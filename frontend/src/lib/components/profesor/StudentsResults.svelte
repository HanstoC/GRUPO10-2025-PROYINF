<script lang="ts">
	import Card from '../common/Card.svelte';
	import SearchBar from '../common/SearchBar.svelte';
	import LoadingIndicator from '../common/utils/LoadingIndicator.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import Paginator from '$lib/components/common/Paginator.svelte';
	import { flip } from 'svelte/animate';

	let currentPage = $state(1);
	const itemsPerPage = 5;

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

	let alumnos = $state<Alumno[]>([]);
	let resultados = $state<Resultado[]>([]);
	let query = $state('');
	let loadingAlumnos = $state(true);
	let loadingResultados = $state(false);
	let selectedAlumno = $state<Alumno | null>(null);

	// Carga inicial de alumnos
	(async () => {
		try {
			const res = await fetch('http://localhost:8000/alumnos', {
				credentials: 'include'
			});
			const data = await res.json();
			alumnos = data.flatMap((curso: any) =>
				curso.alumnos.map((a: any) => ({
					id: a.id,
					nombre: `${a.nombre} ${a.paterno} ${a.materno}`,
					rut: a.rut,
					curso: `${curso.nivel} ${curso.letra}`
				}))
			);
		} catch (err) {
			console.error('Error cargando alumnos:', err);
		} finally {
			loadingAlumnos = false;
		}
	})();

	async function cargarResultados(id: number) {
		loadingResultados = true;
		resultados = [];
		selectedAlumno = alumnos.find((a) => a.id === id) ?? null;

		if (!selectedAlumno) {
			loadingResultados = false;
			return;
		}

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

	function handleKeydown(event: KeyboardEvent, alumnoId: number) {
		if (event.key === 'Enter' || event.key === ' ') {
			cargarResultados(alumnoId);
		}
	}

	const alumnosFiltrados = $derived(
		query.trim()
			? alumnos.filter(
					(a) =>
						a.nombre.toLowerCase().includes(query.toLowerCase()) ||
						a.rut.toLowerCase().includes(query.toLowerCase())
				)
			: alumnos
	);

	const totalPages = $derived(Math.ceil(alumnosFiltrados.length / itemsPerPage));

	const alumnosPaginados = $derived(
		alumnosFiltrados.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
	);
</script>

<Card class="w-full! h-full! flex flex-col gap-4 p-4">
	<h2 class="text-xl font-semibold">Resultados de alumnos</h2>
	<SearchBar bind:value={query} placeholder="Buscar alumnos por nombre o RUT" />

	{#if loadingAlumnos}
		<div class="flex justify-center p-4">
			<LoadingIndicator size="lg" />
		</div>
	{:else if alumnosFiltrados.length === 0}
		<p class="italic opacity-50">No se encontraron alumnos.</p>
	{:else}
		<ul class="flex h-full flex-col gap-2">
			{#each alumnosPaginados as alumno (alumno.id)}
				<div class="flex h-full w-full">
					<Button
						tabindex={0}
						onclick={() => cargarResultados(alumno.id)}
						onkeydown={(e) => handleKeydown(e, alumno.id)}
						variant="outlined"
						class="flex h-full w-full flex-col items-center justify-center"
					>
						<p class="font-bold">{alumno.nombre}</p>
						<p class="text-sm text-gray-600">RUT: {alumno.rut} · Curso: {alumno.curso}</p>
					</Button>
				</div>
			{/each}
		</ul>
	{/if}

	<Paginator bind:currentPage {totalPages} />
</Card>

{#if selectedAlumno}
	<Card class="mt-4 flex w-full flex-col gap-4 p-4">
		<h3 class="text-lg font-bold">Resultados de {selectedAlumno.nombre}</h3>
		{#if loadingResultados}
			<div class="flex justify-center p-4">
				<LoadingIndicator size="lg" />
			</div>
		{:else if resultados.length === 0}
			<p class="italic opacity-50">Este alumno no tiene resultados registrados.</p>
		{:else}
			<ul class="flex flex-col gap-2">
				{#each resultados as r}
					<li class="rounded border bg-white p-3 shadow-sm">
						<div class="flex items-center justify-between">
							<div>
								<p class="font-bold">{r.asignatura}</p>
								<p class="text-sm text-gray-600">Dificultad: {r.dificultad}</p>
							</div>
							<p class="text-lg font-semibold">{r.puntaje} pts</p>
						</div>
					</li>
				{/each}
			</ul>
		{/if}
	</Card>
{/if}
