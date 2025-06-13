<script lang="ts">
	import Animations from '$lib/helpers/Animations';
	import { getContext } from 'svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';

	let {
		value = $bindable(),
		format = 'none',
		class: className,
		...props
	}: HTMLInputAttributes & {
		format?: 'none' | 'rut';
	} = $props();

	const processFunc: () => any = {
		none: () => {
			value = value;
		},
		rut: () => {
			value = (value as string)
				.replace(/[^0-9kK]/g, '')
				.slice(0, 9)
				.replace(/^(\d{1,2})(\d{3})(\d{3})([\dkK])$/, '$1.$2.$3-$4')
				.toUpperCase();
			if (value.length)
				input.setCustomValidity(
					value.match(/^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/) ? '' : 'El rut es inválido'
				);
		}
	}[format];

	let last = '';
	const onUpdate = () => {
		invalid = false;
		input.setCustomValidity('');
		processFunc();
		if (format === 'none') return;
		if (last === value) Animations.shake(input).play();
		last = value;
	};

	const required: boolean = getContext('form-item-required');
	let invalid = $state(false);
	let input: HTMLInputElement;
</script>

<input
	{required}
	bind:this={input}
	maxlength={(props.maxlength ?? props.type === 'password') ? 128 : undefined}
	title=""
	class={`border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 ${invalid ? 'border-destructive-foreground!' : ''} ${className}`}
	placeholder={(props.placeholder ?? props.type === 'password')
		? '••••••••••••••••'
		: format === 'rut'
			? '12.345.678-9'
			: undefined}
	bind:value
	oninvalid={(ev) => {
		ev.preventDefault();
		input.setCustomValidity(
			input.validationMessage.replace(
				/\brellena este campo\b/gi,
				'Rellena todos los campos obligatorios'
			)
		);
		invalid = true;
	}}
	oninput={onUpdate}
	onpaste={onUpdate}
	{...props}
/>
