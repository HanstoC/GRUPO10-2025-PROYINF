<script lang="ts">
	import _ from 'lodash';
	import { setContext } from 'svelte';
	import { type HTMLAttributes } from 'svelte/elements';

	let {
		children,
		error = $bindable(''),
		onsubmit: _onsubmit,
		class: _class,
		...props
	}: HTMLAttributes<HTMLFormElement> & {
		error?: string;
	} = $props();

	let errors: { [key: string]: any } = $state({});
	const processForm = (element: HTMLFormElement) => {
		const broadcast = () => {
			error = _.uniq(_.values(errors)).join('. ');
			errors = {};
		};

		const inputs = element.querySelectorAll('input');
		let broadcastTimeout: number;
		inputs.forEach((el, i) => {
			el.addEventListener('invalid', () => {
				errors[i] = el.validationMessage;
				clearTimeout(broadcastTimeout);
				broadcastTimeout = setTimeout(broadcast, 100);
			});
		});

		return {
			destroy() {
				clearTimeout(broadcastTimeout);
			}
		};
	};

	setContext('form-error', () => error);
</script>

<form
	onsubmit={(ev) => {
		error = '';
		_onsubmit?.(ev);
	}}
	oninput={() => (error = '')}
	class={`items-center justify-center ${_class}`}
	use:processForm
	{...props}
>
	{@render children?.()}
</form>
