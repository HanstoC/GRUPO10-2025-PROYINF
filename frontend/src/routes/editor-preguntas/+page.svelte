<script lang="ts">
	import Card from '$lib/components/common/Card.svelte';
	import PageMargin from '$lib/components/common/PageMargin.svelte';
	import Form from '$lib/components/common/Form';
	import Input from '$lib/components/common/Input.svelte';
	import FileInput from '$lib/components/common/FileInput.svelte';
	import { onMount } from 'svelte';

	let pregunta = {
		topico: '',
		pregunta: '',
		alternativas: ['', '', '', ''],
		correcta: 0
	};

	let imagenes: FileList | undefined;
	let asignaturas = [];
	let id_asignatura = '';
	let id_profesor = 1;

	onMount(async () => {
		const res = await fetch('http://localhost:8000/asignaturas', {
			method: 'GET',
			credentials: 'include'
		});
		asignaturas = await res.json();
		if (asignaturas.length) {
			id_asignatura = asignaturas[0].id;
		}
	});

	async function toBase64(file: File): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = reject;
		});
	}

	async function guardarPregunta() {

		let imagenBase64 = null;
		if (imagenes && imagenes.length > 0) {
			imagenBase64 = await toBase64(imagenes[0]);
		}

		const respuestas = pregunta.alternativas.map((texto, i) => ({
			texto,
			es_correcta: i === pregunta.correcta
		}));

		const payload = {
			id_asignatura,
			id_profesor,
			topico: pregunta.topico,
			pregunta: pregunta.pregunta,
			imagen: imagenBase64,
			respuestas
		};

		const res = await fetch('http://localhost:8000/preguntas', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
			body: JSON.stringify(payload)
		});

		if (res.ok) {
			alert('Pregunta guardada con éxito');
		} else {
			const err = await res.text();
			alert('Error al guardar: ' + err);
		}
	}
</script>

<PageMargin backButton>
	<Card class="w-full">
		<Form.Root
			onsubmit|preventDefault={guardarPregunta}
			class="flex h-full w-full flex-col items-center justify-center gap-2"
		>
			<Form.Item required label="Asignatura">
				<select bind:value={id_asignatura} class="w-full border rounded p-1">
					{#each asignaturas as a}
						<option value={a.id}>{a.nombre}</option>
					{/each}
				</select>
			</Form.Item>

			<Form.Item required label="Tópico">
				<Input bind:value={pregunta.topico} placeholder="Ej: Gramática" />
			</Form.Item>

			<Form.Item required label="Enunciado">
				<Input bind:value={pregunta.pregunta} />
			</Form.Item>

			<Form.Item label="Imagen">
				<FileInput bind:value={imagenes} />
			</Form.Item>

			{#each ['A', 'B', 'C', 'D'] as letra, i}
				<Form.Item label={`Alternativa ${letra}`}>
					<div class="flex items-center gap-2">
						<input type="radio" name="correcta" bind:group={pregunta.correcta} value={i} />
						<Input bind:value={pregunta.alternativas[i]} />
					</div>
				</Form.Item>
			{/each}

			<Form.Footer>
				<button
					type="button"
					class="bg-blue-400 text-white px-4 py-2 rounded"
					on:click={guardarPregunta}
				>
					Guardar Pregunta
				</button>
			</Form.Footer>
		</Form.Root>
	</Card>

</PageMargin>
