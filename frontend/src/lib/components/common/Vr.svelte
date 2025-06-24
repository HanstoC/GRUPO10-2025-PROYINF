<script lang="ts">
	import type { HTMLAttributes } from 'svelte';

	let { class: _class, ...props }: HTMLAttributes<HTMLDivElement> = $props();
</script>

<!-- svelte-ignore element_invalid_self_closing_tag -->
<div class={`bg-border h-full w-px ${_class}`} {...props} />
