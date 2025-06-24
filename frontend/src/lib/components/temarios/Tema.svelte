<script lang="ts">
	import type { HTMLAttributes } from 'svelte';

	let { children, tema, ...props }: HTMLAttributes<HTMLDivElement> & { tema: string } = $props();
</script>

<div class="w-full">
	<h3 class="font-medium uppercase">
		{tema.replace(/(?:\:|\.)$/g, '')}
	</h3>
	<div class="ml-4">
		{@render children?.()}
	</div>
</div>
