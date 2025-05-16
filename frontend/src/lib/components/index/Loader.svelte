<script lang="ts">
	import { Usuario } from '$lib/auth.svelte';
	import { tick } from 'svelte';
	import { fade } from 'svelte/transition';
	import { Utils } from '../../../utils/Utils';

	let visible = $state(false);

	$effect.pre(() => {
		let _ = Usuario.value;
		(async () => {
			visible = true;
			await tick();
			await Utils.timeout(500);
			visible = false;
		})();
	});
</script>

{#if visible}
	<div
		out:fade={{ duration: 200 }}
		class="absolute left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-white"
	></div>
{/if}
