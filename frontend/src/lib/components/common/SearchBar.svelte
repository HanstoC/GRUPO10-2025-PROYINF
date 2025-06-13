<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import Input from './Input.svelte';
	import Button from './Button.svelte';
	import IconoirSearch from '$lib/icons/IconoirSearch.svelte';

	let {
		value = $bindable(),
		onpress,
		...props
	}: HTMLAttributes<HTMLInputElement> & { value?: string; onpress?: () => any } = $props();
</script>

<div class="flex w-full flex-row">
	<Input bind:value {...props} class="w-full rounded-r-none" />
	<Button onclick={onpress} class="w-fit rounded-l-none" variant="outlined"
		><IconoirSearch class="mr-2" /> Buscar</Button
	>
</div>
