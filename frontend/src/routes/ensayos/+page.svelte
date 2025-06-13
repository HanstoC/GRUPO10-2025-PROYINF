<script lang="ts">
	import Card from '$lib/components/common/Card.svelte';
	import PageMargin from '$lib/components/common/PageMargin.svelte';
	import SearchBar from '$lib/components/common/SearchBar.svelte';
	import FilterAsignatura from '$lib/components/ensayos/FilterAsignatura.svelte';
	import IconoirEmojiSad from '$lib/icons/IconoirEmojiSad.svelte';
	import { explicitEffect, Utils } from '../../utils/Utils.svelte';
	import LoadingIndicator from '$lib/components/common/utils/LoadingIndicator.svelte';
	import Form from '$lib/components/common/Form';
	import { goto } from '$app/navigation';
	import { LINKS } from '$lib/global/links';
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { RolUsuario, Usuario } from '$lib/auth.svelte';
	import Button from '$lib/components/common/Button.svelte';

	interface URLParams {
		q: string;
		s: string;
	}

	let ready: boolean = $state(false);
	let query: string = $state(page.url.searchParams.get('q') ?? '');
	let selectedAsignaturas: string[] = $state(
		(page.url.searchParams.get('s') ?? '').split(',').filter((s) => s)
	);
	let searchTimeout: number;

	const search = $derived(() =>
		goto(
			LINKS.ENSAYOS +
				`?${Object.entries({
					q: query,
					s: selectedAsignaturas.length ? selectedAsignaturas.join(',') : ''
				} satisfies URLParams)
					.filter(([, v]) => v)
					.map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
					.join('&')}`,
			{ replaceState: true, keepFocus: true, noScroll: true }
		)
	);

	explicitEffect(
		() => {
			clearTimeout(searchTimeout);
			if (!ready) return;
			searchTimeout = setTimeout(search, 500);
			return () => {
				clearTimeout(searchTimeout);
			};
		},
		() => [selectedAsignaturas, query]
	);

	onMount(() => (ready = true));
</script>

<PageMargin>
	{#if Usuario.value?.rol === RolUsuario.Profesor}
		<Card class="w-full">
			<Button goto={LINKS.EDITOR_ENSAYOS}>Crear ensayo</Button>
		</Card>
	{/if}
	<Card class="w-full">
		<div class="flex flex-col gap-2">
			<Form.Root class="w-fit">
				<Form.Item modified={Boolean(selectedAsignaturas.length)} label="Filtrar por asignaturas">
					<FilterAsignatura bind:selected={selectedAsignaturas} />
				</Form.Item>
			</Form.Root>
			<SearchBar
				bind:value={query}
				placeholder="Buscar en título, descripción, autores..."
				onclick={search}
			/>
		</div>
	</Card>
	<Card variant="outlined" size="lg" class="flex h-full w-full items-center justify-center">
		{#key page.url.searchParams}
			{#await (async () => {
				let timeout = Utils.timeout(1000);
				// results = await fetch().then(res => res.json());
				await timeout;
				return [];
			})()}
				<LoadingIndicator size="lg" />
			{:then ensayos}
				{#if !ensayos?.length}
					<div class="flex select-none flex-col gap-1 opacity-50">
						<IconoirEmojiSad class="h-10! w-auto! aspect-square" />
						<p class="italic">No han habido resultados...</p>
					</div>
				{:else}
					<div class="h-full w-full">
						{#each ensayos as ensayo}
							{ensayo}
						{/each}
					</div>
				{/if}
			{/await}
		{/key}
	</Card>
</PageMargin>
