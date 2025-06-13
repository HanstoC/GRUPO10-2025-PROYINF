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

<PageMargin backButton>
	<Card class="w-full">
		<Form.Root
			onsubmit={() => {}}
			class="flex h-full w-full flex-col items-center justify-center gap-2"
		>
			<Form.Item required label="Tópico">
				<Input bind:value={pregunta.topico} />
			</Form.Item>
			<Form.Item required label="Enunciado">
				<Input bind:value={pregunta.pregunta} />
			</Form.Item>
			<Form.Item label="Imagen">
				<FileInput bind:value={imagenes} />
			</Form.Item>
			{#each ['A', 'B', 'C', 'D'] as alternativa, i}
				<Form.Item label={'Alternativa ' + alternativa}>
					<Input bind:value={pregunta['respuesta' + (i + 1)]} />
				</Form.Item>
			{/each}
			<Form.Footer>
				<Form.Submit>Guardar Pregunta</Form.Submit>
			</Form.Footer>
		</Form.Root>
	</Card>

	<p>
		{JSON.stringify(pregunta)}
		{JSON.stringify(imagenes)}
	</p>
</PageMargin>
