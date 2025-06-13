<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		children,
		backButton,
		class: className,
		...props
	}: HTMLAttributes<HTMLDivElement> & { backButton?: boolean } = $props();
</script>

{#if backButton}
	<!-- TODO: -->
{/if}
<div
	class={`my-4 flex h-full w-3/5 flex-col items-center justify-center gap-2 ${className}`}
	{...props}
>
	{@render children?.()}
</div>
