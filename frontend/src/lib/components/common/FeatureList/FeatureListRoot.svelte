<script lang="ts">
	import type { HTMLAttributes } from 'svelte';

	let { children, ...props }: HTMLAttributes<HTMLUListElement> = $props();
</script>

<ul {...props}>
	{@render children?.()}
</ul>
