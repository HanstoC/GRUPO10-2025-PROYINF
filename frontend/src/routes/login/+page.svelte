<script lang="ts">
	import { goto } from '$app/navigation';
	import { Usuario } from '$lib/auth.svelte';
	import Database from '$lib/classes/Database';
	import Button from '$lib/components/common/Button.svelte';
	import Form from '$lib/components/common/Form';
	import Input from '$lib/components/common/Input.svelte';
	import LoadingIndicator from '$lib/components/common/utils/LoadingIndicator.svelte';
	import RotatingDesc from '$lib/components/login/RotatingDesc.svelte';

	let rut = $state('');
	let contraseña = $state('');
	let deltaX = $state(0);
	let loading = $state(false);
	let error = $state('');

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
</script>

<div class="flex h-full w-full flex-row">
	<div
		id="login-alt"
		class="pointer-events-none relative flex flex-1/3 flex-col items-center justify-center gap-2 select-none"
	>
		<div class="absolute flex w-1/2 flex-col gap-6 text-center">
			<h1 class="scale-150 font-extrabold text-white uppercase opacity-80 mix-blend-difference">
				Siempre hay luz para tu futuro
			</h1>
			<RotatingDesc />
		</div>
		<img
			class="login-bg h-full w-auto object-cover"
			style:object-position={`${50 + deltaX}% 0`}
			src="/login-bg.png"
			alt=""
		/>
	</div>
	<div class="flex flex-3 flex-col items-center justify-center gap-2 lg:flex-2 xl:flex-1">
		{#if loading}
			<LoadingIndicator text="Espera un poco..." />
		{/if}
		<Form.Root
			hidden={loading}
			bind:error
			onsubmit={async () => {
				loading = true;
				try {
					await Database.login(rut, contraseña);
				} catch (err) {
					error = `${err}`;
					if (error.match(/failed to fetch/gi)) error = 'Problema al comunicar con el servidor';
				} finally {
					loading = false;
				}
			}}
			class="flex w-full flex-col gap-1 sm:px-6 md:px-12 xl:px-20"
		>
			<div class="text-center opacity-50 sm:w-full md:w-2/3">
				Bienvenid@. Para ingresar, inicia sesión.
			</div>
			<Form.Item required label="Rut">
				<Input format="rut" type="text" bind:value={rut} />
			</Form.Item>
			<Form.Item required label="Contraseña">
				<Input type="password" bind:value={contraseña} />
			</Form.Item>
			<Form.Footer>
				<Form.Submit {loading}>Iniciar sesión</Form.Submit>
				<div class="flex w-full flex-row items-center justify-center gap-4">
					<div class="w-full text-center text-sm opacity-50">Y si aún no tienes cuenta</div>
					<Button variant="outlined">Registrarse</Button>
				</div>
			</Form.Footer>
		</Form.Root>
		<p class="absolute bottom-2 opacity-50">Copyright A&DS-2025©</p>
	</div>
</div>
