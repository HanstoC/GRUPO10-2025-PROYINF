<script lang="ts">
	import { goto } from '$app/navigation';
	import { tv } from 'tailwind-variants';
	import LoadingIndicator from './utils/LoadingIndicator.svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	const BUTTONS_VARIANTS = {
		base: 'cursor-pointer focus-visible:ring-ring inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors select-none focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50',
		variants: {
			variant: {
				default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow',
				destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm',
				outlined:
					'border-input bg-background hover:bg-accent hover:text-accent-foreground border shadow-sm',
				secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm',
				ghost: 'hover:bg-secondary hover:text-secondary-foreground',
				link: 'text-foreground/70 hover:text-accent-foreground hover:underline'
			},
			size: {
				default: 'h-9 px-4 py-2',
				sm: 'h-8 rounded-md px-3 text-xs',
				lg: 'h-10 rounded-md px-8',
				icon: 'h-9 w-9 p-1'
			},
			loading: {
				false: '',
				true: 'grayscale brightness-125 text-muted-foreground'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
			loading: false
		}
	} as const;

	const buttonVariants = tv(BUTTONS_VARIANTS);
	const {
		children,
		goto: _goto = '',
		variant = 'default',
		size = 'default',
		loading = false,
		class: _class,
		disabled = false,
		...props
	}: HTMLAnchorAttributes & {
		goto?: string;
		variant?: keyof typeof BUTTONS_VARIANTS.variants.variant;
		size?: keyof typeof BUTTONS_VARIANTS.variants.size;
		loading?: boolean;
		class?: string;
		disabled?: boolean;
	} = $props();
</script>

<a
	{...props}
	class={`${buttonVariants({ variant, size, loading, class: _class as string })}`}
	{..._goto
		? {
				href: _goto,
				onclick: (event) => {
					event.preventDefault();
					goto(_goto);
					return false;
				}
			}
		: {}}
>
	{#if loading}
		<LoadingIndicator />
	{:else}
		{@render children?.()}
	{/if}
</a>
