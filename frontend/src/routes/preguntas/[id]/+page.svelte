<script lang="ts">
	import Card from '$lib/components/common/Card.svelte';
	import { Usuario } from '$lib/auth.svelte';
	import Form from '$lib/components/common/Form';
	import Input from '$lib/components/common/Input.svelte';
	import FileInput from '$lib/components/common/FileInput.svelte';
	import LoadingIndicator from '$lib/components/common/utils/LoadingIndicator.svelte';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { page } from '$app/stores';

	let loading = true;
	let pregunta;

	let imagenes: FileList | undefined;
	let asignaturas = [];
	let id_asignatura = 1;

	onMount(async () => {
		const { id: preguntaId } = get(page).params;
		try {
			const response = await fetch(`http://localhost:8000/preguntas/${preguntaId}`, {
				credentials: 'include'
			});
			pregunta = await response.json();
			id_asignatura = pregunta.id_asignatura;
		} catch (e) {
			console.error('Error al carga pregunta:', e);
		}

		try {
			const response = await fetch('http://localhost:8000/asignaturas', {
				credentials: 'include'
			});
			asignaturas = await response.json();
		} catch (e) {
			console.error('Error al cargar asignaturas:', e);
		}
		loading = false;
	});

	async function toBase64(file: File): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = reject;
		});
	}

	async function actualizarPregunta() {
		let imagenBase64 = null;
		if (imagenes && imagenes.length > 0) {
			imagenBase64 = await toBase64(imagenes[0]);
		}

		const respuestas = pregunta.alternativas.map((alternativa) => ({
			id: alternativa.id,
			texto: alternativa.texto,
			es_correcta: alternativa.id === pregunta.correcta
		}));

		const payload = {
			id_asignatura,
			id_tematica: pregunta.id_tematica,
			id_profesor: Usuario?.value.id,
			topico: pregunta.topico,
			enunciado: pregunta.enunciado,
			imagen: imagenBase64,
			respuestas
		};

		const res = await fetch(`http://localhost:8000/preguntas/${pregunta.id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify(payload)
		});

		if (res.ok) {
			alert('Pregunta actualizada con éxito');
			history.back();
		} else {
			const err = await res.text();
			alert('Error al guardar: ' + err);
		}
	}
</script>

<Card class="w-full">
	{#if loading}
		<LoadingIndicator size="lg" />
	{:else}
		<Form.Root
			onsubmit|preventDefault={actualizarPregunta}
			class="flex h-full w-full flex-col items-center justify-center gap-2"
		>
			<Form.Item required label="Asignatura">
				<select bind:value={id_asignatura} class="bg-card w-full rounded border p-1">
					{#each asignaturas as a}
						<option value={a.id}>{a.nombre}</option>
					{/each}
				</select>
			</Form.Item>

			<Form.Item required label="Tópico">
				<Input bind:value={pregunta.topico} placeholder="Ej: Gramática" />
			</Form.Item>

			<Form.Item required label="Enunciado">
				<Input bind:value={pregunta.enunciado} />
			</Form.Item>

			<Form.Item label="Imagen">
				<FileInput bind:value={imagenes} />
			</Form.Item>

			{#each ['A', 'B', 'C', 'D'] as letra, i}
				<Form.Item label={`Alternativa ${letra}`}>
					<div class="flex items-center gap-2">
						<input
							type="radio"
							name="correcta"
							bind:group={pregunta.correcta}
							value={pregunta.alternativas[i].id}
						/>
						<Input bind:value={pregunta.alternativas[i].texto} />
					</div>
				</Form.Item>
			{/each}

			<Form.Footer>
				<button
					type="button"
					class="rounded bg-blue-400 px-4 py-2 text-white"
					on:click={actualizarPregunta}
				>
					Actualizar Pregunta
				</button>
			</Form.Footer>
		</Form.Root>
	{/if}
</Card>
