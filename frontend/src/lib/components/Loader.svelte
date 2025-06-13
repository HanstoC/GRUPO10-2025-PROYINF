<script lang="ts">
	import { Usuario } from '$lib/auth.svelte';
	import { fade } from 'svelte/transition';
	import { explicitEffect, Utils } from '../../utils/Utils.svelte';
	import LoadingIndicator from './common/utils/LoadingIndicator.svelte';

	let visible = $state(false);

	explicitEffect(
		() => {
			visible = true;
			(async () => {
				await Promise.race([
					new Promise<void>((resolve) => {
						const onload = () => {
							() => {
								resolve();
								document.removeEventListener('load', onload);
							};
						};

						document.addEventListener('load', onload);
					}),
					Utils.timeout(1000)
				]);
				visible = false;
			})();
		},
		() => [Usuario.value],
		true
	);
</script>

{#if visible}
	<div
		out:fade={{ duration: 200 }}
		class="bg-background absolute left-0 top-0 z-[100] flex h-full w-full items-center justify-center"
	>
		<LoadingIndicator size="lg" text="" />
	</div>
{/if}
