<script lang="ts">
	import Card from '$lib/components/common/Card.svelte';
	import PageMargin from '$lib/components/common/PageMargin.svelte';
	import FilterAsignatura from '$lib/components/ensayos/FilterAsignatura.svelte';
	import IconoirEmojiSad from '$lib/icons/IconoirEmojiSad.svelte';
	import LoadingIndicator from '$lib/components/common/utils/LoadingIndicator.svelte';
	import Form from '$lib/components/common/Form';
	import { RolUsuario, Usuario } from '$lib/auth.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import MaterialSymbolsSelectAll from '$lib/icons/MaterialSymbolsSelectAll.svelte';
	import MaterialSymbolsDelete from '$lib/icons/MaterialSymbolsDelete.svelte';

	interface Pregunta {
		id: number;
		enunciado: string;
		asignatura: string;
		imagen_base64: string;
		topico: string;
	}

	let selectedAsignaturas: number[] = [];
	let preguntas: Pregunta[] = [];
	let loading = false;

	let selectedPreguntas: number[] = [];

	// Derivar query de selección
	$: query =
		selectedAsignaturas.length > 0 ? '?' + 'asignatura=' + selectedAsignaturas.join(',') : '';

	// Ejecutar carga solo si cambia query
	$: if (query !== undefined) {
		loadPreguntas(query);
	}

	async function loadPreguntas(q: string) {
		loading = true;
		try {
			const res = await fetch(`http://localhost:8000/preguntas${q}`, {
				credentials: 'include'
			});
			preguntas = await res.json();
		} catch (err) {
			console.error('Error cargando preguntas:', err);
		} finally {
			loading = false;
		}
	}
</script>

<PageMargin>
	<Card class="w-full">
		<div class="flex flex-row items-center justify-between gap-4">
			<Form.Root class="w-fit">
				<Form.Item label="Filtrar por Asignaturas">
					<FilterAsignatura bind:selected={selectedAsignaturas} />
				</Form.Item>
			</Form.Root>
			<Button size="sm" goto="/preguntas/crear">Crear pregunta</Button>
		</div>
	</Card>

	<Card variant="outlined" size="lg" class="flex h-full w-full items-center justify-center">
		{#if loading}
			<LoadingIndicator size="lg" />
		{:else if preguntas.length === 0}
			<div class="flex select-none flex-col gap-1 opacity-50">
				<IconoirEmojiSad class="h-10! w-auto! aspect-square" />
				<p class="italic">No hay preguntas para las asignaturas seleccionadas.</p>
			</div>
		{:else}
			<div class="h-full w-full">
				{#each preguntas as pregunta}
					<Card class="mb-2 p-4">
						<div class="flex justify-between items-center">
							<div class="flex items-center gap-2">
								<div class="flex flex-col gap-1 ml-2">
									<h3 class="text-lg font-bold">#{pregunta.id} - {pregunta.enunciado}</h3>
									<h4>
										Asignatura: <span class="text-gray-500">{pregunta.asignatura}</span>
									</h4>
									<h4>
										Tópico: <span class="text-gray-500">{pregunta.topico}</span>
									</h4>
								</div>
							</div>

							<div class="flex gap-2">
								{#if Usuario.value?.rol === RolUsuario.Profesor}
									<Button size="sm" goto={`/preguntas/${pregunta.id}`}>Editar</Button>
								{/if}
							</div>
						</div>
					</Card>
				{/each}
			</div>
		{/if}
	</Card>
</PageMargin>
