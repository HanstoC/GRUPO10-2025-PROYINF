<script lang="ts">
    import { API } from '$lib/global/api';
    import { Usuario } from '$lib/auth.svelte';
    import Button from '$lib/components/common/Button.svelte';
    import Form from '$lib/components/common/Form';
    import Card from '$lib/components/common/Card.svelte';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';

    interface Asignatura {
        id: number;
        nombre: string;
    }

    let asignaturas: Asignatura[] = $state([]);
    let asignaturaSeleccionada = $state('');
    let dificultad = $state('');
    let cantidadPreguntas = $state(0);
    let cargando = $state(true);
    let guardando = $state(false);
    let error = $state('');
    let totalPreguntas = $state<number | null>(null);

    const DIFICULTADES = ['Fácil', 'Medio', 'Difícil'];

    $effect(() => {
        cargarAsignaturas();
        cargarEnsayo();
    });

    $effect(() => {
        if (asignaturaSeleccionada) {
            cargarTotalPreguntas();
        } else {
            totalPreguntas = null;
            cantidadPreguntas = 0;
        }
    });

    async function cargarAsignaturas() {
        try {
            const respuesta = await fetch(API.ASIGNATURAS);
            if (!respuesta.ok) throw new Error('Error al cargar asignaturas');
            asignaturas = await respuesta.json();
        } catch (e) {
            error = e instanceof Error ? e.message : 'Error desconocido';
        }
    }

    async function cargarEnsayo() {
        try {
            const respuesta = await fetch(API.ENSAYOS_PROFESOR(Usuario.value?.id));
            if (!respuesta.ok) throw new Error('Error al cargar el ensayo');
            const ensayos = await respuesta.json();
            const ensayo = ensayos.find(e => e.id === parseInt($page.params.id));
            
            if (!ensayo) {
                error = 'Ensayo no encontrado';
                return;
            }

            asignaturaSeleccionada = ensayo.id_asignatura.toString();
            dificultad = ensayo.dificultad;
            cantidadPreguntas = ensayo.cantidad_preguntas;
        } catch (e) {
            error = e instanceof Error ? e.message : 'Error desconocido';
        } finally {
            cargando = false;
        }
    }

    async function cargarTotalPreguntas() {
        try {
            const respuesta = await fetch(API.PREGUNTAS_COUNT(asignaturaSeleccionada));
            if (!respuesta.ok) throw new Error('Error al cargar cantidad de preguntas');
            const datos = await respuesta.json();
            totalPreguntas = datos.total;
        } catch (e) {
            console.error('Error al cargar cantidad de preguntas:', e);
            totalPreguntas = null;
        }
    }

    async function manejarEnvio() {
        if (!asignaturaSeleccionada || !dificultad) {
            error = 'Por favor complete todos los campos';
            return;
        }

        if (cantidadPreguntas <= 0) {
            error = 'Por favor seleccione la cantidad de preguntas';
            return;
        }

        if (totalPreguntas !== null && cantidadPreguntas > totalPreguntas) {
            error = `La cantidad de preguntas no puede ser mayor a ${totalPreguntas}`;
            return;
        }

        guardando = true;
        error = '';

        try {
            const respuesta = await fetch(API.ACTUALIZAR_ENSAYO($page.params.id), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_asignatura: parseInt(asignaturaSeleccionada),
                    dificultad,
                    cantidad_preguntas: cantidadPreguntas
                }),
            });

            if (!respuesta.ok) throw new Error('Error al actualizar el ensayo');
            
            // Navegar de vuelta a la lista de ensayos
            goto('/editor-ensayos');
            
        } catch (e) {
            error = e instanceof Error ? e.message : 'Error desconocido';
        } finally {
            guardando = false;
        }
    }

    function manejarCambioCantidad(evento: Event) {
        const input = evento.target as HTMLInputElement;
        let valor = parseInt(input.value);
        
        // Asegurar que el valor esté entre 0 y el máximo de preguntas disponibles
        if (totalPreguntas !== null) {
            valor = Math.min(Math.max(0, valor), totalPreguntas);
        } else {
            valor = Math.max(0, valor);
        }
        
        cantidadPreguntas = valor;
    }
</script>

<div class="max-w-2xl mx-auto w-full px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between mb-4">
        <h1 class="text-2xl font-bold">Editar Ensayo</h1>
        <Button variant="outlined" href="/editor-ensayos">Volver</Button>
    </div>

    {#if cargando}
        <Card>
            <div class="flex justify-center">
                <div class="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
        </Card>
    {:else}
        <Card class="w-full">
            <Form.Root 
                class="flex flex-col gap-4"
                {error}
                onsubmit={manejarEnvio}
            >
                <Form.Item required>
                    <Form.Label>Asignatura</Form.Label>
                    <select
                        bind:value={asignaturaSeleccionada}
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

                {#if totalPreguntas !== null}
                    <Form.Item required>
                        <Form.Label>Cantidad de Preguntas</Form.Label>
                        <div class="flex items-center gap-2">
                            <input
                                type="number"
                                min="0"
                                max={totalPreguntas}
                                bind:value={cantidadPreguntas}
                                on:change={manejarCambioCantidad}
                                class="border-input bg-background text-sm rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring w-32"
                            />
                            <span class="text-sm text-muted-foreground">
                                de {totalPreguntas} {totalPreguntas === 1 ? 'pregunta disponible' : 'preguntas disponibles'}
                            </span>
                        </div>
                    </Form.Item>
                {/if}

                <Form.Error {error} />

                <Form.Footer>
                    <Form.Submit loading={guardando}>
                        Guardar Cambios
                    </Form.Submit>
                </Form.Footer>
            </Form.Root>
        </Card>
    {/if}
</div> 