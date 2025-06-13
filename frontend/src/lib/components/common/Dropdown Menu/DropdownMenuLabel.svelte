<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';

	let {
		class: className,
		inset,
		children,
		...props
	}: DropdownMenuPrimitive.LabelProps & {
		inset?: boolean;
	} = $props();
</script>

<DropdownMenuPrimitive.Label
	class={`px-2 py-1.5 text-sm font-semibold ${inset ? 'pl-8' : ''} ${className}`}
	{...props}
>
	{@render children?.()}
</DropdownMenuPrimitive.Label>
