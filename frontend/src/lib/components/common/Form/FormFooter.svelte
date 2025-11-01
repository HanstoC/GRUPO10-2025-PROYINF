<script lang="ts">
	import { getContext } from 'svelte';
	import { slide } from 'svelte/transition';

	let { children } = $props();
	let error: string = $derived((getContext('form-error') as () => string)());
	$effect(() => {
		if (error.length) console.error(error);
	});
</script>

<div class="mt-1 w-full">
	{#key error}
		<div transition:slide class="text-destructive-foreground mb-2 w-full text-center text-sm">
			{error.replace(/\.$/g, '') + ((error?.length ?? 0) ? '.' : '')}
		</div>
	{/key}
	<div class="flex flex-col gap-2">
		{@render children?.()}
	</div>
</div>
