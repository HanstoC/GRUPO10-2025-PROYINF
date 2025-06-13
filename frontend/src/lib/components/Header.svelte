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
