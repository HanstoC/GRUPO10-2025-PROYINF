<script lang="ts">
	import Card from '$lib/components/common/Card.svelte';
	import Tema from '$lib/components/temarios/Tema.svelte';
	import { LINKS } from '$lib/global/links';
	import EnumHelper from '$lib/helpers/EnumHelper';
	import _ from 'lodash';
	import { fly } from 'svelte/transition';

	let selectedTemario = $state(+(localStorage.getItem('selected-temario') ?? 0));
	$effect(() => {
		localStorage.setItem('selected-temario', `${selectedTemario}`);
	});
</script>

{#await fetch(LINKS.FILE_TEMARIOS).then((r) => r.json()) then json}
	{@const [latestData, ...dataEntries] = Object.entries(json ?? {}).reverse()}
	{@const temarios = Object.entries(latestData[1]) //
		.filter(([what, _]) => what.match(/\bregular\b/gi))}
	{@const bgColor = EnumHelper.colorsAsignatura(temarios[selectedTemario][0])}
	{@const { titulo, contenidos, descripcion, duracion, preguntas }: any = temarios[selectedTemario][1]}
	<div id="temario-page" class="**:transition-all! **:duration-500!" style={`--color: ${bgColor};`}>
		<div id="current-temario">
			<div class="z-10 flex h-full w-full flex-row items-center justify-start px-10">
				{#each temarios as [what, _], i}
					{@const isSelected = selectedTemario === i}
					<button
						onclick={(_) => (selectedTemario = i)}
						class={`relative flex h-full flex-1 flex-col items-center justify-center text-center font-extralight ${isSelected ? 'font-extrabold! text-white' : 'group cursor-pointer text-white/70 hover:text-white'} duration-100!`}
					>
						<p class="text-3xl uppercase">
							{what
								.replace(/Temario de la PAES \w+(?: \w+)? de/gi, '')
								.replace(/\.$/gi, '')
								.trim()}
						</p>
						{#if isSelected}
							<div
								transition:fly={{ y: 20 }}
								class="pointer-events-none absolute bottom-0 h-4 w-full bg-white"
							></div>
						{/if}
						<div
							class="absolute bottom-0 left-0 h-full w-full bg-white/20 opacity-0 group-hover:opacity-100"
						></div>
					</button>
				{/each}
			</div>
		</div>
		<div id="current-temario-info" style={`--color: ${bgColor};`}>
			<div
				id="current-temario-mask"
				class="pointer-events-none fixed left-1/2 top-0 z-10 h-full w-full -translate-x-1/2"
			></div>
			<div class="relative min-h-[100vh] w-full flex-none lg:w-2/3">
				{#key selectedTemario}
					<div
						in:fly={{ x: 40, duration: 300, delay: 100 }}
						out:fly={{ x: -40, duration: 300 }}
						class="absolute flex h-full w-full flex-col items-center justify-start gap-4 p-4 md:gap-10"
					>
						<div class="flex flex-col gap-2 text-justify">
							<div class="flex w-auto flex-col gap-4 sm:flex-row md:gap-10">
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
							<p class="text-sm md:text-base">{descripcion}</p>
						</div>
						<div class="max-w-3/4 flex w-3/4 flex-col gap-2 pb-40">
							{#each contenidos as contenido}
								{@const { area, temas } = contenido}
								<Card size="lg" class="bg-background/30! text-foreground! border-none">
									<h2 class="w-full font-extrabold uppercase">{area}</h2>
									<div class="flex flex-col gap-4">
										{#each temas as { titulo, subtemas }}
											<Tema tema={titulo}>
												{#each subtemas as subtema}
													<li class="text-sm md:text-base">{subtema}</li>
												{/each}
											</Tema>
										{/each}
									</div>
								</Card>
							{/each}
						</div>
					</div>
				{/key}
			</div>
		</div>
	</div>
{/await}

<style>
	#temario-page {
		--color: #fff;

		display: flex;
		height: 100%;
		width: 100%;
		flex-direction: column;
		max-height: 100%;
		overflow-y: hidden;

		#current-temario {
			position: relative;
			width: 100%;
			flex: 0.4;
			display: flex;
			background: black;
			color: white;
			justify-content: space-evenly;
			align-items: center;
			overflow: hidden;

			h1 {
				transition-property: color;
				font-weight: bolder;
				margin-bottom: -2vh;
				color: var(--color);

				@media (min-width: 768px) {
					margin-bottom: -5vh;
				}
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
