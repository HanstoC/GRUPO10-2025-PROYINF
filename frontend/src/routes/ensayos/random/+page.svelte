<script lang="ts">
	import Card from '$lib/components/common/Card.svelte';
	import { page } from '$app/state';
	import { PreguntasService } from '$lib/api/preguntas';
	import EnsayoSidebar from '$lib/components/ensayos/EnsayoSidebar.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import { beforeNavigate, goto } from '$app/navigation';

	let preguntas = $state(
		(async () => {
			const banco = await PreguntasService.getAll();
			if(!banco || banco.length===0) return [];
			const randomIndex= Math.floor(Math.random() * banco.length);
			const randomID = banco[randomIndex].id;
			const pregunta = await PreguntasService.getById(randomID);
			console.log(pregunta)
			return [pregunta];
		})()
	);
	let respuestas: Record<number, number> = $state({}); // pregunta_id -> alternativa_id
	let puntajeFinal: number | null = $state(null);
	let resultado = $state(null);
	let alternativaCorrecta = $state(null);
	let botonmalo = $state(false);

	async function enviar(pregunta : any){
		if(!pregunta) return;

		botonmalo = true;

		const seleccion = respuestas[pregunta.pregunta_id];
		const correcta = pregunta.correcta;

		console.log(seleccion)
		console.log(correcta)
		if(seleccion === correcta){
			resultado = "correcta";
		} else {
			resultado = "incorrecta"
		}

		alternativaCorrecta = correcta

		await new Promise(resolve => setTimeout(resolve, 5000));

		goto('/')
	}


	beforeNavigate(({ cancel }) => {
		if (!puntajeFinal && !botonmalo)
			if (!confirm('¿Estás seguro que quieres salir?')) cancel();
	});
</script>

<div class="flex h-full w-full flex-row">
	<div class="relative flex w-full flex-col items-center justify-center overflow-y-auto">
		{#await preguntas}
			<p class="mt-10 text-center text-gray-500">Cargando preguntas...</p>
		{:then preguntas}
			{@const currentPregunta = preguntas[0]}
			<h2 class="absolute top-0 text-left">Pregunta Aleatoria</h2>


			<div class="max-w-3xl">
				<Card size="lg">
					<p class="mb-2 text-xl font-semibold">
						{currentPregunta.enunciado}
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
			<div class="absolute bottom-60 flex full flex-row justify-between pr-8">
				<Button disabled={botonmalo} onclick={() => enviar(currentPregunta)}>{botonmalo ? "Enviando..." : "Enviar"}</Button> 
			</div>
			{#if resultado === "correcta"}
				<p class="mt-6 text-green-600 text-xl font-bold">✔ ¡Respuesta correcta!</p>
			{:else if resultado === "incorrecta"}
				<p class="mt-6 text-red-600 text-xl font-bold">✘ Respuesta incorrecta</p>

				<p class="text-lg mt-2">
					La respuesta correcta era:
					<strong>
						{currentPregunta.alternativas.find(a => a.id === alternativaCorrecta)?.texto}
					</strong>
				</p>
			{/if}
			
		{:catch error}
			{error}
		{/await}
	</div>
</div>
