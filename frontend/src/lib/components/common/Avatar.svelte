<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	let { class: _class, children, ...props }: HTMLAttributes<HTMLDivElement> = $props();
</script>

<div
	class={`flex aspect-square items-center justify-center overflow-hidden rounded-[50%] bg-white ${_class}`}
>
	{#if children}
		{@render children?.()}
	{/if}
	<img src="/user-avatar.svg" alt="Usuario" class="h-full w-full" />
</div>
