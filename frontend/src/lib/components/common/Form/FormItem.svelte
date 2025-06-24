<script lang="ts">
	import { setContext, type Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte';
	import Badge from '../Badge.svelte';

	let {
		children,
		label,
		required = false,
		modified = false,
		class: _class,
		...props
	}: HTMLAttributes<HTMLDivElement> & {
		children: Snippet<[{ attrs: any }]>;
		required?: boolean;
		label: string;
		modified?: boolean;
	} = $props();
	let item: HTMLDivElement;

	setContext('form-item-required', required);
</script>

{#snippet content()}
	<span class="text-warning-foreground font-extrabold">●</span>
{/snippet}

<div bind:this={item} class={`w-[inherit] ${_class}`} {...props}>
	<!-- svelte-ignore a11y_label_has_associated_control -->
	<label class={`relative block w-fit font-medium`}>
		<Badge title="Modificado" {content} show={modified}>
			{label}
			<span class="text-destructive-foreground text-sm">
				{required ? '*' : ''}
			</span>
		</Badge>
	</label>
	{@render children?.()}
</div>
