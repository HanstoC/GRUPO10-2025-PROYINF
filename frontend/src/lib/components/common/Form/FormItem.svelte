<script lang="ts">
	import { setContext, type Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		children,
		label,
		required = false,
		class: _class,
		...props
	}: HTMLAttributes<HTMLDivElement> & {
		children: Snippet<[{ attrs: any }]>;
		required?: boolean;
		label: string;
	} = $props();
	let item: HTMLDivElement;

	setContext('form-item-required', required);
</script>

<div bind:this={item} class={`w-[inherit] ${_class}`} {...props}>
	<!-- svelte-ignore a11y_label_has_associated_control -->
	<label class={`relative mb-1 block w-fit font-medium`}>
		{label}
		<span class="text-destructive-foreground text-sm">
			{required ? '*' : ''}
		</span>
	</label>
	{@render children?.()}
</div>
