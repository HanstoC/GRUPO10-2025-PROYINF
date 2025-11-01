<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		class: _class = '',
		icon,
		...props
	}: HTMLAttributes<HTMLDivElement> & { icon?: string } = $props();
</script>

<div
	{...props}
	class={`bg-muted text-foreground relative flex items-center justify-center overflow-hidden rounded-full border ${_class}`}
>
	{#if icon?.startsWith('http') || icon?.startsWith('/')}
		<img src={icon} alt="Avatar" class="h-full w-full object-cover" />
	{:else}
		<span class="select-none text-lg font-semibold">{icon?.charAt(0)?.toUpperCase()}</span>
	{/if}
</div>

<style>
	div {
		aspect-ratio: 1 / 1;
		width: 100%;
		height: auto;
		max-width: 100%;
	}
</style>
