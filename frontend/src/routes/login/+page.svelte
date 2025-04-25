<script lang="ts">
	import { RolUsuario, Usuario } from '$lib/auth.svelte';
	import Button from '$lib/components/common/Button.svelte';

	let rut = $state('');
	let pwd = $state('');
</script>

<main>
	<img
		class="max-w-1/2 object-cover object-left"
		src="https://st2.depositphotos.com/22113292/48159/i/1600/depositphotos_481591648-stock-photo-backlit-photography-multiracial-group-college.jpg"
		alt=""
	/>
	<div class="flex flex-col items-center justify-center gap-2">
		Bienvenido a "NOMBRE"
		<form class="flex w-1/2 flex-col gap-1">
			<div class="flex w-full flex-col gap-1 p-4">
				<h1>RUT</h1>
				<input type="text" placeholder="Rut" bind:value={rut} />
				<h1>Contraseña</h1>
				<input type="password" placeholder="Contraseña" bind:value={pwd} />
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
