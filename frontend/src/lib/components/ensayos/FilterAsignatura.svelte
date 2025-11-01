<script lang="ts">
	import { onMount } from 'svelte';
	import Toggle from '../common/Toggle.svelte';

	let { selected = $bindable() }: { selected: number[] } = $props();
	let asignaturas: { id: number; nombre: string }[] = $state([]);

	onMount(async () => {
		const res = await fetch('http://localhost:8000/asignaturas', {
			credentials: 'include'
		});
		asignaturas = await res.json();
	});

	function toggleAsignatura(id: number) {
		if (selected.includes(id)) selected = [...selected.filter((s) => s !== id)];
		else selected = [...selected, id];
	}
</script>

<div class="flex flex-wrap gap-1">
	{#each asignaturas as a}
		<Toggle pressed={selected.includes(a.id)} onclick={() => toggleAsignatura(a.id)}>
			{a.nombre}
		</Toggle>
	{/each}
</div>
