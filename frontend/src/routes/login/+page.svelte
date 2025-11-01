<script lang="ts">
	import { goto } from '$app/navigation';
	import { AuthService } from '$lib/api/auth';
	import { Usuario } from '$lib/auth.svelte';
	import Card from '$lib/components/common/Card.svelte';
	import Firma from '$lib/components/common/Firma.svelte';
	import Form from '$lib/components/common/Form';
	import Input from '$lib/components/common/Input.svelte';
	import RotatingDesc from '$lib/components/login/RotatingDesc.svelte';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';

	let rut = $state('');
	let contraseña = $state('');
	let deltaX = $state(0);
	let loading = $state(false);
	let error = $state('');
	let mounted = $state(false);

	$effect(() => {
		if (Usuario.value) return void goto('/');
	});

	$effect(() => {
		const onMouseMove = (event: MouseEvent) =>
			(deltaX = (0.5 - event.clientX / window.innerWidth) * 5);

		document.addEventListener('mousemove', onMouseMove);
		return () => {
			document.removeEventListener('mousemove', onMouseMove);
		};
	});

	onMount(() => {
		mounted = true;
	});
</script>

<div class="flex h-full w-full flex-col">
	<div
		id="login-alt"
		class="flex-1/3 pointer-events-none relative flex select-none flex-col items-center justify-center gap-2 overflow-hidden"
	>
		<div class="absolute flex w-2/3 flex-col items-center justify-center gap-2 text-center">
			<h1
				class="leading-10! mb-10 scale-150 font-extrabold uppercase tracking-tight text-white opacity-80 mix-blend-difference md:mb-4 lg:mb-2"
			>
				Siempre hay luz para tu futuro
			</h1>
			<RotatingDesc />

			{#if mounted}
				<div
					in:slide={{ delay: 200 }}
					class="flex h-full w-full flex-col items-center justify-center will-change-contents"
				>
					<Card
						size="lg"
						class="acryllic! min-w-1/ pointer-events-auto! max-w-1/2 min-w-2xs sm:min-w-sm 2xl:max-w-1/3 relative mt-20 w-4/5"
					>
						<Form.Root
							bind:error
							onsubmit={async () => {
								loading = true;
								try {
									await AuthService.login(rut, contraseña);
								} catch (err) {
									error = `${err}`;
									if (error.match(/failed to fetch/gi))
										error = 'Problema al comunicar con el servidor';
									loading = false;
								}
							}}
							class="flex w-full flex-col gap-1 lg:px-4"
						>
							<div class="w-full text-left">
								<h3 class="-mb-1 font-bold">Iniciar sesión</h3>
								<p class="text-muted-foreground text-sm md:text-base">Bienvenid@ de vuelta!</p>
							</div>
							<Form.Item required label="Rut">
								<Input format="rut" type="text" bind:value={rut} />
							</Form.Item>
							<Form.Item required label="Contraseña">
								<Input type="password" bind:value={contraseña} />
							</Form.Item>
							<Form.Footer>
								<Form.Submit {loading}>Iniciar sesión</Form.Submit>
							</Form.Footer>
						</Form.Root>
					</Card>
				</div>
			{/if}
		</div>
		<Firma class="text-background absolute bottom-4" />
		<img
			class="login-bg h-full w-full object-cover"
			style:object-position={`${50 + deltaX}% 0`}
			src="/login-bg.png"
			alt=""
		/>
	</div>
</div>
