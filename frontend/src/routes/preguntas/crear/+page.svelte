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

    interface Tematica {
        id: number;
        nombre: string;
    }

    interface Alternativa {
        texto: string;
        es_correcta: boolean;
    }

    let asignaturas: Asignatura[] = $state([]);
    let tematicas: Tematica[] = $state([]);
    let selectedAsignatura = $state('');
    let selectedTematica = $state('');
    let newTematica = $state('');
    let pregunta = $state('');
    let imagen = $state('');
    let alternativas: Alternativa[] = $state([
        { texto: '', es_correcta: false },
        { texto: '', es_correcta: false },
        { texto: '', es_correcta: false },
        { texto: '', es_correcta: false }
    ]);
    let loading = $state(false);
    let error = $state('');

    $effect(() => {
        loadAsignaturas();
    });

    $effect(() => {
        if (selectedAsignatura) {
            loadTematicas();
        } else {
            tematicas = [];
            selectedTematica = '';
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

    async function loadTematicas() {
        try {
            const response = await fetch(API.TEMATICAS(selectedAsignatura));
            if (!response.ok) throw new Error('Error al cargar tematicas');
            tematicas = await response.json();
        } catch (e) {
            error = e instanceof Error ? e.message : 'Error desconocido';
        }
    }

    function handleImageUpload(event: Event) {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0];
        
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imagen = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        }
    }

    function setCorrectAnswer(index: number) {
        alternativas = alternativas.map((alt, i) => ({
            ...alt,
            es_correcta: i === index
        }));
    }

    async function handleSubmit() {
        if (!selectedAsignatura || !pregunta || (!selectedTematica && !newTematica) || alternativas.some(alt => !alt.texto)) {
            error = 'Por favor complete todos los campos requeridos';
            return;
        }

        if (!alternativas.some(alt => alt.es_correcta)) {
            error = 'Por favor seleccione una respuesta correcta';
            return;
        }

        loading = true;
        error = '';

        try {
            const response = await fetch(API.GUARDAR_PREGUNTA, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_asignatura: parseInt(selectedAsignatura),
                    id_profesor: Usuario.value?.id,
                    id_tematica: selectedTematica ? parseInt(selectedTematica) : undefined,
                    topico: newTematica || undefined,
                    pregunta,
                    imagen,
                    respuestas: alternativas
                }),
            });

            if (!response.ok) throw new Error('Error al crear la pregunta');
            
            // Navigate back to the essays list
            goto('/editor-ensayos');
            
        } catch (e) {
            error = e instanceof Error ? e.message : 'Error desconocido';
        } finally {
            loading = false;
        }
    }
</script>

<PageMargin>
    <div class="flex flex-col gap-4 mb-4">
        <div class="flex items-center justify-between">
            <h1 class="text-2xl font-bold">Crear Nueva Pregunta</h1>
            <Button variant="outlined" href="/editor-ensayos">Volver</Button>
        </div>
    </div>

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
                <Form.Label>Temática</Form.Label>
                <div class="flex flex-col gap-4">
                    {#if selectedAsignatura}
                        <select
                            bind:value={selectedTematica}
                            class="border-input bg-background text-sm rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring w-full"
                            on:change={() => newTematica = ''}
                        >
                            <option value="">Seleccione una temática existente</option>
                            {#each tematicas as tematica}
                                <option value={tematica.id}>{tematica.nombre}</option>
                            {/each}
                        </select>

                        {#if !selectedTematica}
                            <div class="flex flex-col gap-2">
                                <span class="text-sm text-muted-foreground">O cree una nueva temática:</span>
                                <input
                                    type="text"
                                    bind:value={newTematica}
                                    class="border-input bg-background text-sm rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring w-full"
                                    placeholder="Ej: Números Reales, Literatura Contemporánea, etc."
                                />
                            </div>
                        {/if}
                    {:else}
                        <p class="text-sm text-muted-foreground">Seleccione una asignatura primero</p>
                    {/if}
                </div>
            </Form.Item>

            <Form.Item required>
                <Form.Label>Pregunta</Form.Label>
                <textarea
                    bind:value={pregunta}
                    class="border-input bg-background text-sm rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring w-full min-h-[100px]"
                    placeholder="Escriba la pregunta aquí..."
                />
            </Form.Item>

            <Form.Item>
                <Form.Label>Imagen (opcional)</Form.Label>
                <input
                    type="file"
                    accept="image/*"
                    on:change={handleImageUpload}
                    class="border-input bg-background text-sm rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring w-full"
                />
            </Form.Item>

            <Form.Item required>
                <Form.Label>Alternativas</Form.Label>
                <div class="flex flex-col gap-3">
                    {#each alternativas as alternativa, i}
                        <div class="flex gap-2 items-center">
                            <input
                                type="text"
                                bind:value={alternativa.texto}
                                placeholder={`Alternativa ${i + 1}`}
                                class="border-input bg-background text-sm rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring flex-1"
                            />
                            <Button
                                type="button"
                                variant={alternativa.es_correcta ? 'default' : 'outlined'}
                                size="sm"
                                onclick={() => setCorrectAnswer(i)}
                            >
                                {alternativa.es_correcta ? 'Correcta' : 'Marcar correcta'}
                            </Button>
                        </div>
                    {/each}
                </div>
            </Form.Item>

            <Form.Error {error} />

            <Form.Footer>
                <Form.Submit {loading}>
                    Crear Pregunta
                </Form.Submit>
            </Form.Footer>
        </Form.Root>
    </Card>
</PageMargin> 