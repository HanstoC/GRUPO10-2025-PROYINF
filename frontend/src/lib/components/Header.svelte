<script lang="ts">
	import { page } from '$app/state';
	import { RolUsuario, Usuario } from '$lib/auth.svelte';
	import { LINKS } from '$lib/global/links';
	import EnumHelper from '$lib/helpers/EnumHelper';
	import IconoirLogOut from '$lib/icons/IconoirLogOut.svelte';
	import Button from './common/Button.svelte';

	const AVAILABLE_SECTIONS = {
		INICIO: ['Inicio', LINKS.HOME],
		EDITOR_ENSAYOS: ['Editor de Ensayos', LINKS.EDITOR_ENSAYOS],
		PERFIL: ['Mi Perfil', LINKS.PERFIL],
		ENSAYOS: [Usuario.value?.rol === RolUsuario.Alumno ? 'Evalúate' : 'Ver Ensayos', LINKS.ENSAYOS],
		ARCHIVOS: ['Archivos', LINKS.ARCHIVOS],
		TEMARIOS: ['Temarios', LINKS.TEMARIOS]
	};
</script>

<div
	class="bg-background text-foreground sticky top-0 z-50 flex h-14 w-full flex-row items-center justify-between border-b-[1px] p-2"
>
	<div class="absolute left-4">
		Barra de navegación específicamente diseñada para {EnumHelper.rolUsuarioName(
			Usuario.value?.rol
		)}
	</div>
	<div class="absolute left-1/2 flex -translate-x-1/2 flex-row gap-8">
		{#if Usuario.value}
			{@const SECTIONS = [
				//
				AVAILABLE_SECTIONS.INICIO,
				AVAILABLE_SECTIONS.TEMARIOS,
				...(Usuario.value?.rol === RolUsuario.Profesor
					? [AVAILABLE_SECTIONS.EDITOR_ENSAYOS]
					: [AVAILABLE_SECTIONS.ENSAYOS]),
				AVAILABLE_SECTIONS.ARCHIVOS,
				AVAILABLE_SECTIONS.PERFIL
			]}
			{#each SECTIONS as [section, sectionLink], i (i)}
				{@const selected = page.url.pathname === sectionLink}
				<a class={`font-medium ${selected ? 'border-b-4 font-extrabold' : ''}`} href={sectionLink}
					>{section}</a
				>
			{/each}
		{/if}
	</div>
	<Button
		class="absolute right-4"
		size="icon"
		variant="outlined"
		onclick={() => {
			Usuario.value = null;
		}}
	>
		<IconoirLogOut class="h-full w-full p-2" />
	</Button>
</div>
