<script lang="ts">
	import LineMdLoadingLoop from '$lib/icons/LineMdLoadingLoop.svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { fade } from 'svelte/transition';

	let {
		size = 'default',
		text = 'Cargando...',
		class: _class
	}: { size?: 'default' | 'lg'; text?: string } & HTMLAttributes<HTMLDivElement> = $props();
	let mounted = $state(false);
	$effect(() => void (mounted = true));
</script>

{#key mounted}
	<div
		class="{size === 'lg'
			? 'flex flex-col gap-1 text-lg'
			: 'text-md'} h-full w-full items-center justify-center text-center {_class}"
		in:fade
	>
		<LineMdLoadingLoop
			class={`${text.length ? 'svg-icon' : ''} inline aspect-square h-auto w-auto ${size === 'lg' ? 'mr-0! h-10!' : ''}`}
		/>
		{text}
	</div>
{/key}
