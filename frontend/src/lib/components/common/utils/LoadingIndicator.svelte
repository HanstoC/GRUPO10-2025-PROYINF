<script lang="ts">
	import LineMdLoadingLoop from '$lib/icons/LineMdLoadingLoop.svelte';
	import { fade } from 'svelte/transition';

	let { size = 'default', text = 'Cargando...' }: { size?: 'default' | 'lg'; text?: string } =
		$props();
	let mounted = $state(false);
	$effect(() => void (mounted = true));
</script>

{#key mounted}
	<span class={size === 'lg' ? 'flex flex-col gap-1 text-lg' : 'text-md'} in:fade>
		<LineMdLoadingLoop
			class={`${text.length ? 'svg-icon' : ''} inline aspect-square h-auto w-auto ${size === 'lg' ? 'mr-0! h-10!' : ''}`}
		/>
		{text}
	</span>
{/key}
