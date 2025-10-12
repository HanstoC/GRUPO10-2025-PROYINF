<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	let { children, label, ...props }: HTMLAttributes<HTMLLIElement> & { label?: string } = $props();
</script>

<li {...props}>
	{#if label}
		<span class="font-bold">{label}:</span>
	{/if}
	{@render children?.()}
</li>
