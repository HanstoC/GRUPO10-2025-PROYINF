<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { get } from 'svelte/store';
	import { goto } from '$app/navigation';
	import { EnsayosService } from '$lib/api/ensayos';

	let ensayoId: string;
	let ensayo = { id_asignatura: '', dificultad: '', preguntas: [] };
	let todasPreguntas = [];
	let preguntasSeleccionadas: number[] = [];

	let cargando = true;

	let preguntasDisponibles = [];

	onMount(async () => {
		ensayoId = get(page).params.id;

		try {
			const resEnsayo = await fetch(`http://localhost:8000/ensayos/${ensayoId}`, {
				credentials: 'include'
			});
			ensayo = await resEnsayo.json();

			todasPreguntas = await EnsayosService.preguntas(ensayoId);
			preguntasSeleccionadas = todasPreguntas.map((p) => p.pregunta_id);

			const resAll = await fetch(
				`http://localhost:8000/preguntas?asignatura=${ensayo.id_asignatura}`,
				{
					credentials: 'include'
				}
			);
			preguntasDisponibles = await resAll.json();

			cargando = false;
		} catch (err) {
			console.error('Error:', err);
		}
	});

	async function guardar() {
		const payload = {
			id_asignatura: ensayo.id_asignatura,
			dificultad: ensayo.dificultad,
			preguntas: preguntasSeleccionadas
		};

		try {
			const res = await fetch(`http://localhost:8000/ensayos/${ensayoId}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify(payload)
			});

			if (res.ok) {
				alert('Ensayo actualizado');
				goto('/');
			} else {
				alert('Error al guardar');
			}
		} catch (err) {
			console.error(err);
		}
	}

	function togglePregunta(id: number) {
		if (preguntasSeleccionadas.includes(id)) {
			preguntasSeleccionadas = preguntasSeleccionadas.filter((pid) => pid !== id);
		} else {
			preguntasSeleccionadas = [...preguntasSeleccionadas, id];
		}
	}
</script>

{#if cargando}
	<p>Cargando ensayo...</p>
{:else}
	<h1 class="text-xl font-bold">Editar preguntas del ensayo #{ensayoId}</h1>

	<h2 class="mt-4 text-lg font-semibold">Preguntas actuales</h2>
	<ul class="mt-2">
		{#each todasPreguntas as p}
			<li class="mb-2">
				<label>
					<input
						type="checkbox"
						checked={preguntasSeleccionadas.includes(p.pregunta_id)}
						on:change={() => togglePregunta(p.pregunta_id)}
					/>
					{p.pregunta}
				</label>
			</li>
		{/each}
	</ul>

	<h2 class="mt-8 text-lg font-semibold">Agregar nuevas preguntas</h2>
	<ul class="mt-2">
		{#each preguntasDisponibles as p}
			{#if !preguntasSeleccionadas.includes(p.id)}
				<li class="mb-2">
					<label>
						<input type="checkbox" on:change={() => togglePregunta(p.id)} />
						{p.enunciado}
					</label>
				</li>
			{/if}
		{/each}
	</ul>

	<button on:click={guardar} class="mt-6 rounded bg-blue-600 px-4 py-2 text-white">
		Guardar cambios
	</button>
{/if}
