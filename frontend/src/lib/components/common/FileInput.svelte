<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import Button from './Button.svelte';
	import IconoirSubmitDocument from '$lib/icons/IconoirSubmitDocument.svelte';

	let input: HTMLInputElement;
	let text = $state('');
	let { value = $bindable(), ...props }: HTMLInputAttributes & { value?: FileList | null } =
		$props();

	$effect(() => {
		(async () => {
			let files = [];
			for (let i = 0; i < (value?.length ?? 0); i++) files.push(value!.item(i)!);
			text = files.map((f) => f.name).join(', ');
		})();
	});
</script>

<div class="flex w-full flex-row">
	<input bind:this={input} hidden accept="image/png, image/jpeg" type="file" bind:files={value} />
	<Button class="flex-1 rounded-r-none!" onclick={() => input.click()}
		><IconoirSubmitDocument class="mr-2" /> Subir archivo</Button
	>
	<div
		class="border-input flex w-full flex-1/3 items-center justify-center rounded-r-md border text-center text-sm italic"
	>
		<p class="opacity-50">{text || 'Empieza por subir un archivo...'}</p>
	</div>
</div>
