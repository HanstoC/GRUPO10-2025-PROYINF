<script lang="ts">
	import { goto } from '$app/navigation';
	import { RolUsuario, Usuario } from '$lib/auth.svelte';
	import Database from '$lib/classes/Database';
	import Button from '$lib/components/common/Button.svelte';
	import Form from '$lib/components/common/Form';
	import Input from '$lib/components/common/Input.svelte';
	import RotatingDesc from '$lib/components/login/RotatingDesc.svelte';

	let rut = $state('');
	let contraseña = $state('');
	let deltaX = $state(0);
	let error = $state('');
	let loading = $state(false);

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

<div class="flex h-full w-full flex-col md:flex-row">
	<div
		id="login-alt"
		class="flex-1/3 pointer-events-none relative flex select-none flex-col items-center justify-center gap-2 min-h-[40vh] md:min-h-full"
	>
		<div class="absolute flex w-3/4 md:w-1/2 flex-col gap-4 md:gap-10 text-center">
			<h1 class="text-2xl md:scale-150 font-extrabold uppercase text-white opacity-80 mix-blend-difference">
				Siempre hay luz para tu futuro
			</h1>
			<RotatingDesc />
		</div>
		<img
			class="login-bg h-full w-full md:w-auto object-cover"
			style:object-position={`${50 + deltaX}% 0`}
			src="/login-bg.png"
			alt=""
		/>
	</div>
	<div class="flex flex-1 flex-col items-center justify-center gap-2 p-4 md:p-0">
		<div class="w-full md:w-1/4 text-center opacity-50 text-sm md:text-base">Bienvenid@. Por favor, inicia sesión.</div>
		<Form.Root
			oninput={() => (error = '')}
			onsubmit={async () => {
				loading = true;
				try {
					await Database.login(rut, contraseña);
				} catch (err) {
					error = `${err}`;
				} finally {
					loading = false;
				}
			}}
			class="flex w-full max-w-md md:w-1/2 flex-col gap-1"
		>
			<div class="flex w-full flex-col gap-1 p-4">
				<Form.Item required>
					<Form.Label>Rut</Form.Label>
					<Input format="rut" type="text" bind:value={rut} />
				</Form.Item>
				<Form.Item required>
					<Form.Label>Contraseña</Form.Label>
					<Input type="password" bind:value={contraseña} />
				</Form.Item>
			</div>
			<Form.Error {error} />
			<Form.Footer>
				<Form.Submit {loading}>Iniciar sesión</Form.Submit>
				<div class="flex w-full flex-col sm:flex-row items-center justify-center gap-2">
					<div class="flex-1/2 w-full text-center text-sm opacity-50">
						Y si aún no tienes cuenta
					</div>
					<Button variant="secondary" class="w-full flex-1">Crear cuenta</Button>
				</div>
			</Form.Footer>
		</Form.Root>
		<p class="static md:absolute bottom-2 opacity-50 text-sm">Copyright 2025©</p>
	</div>
</div>
