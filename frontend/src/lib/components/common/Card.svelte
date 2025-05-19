<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		children,
		size = 'md',
		variant = 'default',
		startIcon = undefined,
		class: _class,
		...props
	}: HTMLAttributes<HTMLDivElement> & {
		size?: 'sm' | 'md' | 'lg';
		variant?: 'default' | 'outlined';
		startIcon?: string;
	} = $props();
</script>

<div
	{...props}
	class={`bg-card text-card-foreground rounded-xl p-4 [&.lg]:p-8 [&.outlined]:border-1 [&.outlined]:border-[#fff8] [&.sm]:p-2 ${_class} ${size} ${variant}`}
>
	{#if startIcon}
		<iconify-icon height="100%" width="auto" class="left-0 h-full" icon={startIcon}></iconify-icon>
	{/if}
	{@render children?.()}
</div>
