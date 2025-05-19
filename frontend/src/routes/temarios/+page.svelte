<script lang="ts">
	import Card from '$lib/components/common/Card.svelte';
	import Tema from '$lib/components/temarios/Tema.svelte';
	import _ from 'lodash';
	import { fly } from 'svelte/transition';

	const COLORS: ((input: string) => string | null)[] = [
		(i) => (i.match(/\blectora\b/gi) ? '#b31530' : null),
		(i) => (i.match(/\bM2\b/g) ? '#362782' : null),
		(i) => (i.match(/\bmatem.tica\b/gi) ? '#1464b5' : null),
		(i) => (i.match(/\bhistoria\b/gi) ? '#cf5615' : null),
		(i) => (i.match(/\bciencias?\b/gi) ? '#7b1da3' : null),
		(i) => '#222'
	];
	let TEMARIOS_JSON: any | null = $state(null);

	let [latestData, ...dataEntries] = $derived(Object.entries(TEMARIOS_JSON ?? {}).reverse());
	let temarios = $derived(
		//@ts-ignore
		Object.entries(latestData[1]) //
			.filter(([what, _]) => what.match(/\bregular\b/gi))
	);

	let selectedTemario = $state(0);
	let bgColor = $derived.by(() => {
		for (const fn of COLORS) {
			let color = fn(temarios[selectedTemario][0]);
			if (color) return color;
		}

		return '';
	});

	$effect(() => {
		(async () => {
			TEMARIOS_JSON = await fetch('/data/temario.json').then((r) => r.json());
		})();
	});
</script>

{#if TEMARIOS_JSON}
	{@const { titulo, contenidos, descripcion, duracion, preguntas }: any = temarios[selectedTemario][1]}
	<div id="temario-page" style={`--color: ${bgColor};`}>
		<div id="current-temario">
			<div
				class="absolute -bottom-2 z-10 flex h-full flex-col items-center justify-end select-none"
			>
				<h1>
					{latestData[0]}
				</h1>
			</div>
			<div class="z-10 flex w-full flex-row items-center justify-start px-10">
				{#each temarios as [what, _], i}
					{@const isSelected = selectedTemario === i}
					<button
						onclick={(_) => (selectedTemario = i)}
						class={`relative flex h-full flex-1 flex-col items-center justify-center text-center ${isSelected ? 'selected' : 'cursor-pointer'}`}
					>
						<h2 class="uppercase">
							{what
								.replace(/Temario de la PAES \w+(?: \w+)? de/gi, '')
								.replace(/\.$/gi, '')
								.trim()}
						</h2>
					</button>
				{/each}
			</div>
		</div>
		<div id="current-temario-info" style={`--color: ${bgColor};`}>
			<div
				id="current-temario-mask"
				class="pointer-events-none fixed top-0 left-1/2 z-10 h-full w-full -translate-x-1/2"
			></div>
			<div class="relative min-h-[100vh] w-2/3 flex-none">
				{#key selectedTemario}
					<div
						in:fly={{ x: 40, duration: 300, delay: 100 }}
						out:fly={{ x: -40, duration: 300 }}
						class="absolute flex h-full w-full flex-col items-center justify-start gap-10"
					>
						<div class="flex flex-col gap-2 text-justify">
							<div class="flex w-auto flex-row gap-10">
								<Card
									size="sm"
									class="flex flex-1 items-center gap-2"
									startIcon="iconoir:chat-bubble-question-solid"
								>
									<b>{preguntas} preguntas</b> selección múltiple
								</Card>
								<Card
									size="sm"
									class="flex flex-1 items-center gap-2"
									startIcon="iconoir:clock-solid"
								>
									<b>{duracion.toFixed(1)} hrs</b> duración.
								</Card>
							</div>
							<p>{descripcion}</p>
						</div>
						<div class="flex w-3/4 max-w-3/4 flex-col gap-2">
							{#each contenidos as contenido}
								{@const { area, temas } = contenido}
								<Card size="lg" class="bg-background/30! text-foreground!">
									<h2 class="w-full font-extrabold uppercase">{area}</h2>
									<div class="flex flex-col gap-4">
										{#each temas as { titulo, subtemas }}
											<Tema tema={titulo}>
												{#each subtemas as subtema}
													<li>{subtema}</li>
												{/each}
											</Tema>
										{/each}
									</div>
								</Card>
							{/each}
							<div class="h-40"></div>
						</div>
					</div>
				{/key}
			</div>
		</div>
	</div>
{/if}

<style>
	#temario-page {
		--color: #fff;

		display: flex;
		height: 100%;
		width: 100%;
		flex-direction: column;
		max-height: 100%;
		overflow-y: hidden;

		* {
			transition: all 0.5s ease-out;
		}

		#current-temario {
			position: relative;
			width: 100%;
			flex: 0.33;
			display: flex;
			background: black;
			color: white;
			justify-content: space-evenly;
			align-items: center;
			overflow: hidden;

			button {
				* {
					transition-duration: 0.1s;
					transition-timing-function: cubic-bezier(0.19, 1, 0.22, 1);
				}

				&:not(.selected):hover {
					scale: 1.1;
				}

				&.selected h2 {
					scale: 1.2;
					font-weight: bolder;
					text-shadow:
						0 0 10px black,
						0 0 1rem black;
				}

				h2 {
					scale: 0.9;
				}

				&:not(.selected) {
					opacity: 0.75;
				}
			}

			h1 {
				transition-property: color;
				font-weight: bolder;
				font-size: 40vh;
				margin-bottom: -5vh;
				color: var(--color);
			}
		}

		#current-temario-mask {
			background-color: var(--color);
			mask-image: linear-gradient(#0000 calc(100% - 10rem), #000 95%);
		}

		#current-temario-info {
			clip-path: inset(0 0 0 0);
			position: relative;
			width: 100%;
			flex: 1;
			display: flex;
			flex-direction: column;
			color: white;
			justify-content: start;
			padding: var(--radius-md) var(--radius-4xl);
			align-items: center;
			overflow-y: auto;
			background-color: var(--color);
		}
	}
</style>
