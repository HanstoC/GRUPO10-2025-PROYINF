<script lang="ts">
	import { goto } from '$app/navigation';
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';

	const {
		children,
		goto: _goto = '',
		variant = 'classic',
		class: _class,
		...props
	}: HTMLAnchorAttributes & { goto?: string; variant?: 'classic' | 'alt' } = $props();
</script>

<a
	{...props}
	class={`${_class} ${variant}`}
	{..._goto
		? {
				href: _goto,
				onclick: (event) => {
					event.preventDefault();
					goto(_goto);
					return false;
				}
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
		}

		&.alt {
			background: #0000;
			border: 1px solid black;
			color: #000;
		}

		&.classic {
			&:hover {
				background: #222;
			}

			&:active {
				background: #444;
			}
		}
	}
</style>
