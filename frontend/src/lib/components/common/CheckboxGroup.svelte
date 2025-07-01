<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	let {
		options = [],
		selected = []
	}: { options: { value: string; count: number }[]; selected: string[] } = $props();

	const dispatch = createEventDispatcher();
	function handleChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const value = target.value;

		let newSelection = [...selected];
		if (target.checked) {
			newSelection.push(value);
		} else {
			newSelection = newSelection.filter((item) => item !== value);
		}
		dispatch('change', newSelection);
	}
</script>

<div class="space-y-1">
	{#each options as option}
		<label class="flex items-center text-sm text-gray-700">
			<input
				type="checkbox"
				class="form-checkbox mr-2 h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
				value={option.value}
				onchange={handleChange}
				checked={selected.includes(option.value)}
			/>
			{option.value} ({option.count})
		</label>
	{/each}
</div>
