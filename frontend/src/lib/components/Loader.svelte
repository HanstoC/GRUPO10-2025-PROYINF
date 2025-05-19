<script lang="ts">
	import { Usuario } from '$lib/auth.svelte';
	import { tick } from 'svelte';
	import { fade } from 'svelte/transition';
	import { Utils } from '../../utils/Utils';

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
		class="bg-background absolute top-0 left-0 z-[100] flex h-full w-full items-center justify-center"
	></div>
{/if}
