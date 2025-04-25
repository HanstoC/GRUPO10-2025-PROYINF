<script lang="ts">
	import { goto } from '$app/navigation';
	import { RolUsuario, Usuario } from '$lib/auth.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import Input from '$lib/components/common/Input.svelte';

	let rut = $state('');
	let pwd = $state('');

	$effect(() => {
		if (Usuario.value) return void goto('/');
	});
</script>

<main>
	<div class="flex-1/3 relative flex flex-col items-center justify-center gap-2">
		<h1 class="absolute w-1/2 text-center font-bold uppercase opacity-80">
			Siempre hay luz para tu futuro
		</h1>
		<img class="h-full w-auto object-cover object-center" src="/login-bg.jpg" alt="" />
	</div>
	<div class="flex flex-1 flex-col items-center justify-center gap-2">
		<div class="w-1/4 text-center opacity-50">Bienvenid@. Por favor, inicia sesión.</div>
		<form class="flex w-1/2 flex-col gap-1">
			<div class="flex w-full flex-col gap-1 p-4">
				<Input type="text" title="Rut" placeholder="Rut" bind:value={rut} />
				<Input type="password" title="Contraseña" placeholder="Contraseña" bind:value={pwd} />
			</div>
			<Button
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

		> * {
			width: 100%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}
	}
</style>
