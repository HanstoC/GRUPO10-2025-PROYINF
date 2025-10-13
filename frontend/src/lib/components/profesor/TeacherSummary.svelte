<script lang="ts">
	import { onMount } from 'svelte';
	import Card from '../common/Card.svelte';
	import LoadingIndicator from '../common/utils/LoadingIndicator.svelte';
	import { EnsayosService } from '$lib/api/ensayos';

	let misEnsayos: {
		id: number;
		asignatura: string;
		dificultad: string;
		fecha_creacion: string;
	}[] = [];
	let loading = false;

	let ensayoExpandido: number | null = null;
	let preguntasPorEnsayo = new Map<
		number,
		{ pregunta: string; respuesta: string; correcta: boolean }[]
	>();
	let cargandoPreguntas = false;

	onMount(() => {
		loadMisEnsayos();
	});

	async function loadMisEnsayos() {
		loading = true;
		try {
			const profesorId = 1; // ← Idealmente desde Usuario.value?.id
			const res = await fetch(`http://localhost:8000/ensayos?profesor=${profesorId}`, {
				credentials: 'include'
			});
			misEnsayos = await res.json();
		} catch (err) {
			console.error('Error cargando mis ensayos:', err);
		} finally {
			loading = false;
		}
	}

	async function verPreguntas(id: number) {
		if (ensayoExpandido === id) {
			ensayoExpandido = null;
			return;
		}
		ensayoExpandido = id;

		if (!preguntasPorEnsayo.has(id)) {
			cargandoPreguntas = true;
			try {
				const preguntas = await EnsayosService.preguntas(id);
				preguntasPorEnsayo.set(id, preguntas);
			} catch (err) {
				console.error('Error cargando preguntas:', err);
			} finally {
				cargandoPreguntas = false;
			}
		}
	}
</script>

<Card class="flex w-full flex-col gap-4 p-4">
	<h2 class="text-xl font-bold">Mis ensayos</h2>

	{#if loading}
		<div class="flex justify-center py-4">
			<LoadingIndicator size="lg" />
		</div>
	{:else if misEnsayos.length === 0}
		<p class="italic opacity-50">Aún no has creado ningún ensayo.</p>
	{:else}
		<div class="flex flex-col gap-3">
			{#each misEnsayos as ensayo}
				<Card class="p-4">
					<div class="flex items-center justify-between">
						<div>
							<h3 class="font-semibold">Ensayo #{ensayo.id}</h3>
							<p class="text-sm text-gray-600">
								Asignatura: {ensayo.asignatura} · Dificultad: {ensayo.dificultad} · Fecha: {new Date(
									ensayo.fecha_creacion
								).toLocaleDateString()}
							</p>
						</div>
						<button
							on:click={() => verPreguntas(ensayo.id)}
							class="text-sm text-blue-600 underline"
						>
							{ensayoExpandido === ensayo.id ? 'Ocultar' : 'Ver preguntas'}
						</button>
					</div>

					{#if ensayoExpandido === ensayo.id}
						{#if cargandoPreguntas}
							<p class="mt-2 text-sm text-gray-500 italic">Cargando preguntas...</p>
						{:else if preguntasPorEnsayo.get(ensayo.id)?.length > 0}
							<ul class="mt-3 space-y-2">
								{#each preguntasPorEnsayo.get(ensayo.id) as p, i (p.pregunta + i)}
									<li class="ml-2">
										<p class="font-medium">Pregunta: {p.pregunta}</p>
										<ul class="ml-4 list-disc">
											<li class={p.correcta ? 'font-bold text-green-600' : ''}>
												{p.respuesta}
											</li>
										</ul>
									</li>
								{/each}
							</ul>
						{:else}
							<p class="mt-2 text-sm italic">Este ensayo no tiene preguntas aún.</p>
						{/if}
					{/if}
				</Card>
			{/each}
		</div>
	{/if}
</Card>
