<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	let { value = $bindable(), title, ...props }: HTMLInputAttributes = $props();
</script>

<div class="input-container w-full">
	{#if title}
		<h4>{title}</h4>
	{/if}
	<input class="w-full" bind:value {...props} />
</div>

<style>
	.input-container {
		transition: all 50ms ease-out;

		&:focus-within {
			scale: 1.05;
		}

		input {
			border: 1px solid black;
			padding: var(--radius-md) var(--radius-xl);
			border-radius: var(--radius-lg);
		}
	}
</style>
