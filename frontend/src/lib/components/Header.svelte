<script lang="ts">
	import { page } from '$app/state';
	import { RolUsuario, Usuario } from '$lib/auth.svelte';
	import { LINKS } from '$lib/global/links';
	import EnumHelper from '$lib/helpers/EnumHelper';
	import IconoirLogOut from '$lib/icons/IconoirLogOut.svelte';
	import Button from './common/Button.svelte';
	import Database from '$lib/classes/Database';
	import { goto } from '$app/navigation';

	const AVAILABLE_SECTIONS = {
		INICIO: ['Inicio', LINKS.HOME],
		EDITOR_ENSAYOS: ['Editor de Ensayos', LINKS.EDITOR_ENSAYOS],
		PERFIL: ['Mi Perfil', LINKS.PERFIL],
		ENSAYOS: [Usuario.value?.rol === RolUsuario.Alumno ? 'Evalúate' : 'Ver Ensayos', LINKS.ENSAYOS],
		ARCHIVOS: ['Archivos', LINKS.ARCHIVOS],
		TEMARIOS: ['Temarios', LINKS.TEMARIOS]
	};

	let mobileMenuOpen = $state(false);

	// Close sidebar when clicking outside
	function handleOutsideClick(event: MouseEvent) {
		const sidebar = document.getElementById('mobile-sidebar');
		const hamburger = document.getElementById('hamburger-button');
		
		if (sidebar && hamburger && !sidebar.contains(event.target as Node) && !hamburger.contains(event.target as Node)) {
			mobileMenuOpen = false;
		}
	}

	$effect(() => {
		if (mobileMenuOpen) {
			document.addEventListener('click', handleOutsideClick);
			document.body.style.overflow = 'hidden'; // Prevent background scrolling
		} else {
			document.removeEventListener('click', handleOutsideClick);
			document.body.style.overflow = 'auto';
		}

		return () => {
			document.removeEventListener('click', handleOutsideClick);
			document.body.style.overflow = 'auto';
		};
	});
</script>

<div
	class="bg-muted/30 backdrop-blur-sm text-foreground sticky top-0 z-50 flex h-14 w-full flex-row items-center justify-between border-b border-border/30 p-2 md:p-4"
>
	<!-- Desktop Navigation -->
	<div class="absolute left-1/2 -translate-x-1/2 hidden md:flex flex-row gap-4 lg:gap-8">
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
				<a class={`font-medium text-sm lg:text-base ${selected ? 'border-b-4 font-extrabold' : ''}`} href={sectionLink}
					>{section}</a
				>
			{/each}
		{/if}
	</div>

	<!-- Mobile Hamburger Menu Button -->
	<button
		id="hamburger-button"
		class="md:hidden p-2 z-60 hover:bg-accent/50 rounded-lg transition-colors"
		onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
	>
		{#if mobileMenuOpen}
			<!-- X icon when menu is open -->
			<svg class="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
			</svg>
		{:else}
			<!-- Hamburger icon when menu is closed -->
			<svg class="w-6 h-6 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
			</svg>
		{/if}
	</button>

	<!-- Logout Button -->
	<Button
		class="ml-auto md:absolute md:right-4"
		size="icon"
		variant="outlined"
		onclick={() => {
			Database.logout();
			goto('/login');
		}}
	>
		<IconoirLogOut class="h-full w-full p-2" />
	</Button>
</div>

<!-- Mobile Sidebar Overlay -->
{#if mobileMenuOpen}
	<div class="md:hidden fixed inset-0 z-40 bg-black/50" style="top: 56px;"></div>
{/if}

<!-- Mobile Sidebar -->
<div
	id="mobile-sidebar"
	class={`md:hidden fixed top-14 left-0 h-[calc(100vh-56px)] w-64 bg-muted/30 backdrop-blur-sm border-r border-border z-50 transform transition-transform duration-300 ease-in-out ${
		mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
	}`}
>
	<div class="flex flex-col h-full">
		<!-- Navigation Links -->
		<nav class="flex-1 px-4 py-6 space-y-2">
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
					<a 
						class={`block px-4 py-3 rounded-lg font-medium transition-colors ${
							selected 
								? 'bg-primary text-primary-foreground font-extrabold' 
								: 'hover:bg-accent/50 hover:text-accent-foreground'
						}`} 
						href={sectionLink}
						onclick={() => (mobileMenuOpen = false)}
					>
						{section}
					</a>
				{/each}
			{/if}
		</nav>

		<!-- User Info Section -->
		{#if Usuario.value}
			<div class="border-t border-border/30 p-4 bg-background/50">
				<div class="flex items-center space-x-3">
					<div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
						<span class="text-primary-foreground text-sm font-semibold">
							{Usuario.value.nombre?.charAt(0).toUpperCase()}
						</span>
					</div>
					<div class="flex-1 min-w-0">
						<p class="text-sm font-medium truncate">{Usuario.value.nombre}</p>
						<p class="text-xs text-muted-foreground truncate">{Usuario.value.correo}</p>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
