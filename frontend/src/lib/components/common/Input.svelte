<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	let {
		value = $bindable(),
		format = 'none',
		class: className,
		...props
	}: HTMLInputAttributes & {
		format?: 'none' | 'rut';
	} = $props();

	let processFunc: () => any = {
		none: () => {
			value = value;
		},
		rut: () =>
			(value = (value as string)
				.replace(/[^0-9kK]/g, '')
				.slice(0, 9)
				.replace(/^(\d{1,3})(\d{3})(\d{3})([\dkK])$/, '$1.$2.$3-$4')
				.toUpperCase())
	}[format];
</script>

<input
	class={`border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
	placeholder={(props.placeholder ?? props.type === 'password')
		? '••••••••••••••••'
		: format === 'rut'
			? '12.345.678-9'
			: undefined}
	bind:value
	oninput={processFunc}
	onpaste={processFunc}
	{...props}
/>
