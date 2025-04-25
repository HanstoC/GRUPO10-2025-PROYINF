<script lang="ts">
	import { RolUsuario, Usuario } from '$lib/auth.svelte';
	import { LINKS } from '$lib/global/links';
	import Button from '../common/Button.svelte';
	import Vr from '../common/Vr.svelte';

	const AVAILABLE_SECTIONS = {
		INICIO: ['Inicio', LINKS.HOME],
		EDITOR_ENSAYOS: ['Editor de Ensayos', LINKS.EDITOR_ENSAYOS],
		PERFIL: ['Mi Perfil', LINKS.PERFIL],
		PRACTICAR: ['Practicar', LINKS.PRACTICA],
		ENSAYOS: [Usuario.value?.rol === RolUsuario.Alumno ? 'Evalúate' : 'Ver Ensayos', LINKS.ENSAYOS]
	};
</script>

<div id="header">
	<div class="absolute left-4">
		Barra de navegación específicamente diseñada para {RolUsuario[
			Usuario.value?.rol ?? RolUsuario.Alumno
		]}
	</div>
	<actions>
		{#if Usuario.value}
			{@const SECTIONS = [
				//
				AVAILABLE_SECTIONS.INICIO,
				...(Usuario.value?.rol === RolUsuario.Profesor
					? [AVAILABLE_SECTIONS.EDITOR_ENSAYOS]
					: [AVAILABLE_SECTIONS.ENSAYOS, AVAILABLE_SECTIONS.PRACTICAR]),
				AVAILABLE_SECTIONS.PERFIL
			]}
			{#each SECTIONS as [section, sectionLink], i (i)}
				<a href={sectionLink}>{section}</a>
				{#if i < SECTIONS.length - 1}
					<Vr />
				{/if}
			{/each}
		{/if}
	</actions>
	<Button
		class="absolute right-4"
		onclick={() => {
			Usuario.value = null;
		}}
	>
		Cerrar Sesión
	</Button>
</div>

<style>
	#header {
		width: 100%;
		padding: 0.5rem 1rem;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		gap: 0.2rem;
		background: #fff;
	}

	actions {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		gap: 0.2rem;
		height: 100%;
		width: 100%;

		a {
			background: #0000;
			color: #444;
		}
	}
</style>
