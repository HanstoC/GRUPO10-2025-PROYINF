<script lang="ts">
	import type { Component, Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { tv } from 'tailwind-variants';

	const badgeTv = tv({
		base: 'inline-flex items-center gap-1.5 text-muted-foreground px-3 py-1 text-sm font-medium rounded-full cursor-default border',
		variants: {
			color: {
				default: 'bg-muted',
				success: 'bg-green-700 border-green-800 text-green-300',
				error: 'bg-destructive text-destructive-foreground border-destructive-foreground',
				primary: 'bg-primary text-primary-foreground border-primary-foreground',
				warning: 'bg-warning text-warning-foreground border-warning-foreground'
			}
		}
	});

	let {
		children,
		class: _class,
		color = 'default',
		title,
		startDecorator,
		...props
	}: Omit<HTMLAttributes<HTMLDivElement>, 'color'> & {
		color?: keyof typeof badgeTv.variants.color;
		startDecorator?: Component | string;
	} = $props();
</script>

<div class={`${badgeTv({ color, class: _class as string })}`} {title} {...props}>
	{#if startDecorator}
		<span class="flex-shrink-0">
			{#if typeof startDecorator === 'string'}
				{startDecorator}
			{:else}
				{@const StartDecorator = startDecorator}
				<StartDecorator class="[svg]:scale-150" />
			{/if}
		</span>
	{/if}
	<span class="truncate">
		{@render children?.()}
	</span>
</div>
