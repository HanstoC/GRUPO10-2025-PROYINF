<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	let {
		value = $bindable(),
		title,
		format = 'none',
		...props
	}: HTMLInputAttributes & {
		format?: 'none' | 'rut';
	} = $props();

	interface ProcessFuncInput {
		value: string;
		display: string;
	}

	const process = (node: HTMLInputElement, processFunc: (input: ProcessFuncInput) => void) => {
		let input: ProcessFuncInput = {
			value: node.value,
			display: node.value
		};

		const updateValue = () => {
			input.value = node.value;
			processFunc(input);
			node.value = input.display;
		};

		node.addEventListener('input', updateValue);
		node.addEventListener('paste', updateValue);
		updateValue();

		return {
			destroy() {
				node.removeEventListener('input', updateValue);
				node.removeEventListener('paste', updateValue);
			}
		};
	};
</script>

<div class="input-container w-full">
	{#if title}
		<h4>{title}</h4>
	{/if}
	<input
		use:process={{
			none: (v: ProcessFuncInput) => void 0,
			rut: (v: ProcessFuncInput) => {
				v.value = (v.value.replace(/[^\d]/g, '') ?? '').slice(0, 9);
				v.display =
					v.value
						.match(/(\d{1,2})?(\d{1,3})?(\d{1,3})?(\d)?/)
						?.slice(1)
						.filter((s) => s)
						.map(
							(s, i, arr) =>
								(i > 0 ? (arr.length === 4 && i === arr.length - 1 ? '-' : '.') : '') + s
						)
						.join('') ?? '';
			}
		}[format]}
		class="w-full"
		bind:value
		{...props}
	/>
</div>

<style>
	.input-container {
		transition: all 50ms ease-out;

		&:focus-within {
			scale: 1.05;
		}

		input {
			border: 1px solid black;
			padding: var(--radius-md) var(--radius-xl);
			border-radius: var(--radius-lg);
		}
	}
</style>
