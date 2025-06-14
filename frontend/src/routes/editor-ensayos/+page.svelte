<script lang="ts">
	import Card from '$lib/components/common/Card.svelte';
	import PageMargin from '$lib/components/common/PageMargin.svelte';
	import Form from '$lib/components/common/Form';
	import Input from '$lib/components/common/Input.svelte';
	import FileInput from '$lib/components/common/FileInput.svelte';

	let pregunta: any = $state({});
	let imagenes: FileList | undefined = $state();
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
