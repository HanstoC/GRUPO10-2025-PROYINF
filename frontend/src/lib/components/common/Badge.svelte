<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { fade } from 'svelte/transition';

	let {
		children,
		class: _class,
		color = 'default',
		content,
		show = true,
		title,
		...props
	}: Omit<HTMLAttributes<HTMLDivElement>, 'color'> & {
		color?: 'default' | 'warning';
		content?: Snippet | string;
		show?: boolean;
	} = $props();
</script>

<div class={`${_class}`} {...props}>
	{#if content && show}
		<div
			transition:fade={{ duration: 100 }}
			class="absolute top-0 right-0 -m-2 scale-125 select-none"
			{title}
		>
			{#if typeof content === 'string'}
				{content}
			{:else}
				{@render content?.()}
			{/if}
		</div>
	{/if}
	{@render children?.()}
</div>
