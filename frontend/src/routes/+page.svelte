<script lang="ts">
	import { RolUsuario, Usuario } from '$lib/auth.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import Header from '$lib/components/index/Header.svelte';
	import { LINKS } from '$lib/global/links';
</script>

<div id="main-index">
	<Header />
	<div class="flex h-full w-full flex-col items-center justify-center gap-1">
		<div class="p-4">
			<h1>Bienvenido, {Usuario.value?.nombre || 'usuario'}!</h1>
		</div>
		{#if Usuario.value?.rol === RolUsuario.Alumno}
			<Button goto={LINKS.ENSAYOS}>Realizar ensayos</Button>
			<Button goto={LINKS.PERFIL}>Revisar mi perfil</Button>
		{:else if Usuario.value?.rol === RolUsuario.Profesor}
			<Button goto={LINKS.EDITOR_ENSAYOS}>Crear/editar ensayos</Button>
			<Button goto={LINKS.PERFIL}>Revisar mi perfil</Button>
		{/if}
	</div>
</div>

<style>
	#main-index {
		position: relative;
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		background: #888;
	}
</style>
