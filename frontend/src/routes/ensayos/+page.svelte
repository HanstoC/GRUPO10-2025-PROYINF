<script>
	import Card from '$lib/components/common/Card.svelte';
	import PageMargin from '$lib/components/common/PageMargin.svelte';
	import SearchBar from '$lib/components/common/SearchBar.svelte';
</script>

<PageMargin class="flex flex-col gap-2">
	<Card class="w-full">
		<div class="flex flex-col gap-4">
			<h2>Ensayos</h2>
			<SearchBar placeholder="Buscar ensayos..." />
		</div>
	</Card>
</PageMargin>
