<script lang="ts">
	import { onMount } from 'svelte';
	import Card from '$lib/components/common/Card.svelte';
	import { page } from '$app/state';
	import { EnsayosService } from '$lib/api/ensayos';

	let preguntas: any[] = [];
	let respuestas: Record<number, number> = {}; // pregunta_id -> alternativa_id
	let tiempoTranscurrido = 0; // en segundos
	let minutos = 0;
	let segundos = 0;
	let intervalo: any;
	let ensayoId: string;
	let puntajeFinal: number | null = null;
	let cargando = true;
	let finalizado = false;

	onMount(async () => {
		const params = page.params;
		ensayoId = params.id;

		try {
			preguntas = await EnsayosService.preguntas(ensayoId);
			cargando = false;
			iniciarCronometro();
		} catch (e) {
			console.error('Error al cargar preguntas:', e);
		}
	});

	function iniciarCronometro() {
		intervalo = setInterval(() => {
			tiempoTranscurrido++;
			minutos = Math.floor(tiempoTranscurrido / 60);
			segundos = tiempoTranscurrido % 60;
		}, 1000);
	}

	function seleccionar(pregunta_id: number, alternativa_id: number) {
		respuestas[pregunta_id] = alternativa_id;
	}

	async function enviar() {
		clearInterval(intervalo); // detener cronómetro
		finalizado = true;

		try {
			const res = await fetch(`http://localhost:8000/ensayos/${ensayoId}/responder`, {
				method: 'POST',
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ respuestas, tiempo: tiempoTranscurrido })
			});

			if (res.ok) {
				const data = await res.json();
				puntajeFinal = data.puntaje ?? null;
				alert('Ensayo enviado con éxito');
			} else {
				console.error('Error al enviar respuestas');
				alert('Hubo un problema al enviar tus respuestas.');
			}
		} catch (e) {
			console.error('Error en fetch:', e);
		}
	}
</script>

{#if cargando}
	<p class="mt-10 text-center text-gray-500">Cargando preguntas...</p>
{:else if finalizado}
	<div class="mt-10 text-center">
		<p class="mb-2 font-semibold text-green-600">Ensayo finalizado. Gracias por responder.</p>
		{#if puntajeFinal !== null}
			<p class="text-xl font-bold text-blue-700">Tu puntaje: {puntajeFinal} / {preguntas.length}</p>
		{/if}
	</div>
{:else}
	<Card class="mx-auto w-full max-w-3xl p-6">
		<div class="mb-4 flex items-center justify-between">
			<h2 class="text-xl font-bold">Ensayo #{ensayoId}</h2>
			<p class="font-mono text-sm text-red-500">
				Tiempo transcurrido: {minutos}:{segundos < 10 ? `0${segundos}` : segundos}
			</p>
		</div>
		<form on:submit|preventDefault={enviar} class="space-y-6">
			{#each preguntas as p, i}
				<div class="rounded-lg border border-gray-300 p-4 shadow-sm">
					<p class="mb-2 font-semibold">Pregunta {i + 1}: {p.pregunta}</p>

					<div class="space-y-2">
						{#each p.alternativas as alt}
							<label class="flex items-center gap-2">
								<input
									type="radio"
									name={`pregunta-${p.pregunta_id}`}
									value={alt.id}
									checked={respuestas[p.pregunta_id] === alt.id}
									on:change={() => seleccionar(p.pregunta_id, alt.id)}
									class="accent-blue-500"
								/>
								<span>{alt.texto}</span>
							</label>
						{/each}
					</div>
				</div>
			{/each}

			<div class="flex justify-end pt-6">
				<button
					type="submit"
					class="rounded bg-blue-600 px-6 py-2 font-semibold text-white shadow transition duration-150 hover:bg-blue-700"
				>
					Enviar ensayo
				</button>
			</div>
		</form>
	</Card>
{/if}
