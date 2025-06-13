<script lang="ts">
	import Card from '$lib/components/common/Card.svelte';
	import FeatureList from '$lib/components/common/FeatureList';
	import PageMargin from '$lib/components/common/PageMargin.svelte';
	import LoadingIndicator from '$lib/components/common/utils/LoadingIndicator.svelte';
	import LastEnsayos from '$lib/components/ensayos/LastEnsayos.svelte';
	import { Utils } from '../../utils/Utils.svelte';

	let estadisticas: Promise<{
		ensayos_realizados?: number;
		ensayos_completados?: number;
	}> = $state(
		new Promise(async (r) => {
			let out: any = {};
			let timeout = Utils.timeout(500);
			await timeout;
			r(out);
		})
	);
</script>

<PageMargin>
	<Card size="lg" class="flex h-full w-full flex-col gap-4">
		{#await Promise.all([estadisticas])}
			<LoadingIndicator size="lg" />
		{:then [estadisticas]}
			<FeatureList.Root>
				<FeatureList.Item label="Ensayos realizados"
					>{estadisticas.ensayos_realizados ?? 0}</FeatureList.Item
				>
				<FeatureList.Item label="Ensayos completados"
					>{estadisticas.ensayos_completados ?? 0}</FeatureList.Item
				>
			</FeatureList.Root>
			<Card class="h-1/4 w-full">
				<LastEnsayos />
			</Card>
		{/await}
	</Card>
</PageMargin>
