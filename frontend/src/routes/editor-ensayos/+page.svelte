<script lang="ts">
	import Button from '$lib/components/common/Button.svelte';
	import Card from '$lib/components/common/Card.svelte';
	import FileInput from '$lib/components/common/FileInput.svelte';
	import Input from '$lib/components/common/Input.svelte';
	import PageMargin from '$lib/components/common/PageMargin.svelte';
	import Form from '$lib/components/common/Form';
	import { API } from '$lib/global/api';

	const pregunta: {
		[key: string]: string;
	} = $state({
		pregunta: '',
		respuesta1: '',
		respuesta2: '',
		respuesta3: '',
		respuesta4: '',
		topico: ''
	});
	let imagenes: FileList | null = $state(null);

	async function guardarPregunta() {
		const payload = pregunta;
		const res = await fetch(API.GUARDAR_PREGUNTA, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload)
		});

		if (res.ok) console.log('Pregunta guardada');
		else console.error('Error al guardar la pregunta');
	}
</script>

<PageMargin>
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
			<Form.Footer>
				<Button onclick={guardarPregunta}>Guardar Pregunta</Button>
			</Form.Footer>
		</Form.Root>
	</Card>

	<p>
		{JSON.stringify(pregunta)}
		{JSON.stringify(imagenes)}
	</p>
</PageMargin>
