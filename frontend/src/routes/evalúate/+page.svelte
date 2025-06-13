<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/common/Button.svelte';
	import Card from '$lib/components/common/Card.svelte';
	import PageMargin from '$lib/components/common/PageMargin.svelte';
	import { LINKS } from '$lib/global/links';

	interface EvaluateCardProp {
		title: string;
		description: string;
		href: string;
		background: string;
	}
</script>

{#snippet evaluateCard(props: EvaluateCardProp)}
	<Card
		size="lg"
		class="relative z-0 h-full w-full flex-1 overflow-hidden text-white transition-all duration-100 hover:w-[calc(100%+2rem)] hover:flex-[1.2] hover:cursor-pointer hover:border-2"
		onclick={() => goto(props.href)}
	>
		<div class="flex w-[33vw] flex-col">
			<h2 class="font-medium uppercase">{props.title}</h2>
			<p>{props.description}</p>
		</div>
		<div
			class="absolute top-0 left-0 -z-10 h-full w-full bg-linear-to-b from-black from-20% to-transparent opacity-80"
		></div>
		<img
			class="absolute top-0 left-0 -z-20 h-full w-full object-cover object-center"
			src={props.background}
			alt=""
		/>
	</Card>
{/snippet}

<PageMargin class="h-full gap-4">
	{@render evaluateCard({
		title: 'Rendir ensayos',
		description:
			'Comienza un nuevo ensayo y evalúa tus conocimientos en las distintas asignaturas. En promedio, los estudiantes mejoran sus puntajes en un 15% después de realizar 3 ensayos.',
		href: LINKS.ENSAYOS,
		background: '/ensayos-bg.jpg'
	})}
	{@render evaluateCard({
		title: 'Ver resultados',
		description:
			'Accede a tus resultados anteriores y revisa tu progreso en cada ensayo. Consulta el detalle de tus aciertos y errores para identificar las áreas donde el 70% de nuestros usuarios ha logrado mayor mejora.',
		href: LINKS.RESULTADOS_ENSAYOS,
		background: '/resultados-bg.jpg'
	})}
</PageMargin>
