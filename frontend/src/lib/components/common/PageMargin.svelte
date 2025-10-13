<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import Button from './Button.svelte';
	import MaterialSymbolsArrowBack from '$lib/icons/MaterialSymbolsArrowBack.svelte';

	let {
		children,
		backButton,
		text,
		class: className,
		...props
	}: HTMLAttributes<HTMLDivElement> & { backButton?: boolean; text?: string } = $props();
</script>

<div
	class={`relative my-4 flex h-full w-3/5 flex-col items-center justify-center gap-2 overflow-hidden ${className}`}
	{...props}
>
	{#if backButton || text}
		<div class="flex w-full flex-row items-center justify-start gap-4">
			{#if backButton}
				<Button size="sm" variant="secondary" onclick={() => history.back()}
					><MaterialSymbolsArrowBack class="scale-70" /> Atrás
				</Button>
			{/if}
			{#if text}
				<h3 class="text-muted-foreground w-full">
					{text}
				</h3>
			{/if}
		</div>
	{/if}
	{@render children?.()}
</div>
