<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	let { children, class: className, ...props }: HTMLAttributes<HTMLDivElement> = $props();
</script>

<div class={`mt-4 flex w-3/5 flex-col items-center justify-center ${className}`}>
	{@render children?.()}
</div>
