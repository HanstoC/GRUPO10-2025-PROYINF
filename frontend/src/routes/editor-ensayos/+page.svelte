<script lang="ts">
	import { API } from '$lib/global/api';
	import { Usuario } from '$lib/auth.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import Card from '$lib/components/common/Card.svelte';
	import PageMargin from '$lib/components/common/PageMargin.svelte';

	let ensayos = $state([]);
	let cargando = $state(true);
	let error = $state('');
	let eliminando = $state(false);

	$effect(() => {
		cargarEnsayos();
	});

	async function cargarEnsayos() {
		try {
			const respuesta = await fetch(API.ENSAYOS_PROFESOR(Usuario.value?.id));
			if (!respuesta.ok) throw new Error('Error al cargar ensayos');
			ensayos = await respuesta.json();
		} catch (e) {
			error = e instanceof Error ? e.message : 'Error desconocido';
		} finally {
			cargando = false;
		}
	}

	async function manejarEliminacion(id: number) {
		if (!confirm('¿Está seguro que desea eliminar este ensayo?')) return;

		eliminando = true;
		try {
			const respuesta = await fetch(API.ELIMINAR_ENSAYO(id.toString()), {
				method: 'DELETE'
			});

			if (!respuesta.ok) throw new Error('Error al eliminar el ensayo');

			// Recargar lista de ensayos
			await cargarEnsayos();
		} catch (e) {
			error = e instanceof Error ? e.message : 'Error desconocido';
		} finally {
			eliminando = false;
		}
	}

	function formatearFecha(fechaStr: string) {
		return new Date(fechaStr).toLocaleDateString('es-CL', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
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
