<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { get } from 'svelte/store';
	import Card from '$lib/components/common/Card.svelte';
	import { EnsayosService } from '$lib/api/ensayos';
	import Button from '$lib/components/common/Button.svelte';

	let preguntas: any[] = [];
	let respuestas: Record<number, number> = {}; // pregunta_id -> alternativa_id
	let ensayoId: string;
	let cargando = true;

	onMount(async () => {
		const params = get(page).params;
		ensayoId = params.id;

		try {
			preguntas = await EnsayosService.preguntas(ensayoId);
			cargando = false;
		} catch (e) {
			console.error('Error al cargar preguntas:', e);
		}
	});

	function seleccionar(pregunta_id: number, alternativa_id: number) {
		respuestas[pregunta_id] = alternativa_id;
	}

	function volver() {
		goto(`/ensayos`);
	}
</script>

{#if cargando}
	<p class="mt-10 text-center text-gray-500">Cargando preguntas...</p>
{:else}
	<Card class="mx-auto w-full max-w-3xl p-6">
		<div class="mb-4 flex items-center justify-between">
			<h2 class="text-xl font-bold">Ensayo #{ensayoId}</h2>
		</div>
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
			<Button onclick={volver}>Volver</Button>
		</div>
	</Card>
{/if}
