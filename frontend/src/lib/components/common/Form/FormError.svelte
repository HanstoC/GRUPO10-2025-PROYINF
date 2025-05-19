<script lang="ts">
	import { fly } from 'svelte/transition';

	let { error } = $props();
</script>

<div class="relative h-1">
	{#key error}
		<p
			in:fly={{ y: 10 }}
			out:fly={{ y: 10 }}
			class="text-destructive-foreground absolute -top-2 w-full text-center text-sm"
		>
			{error}
		</p>
	{/key}
</div>
