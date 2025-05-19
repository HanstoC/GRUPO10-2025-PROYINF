<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import Input from './Input.svelte';
	import Button from './Button.svelte';
	import IconoirSearch from '$lib/icons/IconoirSearch.svelte';

	let { ...props }: HTMLAttributes<HTMLInputElement> = $props();
</script>

<div class="flex w-full flex-row">
	<Input {...props} class="w-full rounded-r-none" />
	<Button class="w-fit rounded-l-none" variant="outlined"
		><IconoirSearch class="mr-2" /> Buscar</Button
	>
</div>
