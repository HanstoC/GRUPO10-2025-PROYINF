<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import Input from './Input.svelte';
	import Button from './Button.svelte';
	import IconoirSearch from '$lib/icons/IconoirSearch.svelte';

	let { ...props }: HTMLAttributes<HTMLInputElement> = $props();
</script>

<div class="flex w-full flex-row">
	<Input {...props} class="w-full rounded-r-none" />
	<Button class="w-fit px-2 sm:px-4 rounded-l-none text-xs sm:text-sm" variant="outlined">
		<IconoirSearch class="mr-0 sm:mr-2 h-4 w-4" />
		<span class="hidden sm:inline">Buscar</span>
	</Button>
</div>
