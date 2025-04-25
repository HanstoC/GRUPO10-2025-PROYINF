<script lang="ts">
	import { RolUsuario, Usuario } from '$lib/auth.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import { LINKS } from '$lib/global/links';
</script>

<main>
	<div class="flex flex-col items-center justify-center gap-1">
		<h1>Bienvenido, {Usuario.value?.nombre || 'usuario'}!</h1>
		{#if Usuario.value?.rol === RolUsuario.Alumno}
			<Button goto={LINKS.ENSAYOS}>Realizar ensayos</Button>
			<Button goto={LINKS.PERFIL}>Revisar mi perfil</Button>
		{:else if Usuario.value?.rol === RolUsuario.Profesor}
			<Button goto={LINKS.EDITOR_ENSAYOS}>Crear/editar ensayos</Button>
			<Button goto={LINKS.PERFIL}>Revisar mi perfil</Button>
		{/if}
	</div>
</main>

<style>
	main {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		background: #888;
	}
</style>
