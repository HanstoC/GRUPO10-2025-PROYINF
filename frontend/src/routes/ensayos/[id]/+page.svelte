<script lang="ts">
	import Card from '$lib/components/common/Card.svelte';
	import { page } from '$app/state';
	import { EnsayosService } from '$lib/api/ensayos';
	import EnsayoSidebar from '$lib/components/ensayos/EnsayoSidebar.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import { beforeNavigate } from '$app/navigation';

	let tiempoInicio = $state(0);
	let ensayoId: string = $derived(page.params.id);
	let preguntas = $state(
		(async () => {
			const preguntas = await EnsayosService.preguntas(ensayoId);
			tiempoInicio = Date.now();
			return preguntas;
		})()
	);
	let current: number = $state(0);
	let respuestas: Record<number, number> = $state({}); // pregunta_id -> alternativa_id
	let puntajeFinal: number | null = $state(null);

	async function enviar() {
		try {
			const data = await EnsayosService.responder(
				ensayoId,
				respuestas,
				Math.round((Date.now() - tiempoInicio) / 1000)
			);
			puntajeFinal = data.puntaje ?? -1;
			alert('Ensayo enviado con éxito');
		} catch (e) {
			console.error('Error al enviar respuestas');
			alert('Hubo un problema al enviar tus respuestas.');
		}
	}

	beforeNavigate(({ cancel }) => {
		if (!puntajeFinal)
			if (!confirm('¿Estás seguro que quieres salir? Aún no terminas el ensayo.')) cancel();
	});
</script>

<div class="flex h-full w-full flex-row">
	<div class="relative flex w-full flex-col items-center justify-center overflow-y-auto">
		{#await preguntas}
			<p class="mt-10 text-center text-gray-500">Cargando preguntas...</p>
		{:then preguntas}
			{@const currentPregunta = preguntas[current]}
			{#if puntajeFinal !== null}
				<div class="mt-10 text-center">
					<h2>Ensayo finalizado. Gracias por responder.</h2>
					{#if puntajeFinal !== -1}
						<p class="text-muted-foreground text-xl font-bold">
							Tu puntaje: {puntajeFinal} / {preguntas.length}
						</p>
					{/if}
				</div>
			{:else}
				<h2 class="absolute top-0 text-left">Pregunta {current + 1}</h2>

				<div class="max-w-3xl">
					<Card size="lg">
						<p class="mb-2 text-xl font-semibold">
							{currentPregunta.pregunta}
						</p>

						<div class="mt-4 space-y-2 text-lg">
							{#each currentPregunta.alternativas as alt (alt.id)}
								{@const checked = respuestas[currentPregunta.pregunta_id] === alt.id}
								<button
									class="w-full rounded-md border px-4 py-1 shadow-md {checked
										? 'bg-primary text-primary-foreground font-medium'
										: 'hover:bg-secondary hover:text-secondary-foreground hover:cursor-pointer'}"
									onclick={() => (respuestas[currentPregunta.pregunta_id] = alt.id)}
								>
									{alt.texto}
								</button>
							{/each}
						</div>
					</Card>
				</div>

				<div class="absolute bottom-0 flex w-full flex-row justify-between pr-8">
					<Button disabled={current <= 0} onclick={() => (current -= 1)}>Anterior</Button>
					<Button disabled={current >= preguntas.length - 1} onclick={() => (current += 1)}
						>Siguiente</Button
					>
				</div>
			{/if}
		{:catch error}
			{error}
		{/await}
	</div>
	<div class="right-0 -mr-8 -mt-8 ml-auto">
		{#await preguntas}
			<EnsayoSidebar {ensayoId} preguntas={[]} {respuestas} bind:current onSubmit={enviar} />
		{:then preguntas}
			<EnsayoSidebar {ensayoId} {preguntas} {respuestas} bind:current onSubmit={enviar} />
		{/await}
	</div>
</div>
