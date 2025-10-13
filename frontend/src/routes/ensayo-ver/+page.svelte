<script lang="ts">
	import Card from '$lib/components/common/Card.svelte';
	import PageMargin from '$lib/components/common/PageMargin.svelte';
	import Form from '$lib/components/common/Form';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let asignaturas: any[] = [];
	let id_asignatura = '';
	let preguntas: any[] = [];
	let preguntasSeleccionadas: number[] = [];
	let dificultad = 'Fácil';
	let id_profesor = 1;

	onMount(async () => {
		const res = await fetch('http://localhost:8000/asignaturas', {
			method: 'GET',
			credentials: 'include'
		});
		asignaturas = await res.json();
		if (asignaturas.length) id_asignatura = asignaturas[0].id;
	});

	//Cada vez que cambia la asignatura, carga nuevas preguntas y limpia selección
	$: if (id_asignatura) {
		preguntas = [];
		preguntasSeleccionadas = []; //esto limpia las selecciones previas

		fetch(`http://localhost:8000/preguntas?asignatura=${id_asignatura}`, {
			credentials: 'include'
		})
			.then((res) => res.json())
			.then((data) => {
				preguntas = data;
			})
			.catch((err) => {
				console.error('Error cargando preguntas', err);
			});
	}

	async function loadPreguntas(asignaturaId: string) {
		try {
			const res = await fetch(`http://localhost:8000/preguntas?asignatura=${asignaturaId}`, {
				credentials: 'include'
			});
			preguntas = await res.json();
		} catch (err) {
			console.error('Error cargando preguntas', err);
			preguntas = [];
		}
	}

	async function guardarEnsayo() {
		if (!id_asignatura || !id_profesor || preguntasSeleccionadas.length === 0) {
			alert('Completa todos los campos y selecciona al menos una pregunta.');
			return;
		}

		const res = await fetch('http://localhost:8000/ensayos', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify({
				id_asignatura: Number(id_asignatura),
				id_profesor,
				dificultad,
				preguntas: preguntasSeleccionadas
			})
		});

		if (res.ok) {
			alert('Ensayo creado con éxito');
			goto('/ensayos');
		} else {
			alert('Error al crear ensayo');
		}
	}
</script>

<PageMargin backButton>
	<Card class="w-full">
		<Form.Root onsubmit|preventDefault={guardarEnsayo} class="flex flex-col gap-4">
			<Form.Item label="Asignatura">
				<select bind:value={id_asignatura} class="bg-card w-full rounded border p-2">
					{#each asignaturas as a}
						<option value={a.id}>{a.nombre}</option>
					{/each}
				</select>
			</Form.Item>

			<Form.Item label="Dificultad">
				<select bind:value={dificultad} class="bg-card w-full rounded border p-2">
					<option value="Fácil">Fácil</option>
					<option value="Media">Media</option>
					<option value="Difícil">Difícil</option>
				</select>
			</Form.Item>

			<Form.Item label="Preguntas disponibles">
				{#if preguntas.length}
					{#each preguntas as p}
						<label class="my-1 flex items-center gap-2">
							<input
								type="checkbox"
								value={p.id}
								on:change={(e) => {
									const checked = e.currentTarget?.checked;
									if (checked) {
										preguntasSeleccionadas = [...preguntasSeleccionadas, p.id];
									} else {
										preguntasSeleccionadas = preguntasSeleccionadas.filter((id) => id !== p.id);
									}
								}}
							/>
							{p.enunciado}
						</label>
					{/each}
				{:else}
					<p class="text-sm text-gray-500 italic">No hay preguntas para esta asignatura.</p>
				{/if}
			</Form.Item>

			<Form.Footer>
				<button
					type="button"
					class="rounded bg-blue-400 px-4 py-2 text-white"
					on:click={guardarEnsayo}
				>
					Crear Ensayo
				</button>
			</Form.Footer>
		</Form.Root>
	</Card>
</PageMargin>
