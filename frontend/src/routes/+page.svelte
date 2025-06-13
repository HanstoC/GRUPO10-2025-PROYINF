<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { NombreUsuario, RolUsuario, Usuario } from '$lib/auth.svelte';
	import Database from '$lib/classes/Database';
	import PageMargin from '$lib/components/common/PageMargin.svelte';
	import StudentsResults from '$lib/components/profesor/StudentsResults.svelte';
	import TeacherSummary from '$lib/components/profesor/TeacherSummary.svelte';
	import SearchAlumno from '$lib/components/utils/SearchAlumno.svelte';
	import { LINKS } from '$lib/global/links';

	$effect(() => {
		if (page.url.hash.match(/logout/gi)) Database.logout().then(() => goto(LINKS.LOGIN));
	});
</script>

{#if Usuario.value}
	{#snippet alumno()}{/snippet}

	{#snippet profesor()}
		<div class="flex w-full flex-row gap-4">
			<StudentsResults />
			<TeacherSummary />
		</div>
	{/snippet}

	{#snippet visualizador()}
		<SearchAlumno />
	{/snippet}

	<PageMargin>
		<div>
			<h2>Bienvenido, {NombreUsuario}!</h2>
		</div>
		{@render {
			[RolUsuario.Alumno]: alumno,
			[RolUsuario.Profesor]: profesor,
			[RolUsuario.Visualizador]: visualizador
		}[Usuario.value!.rol]()}
	</PageMargin>
{/if}
