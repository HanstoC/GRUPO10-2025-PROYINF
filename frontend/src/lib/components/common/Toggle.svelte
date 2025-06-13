<script lang="ts">
	import { Toggle as TogglePrimitive } from 'bits-ui';
	import { tv } from 'tailwind-variants';

	const toggleVariants = tv({
		base: 'hover:bg-muted hover:text-muted-foreground focus-visible:ring-ring data-[state=on]:bg-accent data-[state=on]:text-accent-foreground inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 hover:cursor-pointer',
		variants: {
			variant: {
				default: 'bg-transparent',
				outlined:
					'border-input hover:bg-accent hover:text-accent-foreground border bg-transparent shadow-sm'
			},
			size: {
				default: 'h-9 px-3',
				sm: 'h-8 px-2',
				lg: 'h-10 px-3'
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
	}: TogglePrimitive.RootProps & {
		variant?: keyof typeof toggleVariants.variants.variant;
		size?: keyof typeof toggleVariants.variants.size;
	} = $props();
</script>

<!-- svelte-ignore slot_element_deprecated -->
<TogglePrimitive.Root
	bind:pressed
	class={`${toggleVariants({ variant, size })} ${_class}`}
	{...props}
>
	<slot />
</TogglePrimitive.Root>
