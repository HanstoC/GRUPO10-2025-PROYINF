<script lang="ts">
	import { Utils } from '../../../utils/Utils.svelte';
	import Button from '../common/Button.svelte';
	import Card from '../common/Card.svelte';

	let {
		ensayoId,
		preguntas,
		respuestas,
		current = $bindable(),
		onSubmit
	}: {
		ensayoId: string;
		preguntas: any[];
		respuestas: Record<number, number>;
		current: number;
		onSubmit: () => any;
	} = $props();

	let finalizado = $state(false);
	let tiempoInicio = Date.now();
	let tiempoTranscurrido = $state(0);
	let interval = $state(
		setInterval(() => {
			tiempoTranscurrido = Date.now() - tiempoInicio;
		}, 1000)
	);

	$effect(() => {
		return () => {
			clearInterval(interval);
		};
	});
</script>

<div
	class="from-background to-foreground/10 w-xs min-w-xs z-40 h-screen max-w-xs border-r bg-gradient-to-b from-25% shadow-lg"
>
	<div class="border-background flex h-full w-full flex-col border-l-2 border-r-2 p-4 px-6">
		<div class="flex w-full flex-col items-start gap-2 border-b py-5">
			<h2>Ensayo #{ensayoId}</h2>
			<div class="flex w-full flex-row">
				<span>Tiempo transcurrido:</span>
				<p class="right-0 ml-auto">{Utils.msToHHMMSS(tiempoTranscurrido)}</p>
			</div>
		</div>

		<div class="flex flex-row flex-wrap gap-1 overflow-y-auto pt-4">
			{#each preguntas as pregunta, i (pregunta.pregunta_id)}
				{@const { pregunta_id } = pregunta}
				<button
					class="bg-background cursor-pointer! relative aspect-square h-10 w-10 rounded-sm border p-2 shadow-sm hover:brightness-125 {pregunta_id in
					respuestas
						? 'bg-primary text-primary-foreground'
						: ''} {current === i ? 'ring-accent shadow-md/40! ring-2' : ''}"
					onclick={() => (current = i)}
				>
					<p class="text-center {current === i ? 'font-bold' : ''}">
						{i + 1}
					</p>
				</button>
			{/each}
		</div>

		<div class="bottom-0 mt-auto flex justify-end pt-6">
			<Button
				disabled={finalizado}
				onclick={() => {
					if (!confirm('¿Estás seguro que quieres enviar el ensayo?')) return;
					onSubmit();
					clearInterval(interval);
					finalizado = true;
				}}>Finalizar ensayo</Button
			>
		</div>
	</div>
</div>
