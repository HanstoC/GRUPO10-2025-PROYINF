<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { RolUsuario, Usuario } from '$lib/auth.svelte';
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
        <div class="flex w-full flex-col gap-4 lg:flex-row lg:gap-6">
            <div class="w-full lg:w-1/2">
                <StudentsResults />
            </div>
            <div class="w-full lg:w-1/2">
                <TeacherSummary />
            </div>
        </div>
    {/snippet}

    {#snippet visualizador()}
        <div class="w-full">
            <SearchAlumno />
        </div>
    {/snippet}

    <PageMargin>
        <div class="mb-6">
            <h2 class="text-2xl font-bold text-gray-800 sm:text-3xl">
                Bienvenido, {Usuario.value?.nombre}!
            </h2>
        </div>
        <div class="w-full">
            {@render {
                [RolUsuario.Alumno]: alumno,
                [RolUsuario.Profesor]: profesor,
                [RolUsuario.Visualizador]: visualizador
            }[Usuario.value!.rol]()}
        </div>
    </PageMargin>
{/if}
