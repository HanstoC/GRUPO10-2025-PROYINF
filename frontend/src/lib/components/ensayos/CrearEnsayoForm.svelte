<script lang="ts">
    import { API } from '$lib/global/api';
    import { Usuario } from '$lib/auth.svelte';
    import Button from '../common/Button.svelte';
    import Form from '../common/Form';
    import Card from '../common/Card.svelte';
    import { createEventDispatcher } from 'svelte';

    interface Asignatura {
        id: number;
        nombre: string;
    }

    let asignaturas: Asignatura[] = $state([]);
    let selectedAsignatura = $state('');
    let dificultad = $state('');
    let loading = $state(false);
    let error = $state('');

    const DIFICULTADES = ['Fácil', 'Medio', 'Difícil'];
    const dispatch = createEventDispatcher();

    $effect(() => {
        loadAsignaturas();
    });

    async function loadAsignaturas() {
        try {
            const response = await fetch(API.ASIGNATURAS);
            if (!response.ok) throw new Error('Error al cargar asignaturas');
            asignaturas = await response.json();
        } catch (e) {
            error = e instanceof Error ? e.message : 'Error desconocido';
        }
    }

    async function handleSubmit() {
        if (!selectedAsignatura || !dificultad) {
            error = 'Por favor complete todos los campos';
            return;
        }

        loading = true;
        error = '';

        try {
            const response = await fetch(API.CREAR_ENSAYO, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_asignatura: parseInt(selectedAsignatura),
                    dificultad,
                    id_profesor: Usuario.value?.id
                }),
            });

            if (!response.ok) throw new Error('Error al crear el ensayo');
            
            // Dispatch a custom event to notify parent component
            dispatch('ensayoCreado');
            
            // Reset form
            selectedAsignatura = '';
            dificultad = '';
        } catch (e) {
            error = e instanceof Error ? e.message : 'Error desconocido';
        } finally {
            loading = false;
        }
    }
</script>

<Card class="w-full">
    <Form.Root 
        class="flex flex-col gap-4"
        {error}
        onsubmit={handleSubmit}
    >
        <h2 class="text-xl font-bold">Crear Nuevo Ensayo</h2>
        
        <Form.Item required>
            <Form.Label>Asignatura</Form.Label>
            <select
                bind:value={selectedAsignatura}
                class="border-input bg-background text-sm rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring w-full"
            >
                <option value="">Seleccione una asignatura</option>
                {#each asignaturas as asignatura}
                    <option value={asignatura.id}>{asignatura.nombre}</option>
                {/each}
            </select>
        </Form.Item>

        <Form.Item required>
            <Form.Label>Dificultad</Form.Label>
            <div class="flex gap-2">
                {#each DIFICULTADES as nivel}
                    <Button
                        type="button"
                        variant={dificultad === nivel ? 'default' : 'outlined'}
                        onclick={() => dificultad = nivel}
                    >
                        {nivel}
                    </Button>
                {/each}
            </div>
        </Form.Item>

        <Form.Error {error} />

        <Form.Footer>
            <Form.Submit {loading}>
                Crear Ensayo
            </Form.Submit>
        </Form.Footer>
    </Form.Root>
</Card> 