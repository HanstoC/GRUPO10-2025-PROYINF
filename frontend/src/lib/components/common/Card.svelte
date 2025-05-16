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
		size?: 'md' | 'lg';
		variant?: 'default' | 'outlined';
		startIcon?: string;
	} = $props();
</script>

<div {...props} class={`card ${_class} ${size} ${variant}`}>
	{#if startIcon}
		<iconify-icon height="100%" width="auto" class="left-0 h-full" icon={startIcon}></iconify-icon>
	{/if}
	{@render children?.()}
</div>

<style>
	.card {
		border-radius: var(--radius-xl);
		padding: var(--radius-xl);
		background: #000;
		margin: var(--radius-sm);
		color: #fff;

		&.outlined {
			background: unset;
			border: 1px solid #fff8;
		}

		&.lg {
			padding: var(--radius-3xl);
		}
	}
</style>
