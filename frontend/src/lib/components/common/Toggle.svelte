<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { tv } from 'tailwind-variants';

	const toggleVariants = tv({
		base: 'focus-visible:ring-ring inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 hover:cursor-pointer',
		variants: {
			variant: {
				default: 'bg-accent text-accent-foreground hover:text-muted-foreground',
				outlined:
					'border-input hover:bg-accent hover:text-accent-foreground border bg-transparent shadow-sm'
			},
			size: {
				default: 'h-9 px-3',
				sm: 'h-8 px-2',
				lg: 'h-10 px-3'
			},
			pressed: {
				false: '',
				true: 'bg-primary text-primary-foreground hover:bg-primary/50'
			}
		},
		defaultVariants: {
			variant: 'default',
			size: 'default'
		}
	});
	let {
		pressed = $bindable(),
		class: _class,
		variant = 'default',
		size = 'default',
		children,
		...props
	}: HTMLButtonAttributes & {
		pressed?: boolean;
		variant?: keyof typeof toggleVariants.variants.variant;
		size?: keyof typeof toggleVariants.variants.size;
	} = $props();
</script>

<!-- svelte-ignore slot_element_deprecated -->
<toggle class={`${toggleVariants({ variant, size, pressed })} ${_class}`} {...props}>
	<slot />
</toggle>
