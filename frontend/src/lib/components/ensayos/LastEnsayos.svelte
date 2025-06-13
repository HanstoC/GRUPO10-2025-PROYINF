<script lang="ts">
	import { Utils } from '../../../utils/Utils.svelte';
	import Card from '../common/Card.svelte';
	import SearchBar from '../common/SearchBar.svelte';
	import LoadingIndicator from '../common/utils/LoadingIndicator.svelte';

	const search = () => {};
	let query = $state('');
	let lastEnsayos = $state([]);
</script>

<div class="flex h-full flex-col gap-2">
	<SearchBar bind:value={query} placeholder="Buscar en ensayos realizados..." onclick={search}
	></SearchBar>
	<Card size="sm" class="flex h-full flex-col items-center justify-center text-sm">
		{#key lastEnsayos}
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
						Aún no realizaste ningún ensayo
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
</div>
