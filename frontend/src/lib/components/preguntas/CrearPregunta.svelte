<script lang="ts">
	import Button from '$lib/components/common/Button.svelte';
	import Card from '$lib/components/common/Card.svelte';
	import FileInput from '$lib/components/common/FileInput.svelte';
	import Input from '$lib/components/common/Input.svelte';
	import Form from '$lib/components/common/Form';
	import { API } from '$lib/global/api';

	export let onSuccess: () => void = () => {};
	export let onError: (error: string) => void = () => {};

	const pregunta: {
		[key: string]: string;
	} = $state({
		pregunta: '',
		respuesta1: '',
		respuesta2: '',
		respuesta3: '',
		respuesta4: '',
		topico: '',
		respuestaCorrecta: ''
	});
	let imagenes: FileList | null = $state(null);
	let loading = $state(false);

	async function guardarPregunta() {
		loading = true;
		try {
			const payload = pregunta;
			const res = await fetch(API.GUARDAR_PREGUNTA, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(payload)
			});

			if (!res.ok) throw new Error('Error al guardar la pregunta');
			
			// Reset form
			pregunta.pregunta = '';
			pregunta.respuesta1 = '';
			pregunta.respuesta2 = '';
			pregunta.respuesta3 = '';
			pregunta.respuesta4 = '';
			pregunta.topico = '';
			pregunta.respuestaCorrecta = '';
			imagenes = null;

			onSuccess();
		} catch (e) {
			onError(e instanceof Error ? e.message : 'Error desconocido');
		} finally {
			loading = false;
		}
	}
</script>

<Card class="w-full">
	<Form.Root class="flex h-full w-full flex-col items-center justify-center gap-2">
		<Form.Item>
			<Form.Label>Tópico</Form.Label>
			<Input bind:value={pregunta.topico} />
		</Form.Item>
		<Form.Item>
			<Form.Label>Enunciado</Form.Label>
			<Input bind:value={pregunta.pregunta} />
		</Form.Item>
		<Form.Item>
			<Form.Label>Imágen del enunciado</Form.Label>
			<FileInput bind:value={imagenes} />
		</Form.Item>
		{#each ['A', 'B', 'C', 'D'] as alternativa, i}
			<Form.Item>
				<Form.Label>Alternativa {alternativa}</Form.Label>
				<Input bind:value={pregunta['respuesta' + (i + 1)]} />
			</Form.Item>
		{/each}
		<Form.Item>
			<Form.Label>Respuesta Correcta</Form.Label>
			<div class="flex flex-col sm:flex-row gap-2 sm:gap-4">
				{#each ['A', 'B', 'C', 'D'] as alternativa, i}
					<label class="flex items-center gap-2 p-2 border rounded hover:bg-accent/50 cursor-pointer">
						<input
							type="radio"
							bind:group={pregunta.respuestaCorrecta}
							value={String(i + 1)}
							class="h-4 w-4"
						/>
						<span class="text-sm sm:text-base">Alternativa {alternativa}</span>
					</label>
				{/each}
			</div>
		</Form.Item>
		<Form.Footer>
			<Button {loading} onclick={guardarPregunta}>Guardar Pregunta</Button>
		</Form.Footer>
	</Form.Root>
</Card> 