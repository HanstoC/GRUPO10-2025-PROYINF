<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { tv } from 'tailwind-variants';

	const cardVariants = tv({
		base: 'rounded-xl border shadow',
		variants: {
			size: {
				sm: 'p-2',
				default: 'p-4',
				lg: 'p-8'
			},
			variant: {
				outlined: 'bg-none text-foreground border-1',
				default: 'bg-card text-card-foreground'
			}
		},
		defaultVariants: {
			size: 'default',
			variant: 'default'
		}
	} as const);

	let {
		children,
		size = 'default',
		variant = 'default',
		startIcon = undefined,
		class: _class,
		...props
	}: HTMLAttributes<HTMLDivElement> & {
		size?: keyof typeof cardVariants.variants.size;
		variant?: keyof typeof cardVariants.variants.variant;
		startIcon?: string;
	} = $props();
</script>

<div {...props} class={`${cardVariants({ variant, size })} ${_class}`}>
	{#if startIcon}
		<iconify-icon height="100%" width="auto" class="left-0 h-full" icon={startIcon}></iconify-icon>
	{/if}
	{@render children?.()}
</div>
