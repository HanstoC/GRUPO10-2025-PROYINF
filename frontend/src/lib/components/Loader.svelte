<script lang="ts">
	import { Usuario } from '$lib/auth.svelte';
	import { fade } from 'svelte/transition';
	import { explicitEffect, Utils } from '../../utils/Utils.svelte';
	import LoadingIndicator from './common/utils/LoadingIndicator.svelte';

	let visible = $state(false);
	let lastId = '';

	explicitEffect(
		() => {
			if (lastId === Usuario.value?.id) return;
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
			lastId = Usuario.value?.id;
		},
		() => [Usuario.value],
		true
	);
</script>

{#if visible}
	<div
		out:fade={{ duration: 200 }}
		class="bg-background absolute top-0 left-0 z-[100] flex h-full w-full items-center justify-center"
	>
		<LoadingIndicator size="lg" text="" />
	</div>
{/if}
