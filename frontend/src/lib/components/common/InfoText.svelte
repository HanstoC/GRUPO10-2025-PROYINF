<script lang="ts">
	import MaterialSymbolsErrorOutline from '$lib/icons/MaterialSymbolsErrorOutline.svelte';
	import MaterialSymbolsInfoOutline from '$lib/icons/MaterialSymbolsInfoOutline.svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { tv } from 'tailwind-variants';

	const tvInfoText = tv({
		base: 'w-full text-center text-sm flex flex-col justify-center items-center [&>svg]:scale-200 [&>svg]:mb-2 text-muted-foreground',
		variants: {
			variant: {
				default: '[&>.error]:hidden',
				error: '[&>.info]:hidden text-destructive-foreground'
			}
		},
		defaultVariants: {
			variant: 'default'
		}
	});

	const {
		children,
		class: _class,
		variant
	}: HTMLAttributes<HTMLParagraphElement> & {
		variant: keyof typeof tvInfoText.variants.variant;
	} = $props();
</script>

<div class={tvInfoText({ class: _class as string, variant })}>
	<MaterialSymbolsInfoOutline class="info" />
	<MaterialSymbolsErrorOutline class="error" />
	{@render children?.()}
</div>
