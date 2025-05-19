<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		children,
		required,
		...props
	}: HTMLAttributes<HTMLDivElement> & {
		required?: boolean;
	} = $props();
	let item: HTMLDivElement;

	$effect(() => {
		if (required) {
		}
	});
</script>

<div bind:this={item} class="w-[inherit]">
	{@render children?.()}
</div>
