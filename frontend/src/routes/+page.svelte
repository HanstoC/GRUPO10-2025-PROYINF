<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { AuthService } from '$lib/api/auth';
	import { RolUsuario, Usuario } from '$lib/auth.svelte';
	import StudentsResults from '$lib/components/profesor/StudentsResults.svelte';
	import TeacherSummary from '$lib/components/profesor/TeacherSummary.svelte';
	import ProfileSnippet from '$lib/components/utils/ProfileSnippet.svelte';
	import SearchAlumno from '$lib/components/utils/SearchAlumno.svelte';
	import { LINKS } from '$lib/global/links';
	import { fade } from 'svelte/transition';

	$effect(() => {
		if (page.url.hash.match(/logout/gi)) AuthService.logout().then(() => goto(LINKS.LOGIN));
	});
</script>

{#if Usuario.value}
	{#snippet alumno()}{/snippet}

	{#snippet profesor()}
		<div class="flex w-full flex-row gap-4">
			<div class="flex-1/8">
				<ProfileSnippet />
			</div>
			<div class="flex-3"></div>
		</div>
		<StudentsResults />
		<TeacherSummary />
	{/snippet}

	{#snippet visualizador()}
		<div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
			<SearchAlumno />
		</div>
	{/snippet}

	{@const Snippet = {
		[RolUsuario.Alumno]: alumno,
		[RolUsuario.Profesor]: profesor,
		[RolUsuario.Visualizador]: visualizador
	}[Usuario.value?.rol as RolUsuario]}

	<div class="flex w-full flex-col gap-2" in:fade>
		{@render Snippet?.()}
	</div>
{/if}
