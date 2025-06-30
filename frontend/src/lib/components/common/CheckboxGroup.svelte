<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    // Propiedades que el componente recibirá
    export let options: { value: string; count: number }[] = [];
    export let selected: string[] = []; // Array de valores seleccionados

    const dispatch = createEventDispatcher();

    function handleChange(event: Event) {
        const target = event.target as HTMLInputElement;
        const value = target.value;

        let newSelection = [...selected];
        if (target.checked) {
            newSelection.push(value);
        } else {
            newSelection = newSelection.filter(item => item !== value);
        }
        selected = newSelection; // Actualiza la prop reactiva
        dispatch('change', newSelection); // Emite el evento con la nueva selección
    }
</script>

<div class="space-y-1">
    {#each options as option}
        <label class="flex items-center text-sm text-gray-700">
            <input
                type="checkbox"
                class="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out mr-2"
                value={option.value}
                onchange={handleChange}
                checked={selected.includes(option.value)}
            />
            {option.value} ({option.count})
        </label>
    {/each}
</div>