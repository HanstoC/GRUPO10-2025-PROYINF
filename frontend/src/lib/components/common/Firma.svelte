<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { tv } from 'tailwind-variants';

	const firmaTv = tv({
		base: 'text-muted-foreground flex items-center justify-center text-sm'
	});

	const { class: _class, ...props }: HTMLAttributes<HTMLDivElement> = $props();
</script>

<div class={firmaTv({ class: _class as string })}>Copyright INGSOFT-2025©</div>
