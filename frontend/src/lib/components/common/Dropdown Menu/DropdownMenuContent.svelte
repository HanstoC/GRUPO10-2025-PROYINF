<script lang="ts">
	import { DropdownMenu as DropdownMenuPrimitive } from 'bits-ui';
	import { expoOut as defaultEasing } from 'svelte/easing';
	import { lerp } from '../../../../utils/Utils.svelte';

	let { class: _class, children, ...props }: DropdownMenuPrimitive.ContentProps = $props();
	function whoosh(
		node: HTMLElement,
		params?: { delay?: number; duration?: number; easing?: (t: number) => number }
	) {
		const existingTransform = getComputedStyle(node).transform.replace('none', '');

		return {
			delay: params?.delay || 0,
			duration: params?.duration || 200,
			easing: params?.easing || defaultEasing,
			css: (t: number, u: number) =>
				`transform: ${existingTransform} scale(${lerp(0.75, 1, t)}); opacity: ${t};`
		};
	}
</script>

<DropdownMenuPrimitive.Content
	forceMount
	sideOffset={4}
	class={`bg-popover text-popover-foreground z-50 min-w-[8rem] rounded-md border p-1 shadow-md focus:outline-none ${_class}`}
	{...props}
>
	{#snippet child({ wrapperProps, props, open })}
		{#if open}
			<div {...wrapperProps}>
				<div {...props} transition:whoosh>
					{@render children?.()}
				</div>
			</div>
		{/if}
	{/snippet}
</DropdownMenuPrimitive.Content>
