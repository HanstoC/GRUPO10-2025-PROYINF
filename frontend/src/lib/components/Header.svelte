<script lang="ts">
	import { goto } from '$app/navigation';
	import { NombreUsuario, RolUsuario, Usuario } from '$lib/auth.svelte';
	import { LINKS } from '$lib/global/links';
	import EnumHelper from '$lib/helpers/EnumHelper';
	import IconoirLogOut from '$lib/icons/IconoirLogOut.svelte';
	import IconoirMenu from '$lib/icons/IconoirMenu.svelte';
	import IconoirProfileCircle from '$lib/icons/IconoirProfileCircle.svelte';
	import Button from './common/Button.svelte';
	import DropdownMenu from './common/Dropdown Menu';
	import Vr from './common/Vr.svelte';

	const AVAILABLE_SECTIONS = {
		INICIO: ['Inicio', LINKS.HOME],
		EVALUATE: ['Evalúate', LINKS.EVALUATE],
		TEMARIOS: ['Temarios', LINKS.TEMARIOS]
	};

	let mobileMenuOpen = $state(false);

	// Close sidebar when clicking outside
	function handleOutsideClick(event: MouseEvent) {
		const sidebar = document.getElementById('mobile-sidebar');
		const hamburger = document.getElementById('hamburger-button');

		if (
			sidebar &&
			hamburger &&
			!sidebar.contains(event.target as Node) &&
			!hamburger.contains(event.target as Node)
		) {
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
	class="bg-card text-card-foreground bg-linear-to-r/shorter sticky top-0 z-50 flex h-14 w-full flex-row items-center justify-between border-b-[1px] p-2"
>
	<div class="absolute left-4">
		Barra de navegación específicamente diseñada para {EnumHelper.rolUsuarioName(
			Usuario.value?.rol
		)}
	</div>
	<div class="absolute left-1/2 flex h-full -translate-x-1/2 flex-row items-center justify-center">
		{#if Usuario.value}
			{@const SECTIONS = [
				//
				AVAILABLE_SECTIONS.INICIO,
				...(Usuario.value?.rol !== RolUsuario.Visualizador
					? [
							...(Usuario.value?.rol === RolUsuario.Alumno
								? [AVAILABLE_SECTIONS.TEMARIOS, AVAILABLE_SECTIONS.EVALUATE]
								: [])
						]
					: [])
			]}
			{#each SECTIONS as [section, sectionLink], i (i)}
				<a href={sectionLink}>
					<Button variant="link">
						{section}
					</Button>
				</a>
				{#if i < SECTIONS.length - 1}
					<Vr />
				{/if}
			{/each}
		{/if}
	</div>

	<div class="absolute right-4 z-10 flex flex-row items-center justify-center gap-2">
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<Button variant="outlined">
					<IconoirMenu class="svg-icon" />
					{NombreUsuario}
				</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				<DropdownMenu.Group>
					<DropdownMenu.Item onclick={() => goto(LINKS.PERFIL)}>
						<IconoirProfileCircle class="svg-icon" /> Perfil</DropdownMenu.Item
					>
					<DropdownMenu.Separator />
					<DropdownMenu.Item variant="destructive" onclick={() => goto(LINKS.LOGOUT)}
						><IconoirLogOut class="svg-icon" /> Cerrar Sesión</DropdownMenu.Item
					>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
</div>

<!-- Mobile Sidebar Overlay -->
{#if mobileMenuOpen}
	<div class="fixed inset-0 z-40 bg-black/50 md:hidden" style="top: 56px;"></div>
{/if}

<!-- Mobile Sidebar -->
<div
	id="mobile-sidebar"
	class={`bg-muted/30 border-border fixed left-0 top-14 z-50 h-[calc(100vh-56px)] w-64 transform border-r backdrop-blur-sm transition-transform duration-300 ease-in-out md:hidden ${
		mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
	}`}
>
	<div class="flex h-full flex-col">
		<!-- Navigation Links -->
		<nav class="flex-1 space-y-2 px-4 py-6">
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
						class={`block rounded-lg px-4 py-3 font-medium transition-colors ${
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
			<div class="border-border/30 bg-background/50 border-t p-4">
				<div class="flex items-center space-x-3">
					<div class="bg-primary flex h-8 w-8 items-center justify-center rounded-full">
						<span class="text-primary-foreground text-sm font-semibold">
							{Usuario.value.nombre?.charAt(0).toUpperCase()}
						</span>
					</div>
					<div class="min-w-0 flex-1">
						<p class="truncate text-sm font-medium">{Usuario.value.nombre}</p>
						<p class="text-muted-foreground truncate text-xs">{Usuario.value.correo}</p>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
