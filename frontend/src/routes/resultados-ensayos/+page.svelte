<script lang="ts">
	import { ResultadosService } from '$lib/api/resultados';
	import Badge from '$lib/components/common/Badge.svelte';
	import Card from '$lib/components/common/Card.svelte';
	import Form from '$lib/components/common/Form';
	import PageMargin from '$lib/components/common/PageMargin.svelte';
	import LoadingIndicator from '$lib/components/common/utils/LoadingIndicator.svelte';
	import FiltroAsignaturas from '$lib/components/ensayos/FilterAsignatura.svelte';
	import MaterialSymbolsAlarmOutline from '$lib/icons/MaterialSymbolsAlarmOutline.svelte';
	import MaterialSymbolsCancelOutline from '$lib/icons/MaterialSymbolsCancelOutline.svelte';
	import MaterialSymbolsCheckCircleOutline from '$lib/icons/MaterialSymbolsCheckCircleOutline.svelte';
	import MaterialSymbolsCircleOutline from '$lib/icons/MaterialSymbolsCircleOutline.svelte';
	import MaterialSymbolsPauseCircleOutline from '$lib/icons/MaterialSymbolsPauseCircleOutline.svelte';

	let promiseRequest: Promise<any[]> = $state(ResultadosService.get());
	let selectedAsignaturas: number[] = $state([]);
</script>

<PageMargin>
	<Card class="w-full">
		<h2 class="mb-4 text-2xl font-semibold">Tus Resultados</h2>
		<Form.Root class="w-fit">
			<Form.Item label="Filtrar por Asignaturas">
				<FiltroAsignaturas bind:selected={selectedAsignaturas} />
			</Form.Item>
		</Form.Root>
	</Card>

	<Card size="lg" class="max-h-3/5 w-full">
		{#await promiseRequest}
			<LoadingIndicator />
		{:then resultados}
			{@const resultadosFiltrados =
				selectedAsignaturas.length > 0
					? resultados.filter((r) => selectedAsignaturas.includes(r.id_asignatura))
					: resultados}

			<div class="flex max-h-full flex-col gap-2 overflow-y-auto">
				{#if resultados.length}
					{#each resultadosFiltrados as r (r.id_ensayo)}
						<Card size="sm" class="relative p-4">
							<div class="flex w-full flex-row justify-between">
								<p class="text-muted-foreground">#{r.id_ensayo}</p>
								<div class="flex flex-row gap-2">
									<Badge color="success" startDecorator={MaterialSymbolsCheckCircleOutline}>
										{r.cantidad_correctas} correctas
									</Badge>
									<Badge color="error" startDecorator={MaterialSymbolsCancelOutline}>
										{r.cantidad_erroneas} incorrectas
									</Badge>
									<Badge startDecorator={MaterialSymbolsPauseCircleOutline}>
										{r.cantidad_omitidas} omitidas
									</Badge>
									<Badge color="primary" startDecorator={MaterialSymbolsCircleOutline}>
										{r.cantidad_erroneas + r.cantidad_correctas + r.cantidad_omitidas} en total
									</Badge>
								</div>
							</div>
							<div class="w-full">
								<p><strong>{r.asignatura}</strong></p>
								<p>{r.dificultad}</p>
								<div class="flex flex-row gap-2">
									<MaterialSymbolsAlarmOutline />{r.tiempo_empleado} segundos
								</div>
							</div>
							<div class="text-muted-foreground absolute right-0 bottom-0 m-2 font-bold uppercase">
								<h2>Puntaje: {r.puntaje_obtenido}</h2>
							</div>
						</Card>
					{/each}
				{:else}
					<p class="text-muted-foreground">Aún no has realizado ningún ensayo.</p>
				{/if}
			</div>
		{:catch error}
			<p class="text-destructive-foreground">Ocurrió un error {error}</p>
		{/await}
	</Card>
</PageMargin>
