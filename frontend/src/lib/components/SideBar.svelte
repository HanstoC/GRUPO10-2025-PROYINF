<script lang="ts">
	import { RolUsuario, Usuario } from '$lib/auth.svelte';
	import { LINKS } from '$lib/global/links';
	import Button from './common/Button.svelte';
	import Avatar from './common/Avatar.svelte';
	import Vr from './common/Vr.svelte';
	import Firma from './common/Firma.svelte';
	import MaterialSymbolsHomeRounded from '$lib/icons/MaterialSymbolsHomeRounded.svelte';
	import MaterialSymbolsAutoAwesomeMotionRounded from '$lib/icons/MaterialSymbolsAutoAwesomeMotionRounded.svelte';
	import MaterialSymbolsBookRibbonRounded from '$lib/icons/MaterialSymbolsBookRibbonRounded.svelte';
	import IconoirProfileCircle from '$lib/icons/IconoirProfileCircle.svelte';
	import MaterialSymbolsPerson2Rounded from '$lib/icons/MaterialSymbolsPerson2Rounded.svelte';
	import MaterialSymbolsLogoutRounded from '$lib/icons/MaterialSymbolsLogoutRounded.svelte';
	import { page } from '$app/state';
	import MaterialSymbolsSpeedRounded from '$lib/icons/MaterialSymbolsSpeedRounded.svelte';

	type section = { title: string; url: string; icon?: any };
	const AVAILABLE_SECTIONS = {
		INICIO: { title: 'Inicio', url: LINKS.HOME, icon: MaterialSymbolsHomeRounded },
		ENSAYOS: {
			title: 'Ensayos',
			url: LINKS.ENSAYOS,
			icon: MaterialSymbolsBookRibbonRounded
		},
		RESULTADOS_ALUMNO: {
			title: 'Estadísticas',
			url: LINKS.RESULTADOS_ENSAYOS,
			icon: MaterialSymbolsSpeedRounded
		},
		TEMARIOS: {
			title: 'Temarios',
			url: LINKS.TEMARIOS,
			icon: MaterialSymbolsAutoAwesomeMotionRounded
		},
		PERFIL: {
			title: 'Mi perfil',
			url: LINKS.PERFIL,
			icon: MaterialSymbolsPerson2Rounded
		},
		CERRAR_SESIÓN: {
			title: 'Cerrar sesión',
			url: LINKS.LOGOUT,
			icon: MaterialSymbolsLogoutRounded
		}
	} as const;
</script>

{#snippet renderSections(sections: section[])}
	{#each sections as { title, url, icon }, i (i)}
		{@const selected = decodeURIComponent(page.url.pathname) === url}
		{@const Icon = icon}
		<a href={url} class="w-full">
			<Button
				class="w-full justify-start border text-base shadow-sm {selected
					? 'bg-accent text-accent-foreground'
					: 'bg-background'}"
				variant="ghost"
			>
				{#if icon}
					<Icon class="mr-2 scale-110" />
				{/if}
				{title}
			</Button>
		</a>
		{#if i < sections.length - 1}
			<Vr />
		{/if}
	{/each}
{/snippet}

{#if Usuario.value}
	{@const SECTIONS = [
		AVAILABLE_SECTIONS.INICIO,
		...(Usuario.value?.rol !== RolUsuario.Visualizador
			? [
					...(Usuario.value?.rol === RolUsuario.Alumno
						? [
								AVAILABLE_SECTIONS.ENSAYOS,
								AVAILABLE_SECTIONS.RESULTADOS_ALUMNO,
								AVAILABLE_SECTIONS.TEMARIOS
							]
						: [AVAILABLE_SECTIONS.ENSAYOS])
				]
			: [])
	]}
	{@const rolColegio = (
		(Usuario.value.genero?.startsWith('F')
			? Usuario.value.rol.replace(/o$/gi, 'A').replace(/r$/gi, 'RA')
			: Usuario.value.rol) +
		(Usuario.value.rol !== 'visualizador' ? ` de ${Usuario.value.colegio}` : '')
	).toUpperCase()}

	<div
		class="from-background to-foreground/10 w-xs min-w-xs z-40 h-screen max-w-xs border-r bg-gradient-to-b from-25% shadow-lg"
	>
		<div class="border-background flex h-full w-full flex-col border-l-2 border-r-2 p-4 px-6">
			<div class="flex w-full flex-col items-start gap-2 border-b py-5">
				<div class="flex h-20 w-full items-center justify-center">
					<div class="aspect-square h-full w-auto">
						<Avatar icon={Usuario.value.imagen ?? Usuario.value.nombre} />
					</div>
				</div>
				<div class="tracking-tight">
					<a class="text-xl font-semibold hover:underline" href={LINKS.PERFIL}>
						{Usuario.value.nombre}
						{Usuario.value.paterno}
						{Usuario.value.materno}<br />
					</a>
					<p class="text-muted-foreground text-sm font-light">{Usuario.value.email}</p>
					<p
						class="text-muted-foreground -mt-1 text-ellipsis text-nowrap text-sm font-medium uppercase"
						title={rolColegio}
					>
						{rolColegio}
					</p>
				</div>
			</div>

			<nav class="mt-6 flex flex-col gap-1">
				{@render renderSections(SECTIONS)}
			</nav>

			<div class="bottom-0 mt-auto w-full border-t">
				<nav class="flex flex-col gap-1 py-4">
					{@render renderSections([AVAILABLE_SECTIONS.PERFIL, AVAILABLE_SECTIONS.CERRAR_SESIÓN])}
				</nav>
				<Firma />
			</div>
		</div>
	</div>
{/if}

<style>
	:global(body) {
		overflow-x: hidden;
	}
</style>
