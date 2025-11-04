<script lang="ts">
	import MaterialSymbolsCheck from '$lib/icons/MaterialSymbolsCheck.svelte';
	import MaterialSymbolsCheckCircleOutline from '$lib/icons/MaterialSymbolsCheckCircleOutline.svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { tv } from 'tailwind-variants';

	const toggleVariants = tv({
		base: 'focus-visible:ring-ring inline-flex items-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50 hover:cursor-pointer',
		variants: {
			variant: {
				default: 'border border-input text-muted-foreground hover:bg-muted/50'
			},
			size: {
				default: 'h-8 px-2'
			},
			pressed: {
				false: '',
				true: 'border-accent bg-accent/10 text-accent-foreground hover:bg-accent/20'
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

	// Clases base para la caja de verificación
	const checkboxBaseClasses =
		'aspect-square h-4 border-2 rounded-sm mr-2 flex items-center justify-center transition-all duration-150';

	// Clases dinámicas para la casilla y el checkmark
	const checkboxClasses = $derived(
		pressed
			? // Estado Activo (Naranja)
				`border-accent bg-accent text-white ${checkboxBaseClasses}`
			: // Estado Inactivo (Gris)
				`border-muted-foreground bg-transparent text-transparent ${checkboxBaseClasses}`
	);
</script>

<!-- Se usa un <button> estándar para la funcionalidad -->
<button
	class={`${toggleVariants({ variant, size, pressed })} ${_class}`}
	onclick={() => (pressed = !pressed)}
	aria-pressed={pressed}
	{...props}
>
	<div class={checkboxClasses}>
		{#if pressed}
			<MaterialSymbolsCheck class="scale-150" />
		{/if}
	</div>

	{@render children?.()}
</button>
