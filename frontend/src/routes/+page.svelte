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
	import Card from '$lib/components/common/Card.svelte';


	$effect(() => {
		if (page.url.hash.match(/logout/gi)) AuthService.logout().then(() => goto(LINKS.LOGIN));
	});
</script>

{#if Usuario.value}
	{#snippet alumno()}
	<div class="flex flex-col gap-6 w-full max-w-3xl mx-auto">

		<Card class="w-full p-10 flex justify-center items-center">
			<h2 class="text-3xl font-bold text-center">
				Bienvenido alumno<br />
				¿Qué te gustaría hacer hoy?
			</h2>
		</Card>

		<Card
			class="w-full max-w-5xl cursor-pointer rounded-xl overflow-hidden shadow-lg
				bg-cover bg-center hover:scale-[1.02] transition-transform min-h-[320px]"
			style="background-image: url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdobqqzq78l5kdc-eVWm4dsP05l23ojaqUHEZrmPrwpWpFmojUNK4gojg_-ZUt8hAvmZA&usqp=CAU');"
			onclick={() => goto('/ensayos/random')}
		>
			<div class="bg-black/40 w-full h-full p-10 flex justify-center items-center">
				<p class="text-2xl font-semibold text-white text-center">
					¿Te interesa practicar con una pregunta aleatoria?
				</p>
			</div>
		</Card>

		<Card
			class="w-full max-w-5xl cursor-pointer rounded-xl overflow-hidden shadow-lg
				bg-cover bg-center hover:scale-[1.02] transition-transform min-h-[320px]"
			style="background-image: url('https://i.pinimg.com/originals/1d/40/0e/1d400e79e924b844848049f3e52172b2.jpg');"
			onclick={() => goto('/ensayos')}
		>
			<div class="bg-black/40 w-full h-full p-10 flex justify-center items-center">
				<p class="text-2xl font-semibold text-white text-center">
					¡Realicemos un ensayo!
				</p>
			</div>
		</Card>

	</div>
	{/snippet}

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
