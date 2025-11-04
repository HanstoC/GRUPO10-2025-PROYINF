<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';
	import { tv } from 'tailwind-variants';

	let itemVariant = tv({
		base: 'relative flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
		variants: {
			variant: {
				default: 'data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground',
				destructive:
					'text-destructive data-[highlighted]:bg-destructive data-[highlighted]:text-destructive-foreground'
			}
		}
	} as const);

	let {
		class: className,
		children,
		inset,
		variant = 'default',
		...props
	}: DropdownMenuPrimitive.ItemProps & {
		inset?: boolean;
		variant?: keyof typeof itemVariant.variants.variant;
	} = $props();
</script>

<DropdownMenuPrimitive.Item
	class={`${itemVariant({ variant })} ${inset ? 'pl-8' : ''} ${className}`}
	{...props}
>
	{@render children?.()}
</DropdownMenuPrimitive.Item>
