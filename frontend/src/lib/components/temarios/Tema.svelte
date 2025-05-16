<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	let { children, tema, ...props }: HTMLAttributes<HTMLDivElement> & { tema: string } = $props();
</script>

<div class="w-full">
	<h3 class="uppercase">
		{tema.replace(/(?:\:|\.)$/g, '')}
	</h3>
	<div class="ml-10">
		{@render children?.()}
	</div>
</div>
