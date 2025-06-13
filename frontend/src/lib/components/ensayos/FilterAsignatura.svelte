<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import Toggle from '../common/Toggle.svelte';
	import { ASIGNATURAS } from '$lib/classes/Database';
	import EnumHelper from '$lib/helpers/EnumHelper';

	let {
		selected = $bindable([]),
		class: _class,
		...props
	}: HTMLAttributes<HTMLDivElement> & {
		selected?: string[];
	} = $props();
</script>

<div class={`flex flex-row flex-wrap gap-1 ${_class}`} {...props}>
	{#each Object.entries(ASIGNATURAS) as [nombre, valor] (valor)}
		{@const bg = EnumHelper.colorsAsignatura(nombre)}
		{@const pressed = selected.includes(valor)}
		<Toggle
			size="sm"
			bind:pressed={
				() => pressed,
				(value: boolean) =>
					(selected = value
						? [...selected, valor]
						: (selected = selected.filter((s) => s !== valor)))
			}
			variant="outlined"
			style={pressed ? `background: ${bg};` : ''}>{nombre}</Toggle
		>
	{/each}
</div>
