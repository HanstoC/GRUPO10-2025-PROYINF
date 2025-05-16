<script lang="ts">
	import { goto } from '$app/navigation';
	import { RolUsuario, Usuario } from '$lib/auth.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import Input from '$lib/components/common/Input.svelte';
	import RotatingDesc from '$lib/components/login/RotatingDesc.svelte';

	let rut = $state('');
	let pwd = $state('');
	let deltaX = $state(0);

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

<main>
	<div
		id="login-alt"
		class="flex-1/3 pointer-events-none relative flex select-none flex-col items-center justify-center gap-2"
	>
		<div class="absolute flex w-1/2 flex-col gap-10 text-center">
			<h1 class="scale-150 font-extrabold uppercase text-white opacity-80 mix-blend-difference">
				Siempre hay luz para tu futuro
			</h1>
			<RotatingDesc />
		</div>
		<img
			class="login-bg h-full w-auto object-cover"
			style:object-position={`${50 + deltaX}% 0`}
			src="/login-bg.jpg"
			alt=""
		/>
	</div>
	<div class="flex flex-1 flex-col items-center justify-center gap-2">
		<div class="w-1/4 text-center opacity-50">Bienvenid@. Por favor, inicia sesión.</div>
		<form class="flex w-1/2 flex-col gap-1">
			<div class="flex w-full flex-col gap-1 p-4">
				<Input format="rut" type="text" title="Rut" placeholder="Rut" bind:value={rut} />
				<Input type="password" title="Contraseña" placeholder="Contraseña" bind:value={pwd} />
			</div>
			<div class="flex w-full flex-col justify-center gap-2">
				<Button
					class="w-full"
					onclick={() => {
						Usuario.value = {
							pwd,
							...(rut === 'profesor'
								? {
										imagen: '',
										rol: RolUsuario.Profesor,
										nombre: 'Pepe Química'
									}
								: {
										imagen: '',
										rol: RolUsuario.Alumno,
										nombre: 'Pepito Alumno'
									})
						};
					}}
				>
					Iniciar sesión
				</Button>
				<div class="flex w-full flex-col items-center justify-center gap-1">
					<div class="opacity-50">Si no tienes cuenta</div>
					<Button variant="alt" class="w-full">Crear cuenta</Button>
				</div>
			</div>
		</form>
		<p class="absolute bottom-2 opacity-50">Copyright 2025©</p>
	</div>
</main>

<style>
	main {
		display: flex;
		flex-direction: row;
		width: 100%;
		height: 100%;
		background: #fff;

		#login-alt {
			h1 {
				font-size: calc(var(--text-4xl) * 2);
			}
		}

		> * {
			width: 100%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}
	}
</style>
