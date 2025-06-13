<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	let { children, class: className, ...props }: HTMLAttributes<HTMLDivElement> = $props();
</script>

<div class={`mt-4 flex w-full px-4 sm:w-11/12 sm:px-6 md:w-11/12 lg:w-5/6 xl:w-4/5 2xl:w-3/4 flex-col items-center justify-center ${className}`}>
	{@render children?.()}
</div>
