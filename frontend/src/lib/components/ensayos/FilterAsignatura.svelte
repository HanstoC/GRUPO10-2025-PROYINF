<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	export let selected: number[] = [];
	let asignaturas: { id: number; nombre: string }[] = [];

	onMount(async () => {
		const res = await fetch('http://localhost:8000/asignaturas', {
			credentials: 'include'
		});
		asignaturas = await res.json();
	});

	function toggleAsignatura(id: number) {
		if (selected.includes(id)) {
			selected = selected.filter(s => s !== id);
		} else {
			selected = [...selected, id];
		}
		selected = [...selected];
	}
</script>

<div class="flex flex-wrap gap-2">
	{#each asignaturas as a}
		<button
			class="px-2 py-1 rounded border"
			class:selected={selected.includes(a.id)}
			on:click={() => toggleAsignatura(a.id)}
		>
			{a.nombre}
		</button>
	{/each}
</div>

<style>
	button.selected {
		background-color: #3b82f6;
		color: white;
		border-color: #3b82f6;
	}
</style>
