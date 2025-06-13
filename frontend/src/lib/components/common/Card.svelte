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
	class={`bg-card text-card-foreground rounded-xl 
		${size === 'sm' ? 'p-2 sm:p-3' : size === 'lg' ? 'p-4 sm:p-6 md:p-8' : 'p-3 sm:p-4'} 
		${variant === 'outlined' ? 'border border-border/20' : ''} 
		${_class}`}
>
	{#if startIcon}
		<iconify-icon height="100%" width="auto" class="left-0 h-full" icon={startIcon}></iconify-icon>
	{/if}
	{@render children?.()}
</div>
