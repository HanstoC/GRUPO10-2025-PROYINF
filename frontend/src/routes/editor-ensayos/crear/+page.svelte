<script lang="ts">
    import { API } from '$lib/global/api';
    import { Usuario } from '$lib/auth.svelte';
    import Button from '$lib/components/common/Button.svelte';
    import Form from '$lib/components/common/Form';
    import Card from '$lib/components/common/Card.svelte';
    import { goto } from '$app/navigation';
    import PageMargin from '$lib/components/common/PageMargin.svelte';

    interface Asignatura {
        id: number;
        nombre: string;
    }

    let asignaturas: Asignatura[] = $state([]);
    let selectedAsignatura = $state('');
    let dificultad = $state('');
    let cantidadPreguntas = $state(0);
    let loading = $state(false);
    let error = $state('');
    let preguntasCount = $state<number | null>(null);

    const DIFICULTADES = ['Fácil', 'Medio', 'Difícil'];

    $effect(() => {
        loadAsignaturas();
    });

    $effect(() => {
        if (selectedAsignatura) {
            loadPreguntasCount();
        } else {
            preguntasCount = null;
            cantidadPreguntas = 0;
        }
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

    async function loadPreguntasCount() {
        try {
            const response = await fetch(API.PREGUNTAS_COUNT(selectedAsignatura));
            if (!response.ok) throw new Error('Error al cargar cantidad de preguntas');
            const data = await response.json();
            preguntasCount = data.total;
            // Reset cantidad to 0 when changing subject
            cantidadPreguntas = 0;
        } catch (e) {
            console.error('Error al cargar cantidad de preguntas:', e);
            preguntasCount = null;
        }
    }

    async function handleSubmit() {
        if (!selectedAsignatura || !dificultad) {
            error = 'Por favor complete todos los campos';
            return;
        }

        if (cantidadPreguntas <= 0) {
            error = 'Por favor seleccione la cantidad de preguntas';
            return;
        }

        if (preguntasCount !== null && cantidadPreguntas > preguntasCount) {
            error = `La cantidad de preguntas no puede ser mayor a ${preguntasCount}`;
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
                    id_profesor: Usuario.value?.id,
                    cantidad_preguntas: cantidadPreguntas
                }),
            });

            if (!response.ok) throw new Error('Error al crear el ensayo');
            
            // Navigate back to the essays list
            goto('/editor-ensayos');
            
        } catch (e) {
            error = e instanceof Error ? e.message : 'Error desconocido';
        } finally {
            loading = false;
        }
    }

    function handleCantidadChange(event: Event) {
        const input = event.target as HTMLInputElement;
        let value = parseInt(input.value);
        
        // Ensure value is between 0 and max available questions
        if (preguntasCount !== null) {
            value = Math.min(Math.max(0, value), preguntasCount);
        } else {
            value = Math.max(0, value);
        }
        
        cantidadPreguntas = value;
    }
</script>

<PageMargin>
    <div class="flex items-center justify-between mb-4">
        <h1 class="text-2xl font-bold">Crear Nuevo Ensayo</h1>
        <Button variant="outlined" href="/editor-ensayos">Volver</Button>
    </div>

    <div class="max-w-2xl mx-auto w-full">
        <Card class="w-full">
            <Form.Root 
                class="flex flex-col gap-4"
                {error}
                onsubmit={handleSubmit}
            >
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

                {#if preguntasCount !== null}
                    <Form.Item required>
                        <Form.Label>Cantidad de Preguntas</Form.Label>
                        <div class="flex items-center gap-2">
                            <input
                                type="number"
                                min="0"
                                max={preguntasCount}
                                bind:value={cantidadPreguntas}
                                on:change={handleCantidadChange}
                                class="border-input bg-background text-sm rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring w-32"
                            />
                            <span class="text-sm text-muted-foreground">
                                de {preguntasCount} {preguntasCount === 1 ? 'pregunta disponible' : 'preguntas disponibles'}
                            </span>
                        </div>
                    </Form.Item>
                {/if}

                <Form.Error {error} />

                <Form.Footer>
                    <Form.Submit {loading}>
                        Crear Ensayo
                    </Form.Submit>
                </Form.Footer>
            </Form.Root>
        </Card>
    </div>
</PageMargin> 