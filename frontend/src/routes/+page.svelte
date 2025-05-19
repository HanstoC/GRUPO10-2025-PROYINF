<script lang="ts">
	import { RolUsuario, Usuario } from '$lib/auth.svelte';
	import PageMargin from '$lib/components/common/PageMargin.svelte';
	import Summary from '$lib/components/ensayos/Summary.svelte';
	import StudentsResults from '$lib/components/profesor/StudentsResults.svelte';
	import TeacherSummary from '$lib/components/profesor/TeacherSummary.svelte';
	import SearchAlumno from '$lib/components/utils/SearchAlumno.svelte';
</script>

{#snippet alumno()}
	<Summary />
{/snippet}

{#snippet profesor()}
	<div class="flex w-full flex-row gap-4">
		<StudentsResults />
		<TeacherSummary />
	</div>
{/snippet}

{#snippet visualizador()}
	<SearchAlumno />
{/snippet}

{#if Usuario.value}
	<PageMargin>
		<div class="mt-10 flex h-full w-full flex-col items-center justify-center gap-4">
			<div>
				<h2>Bienvenido, {Usuario.value.nombre}!</h2>
			</div>
			{@render {
				[RolUsuario.Alumno]: alumno,
				[RolUsuario.Profesor]: profesor,
				[RolUsuario.Visualizador]: visualizador
			}[Usuario.value!.rol]()}
		</div>
	</PageMargin>
{/if}
