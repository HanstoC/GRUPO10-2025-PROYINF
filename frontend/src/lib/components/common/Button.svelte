<script lang="ts">
	import { goto } from '$app/navigation';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

	const {
		children,
		goto: _goto = '',
		...props
	}: HTMLAnchorAttributes & { goto?: string } = $props();
</script>

<a
	{...props}
	{..._goto
		? {
				href: _goto
			}
		: {}}
>
	{@render children?.()}
</a>

<style>
	:global(a) {
		padding: 0.5rem 1rem;
		background: #000;
		color: #fff;
		border-radius: var(--radius-lg);
		text-align: center;

		&:hover {
			cursor: pointer;
			background: #222;
		}

		&:active {
			background: #444;
		}
	}
</style>
