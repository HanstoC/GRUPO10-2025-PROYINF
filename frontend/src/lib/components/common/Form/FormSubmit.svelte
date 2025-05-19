<script lang="ts">
	import Button from '../Button.svelte';

	let input: HTMLInputElement;
	let { children, ...props } = $props();
</script>

<input hidden type="submit" bind:this={input} />
<Button
	onclick={(ev) => {
		ev.preventDefault();
		input?.click();
	}}
	{...props}
>
	{@render children?.()}
</Button>
