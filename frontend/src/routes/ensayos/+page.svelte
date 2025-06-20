<script lang="ts">
  import { onMount } from 'svelte';
  import Card from '$lib/components/common/Card.svelte';
  import PageMargin from '$lib/components/common/PageMargin.svelte';
  import FilterAsignatura from '$lib/components/ensayos/FilterAsignatura.svelte';
  import IconoirEmojiSad from '$lib/icons/IconoirEmojiSad.svelte';
  import LoadingIndicator from '$lib/components/common/utils/LoadingIndicator.svelte';
  import Form from '$lib/components/common/Form';
  import { RolUsuario, Usuario } from '$lib/auth.svelte';
  import Button from '$lib/components/common/Button.svelte';
  import MaterialSymbolsSelectAll from '$lib/icons/MaterialSymbolsSelectAll.svelte';
  import MaterialSymbolsDelete from '$lib/icons/MaterialSymbolsDelete.svelte';

  let selectedAsignaturas: number[] = [];
  let ensayos = [];
  let loading = false;

  let ensayoExpandido: number | null = null;
  let preguntas: { pregunta: string; respuesta: string; correcta: boolean }[] = [];
  let cargandoPreguntas = false;

  // Derivar query de selección
  $: query = selectedAsignaturas.length > 0
    ? '?' + selectedAsignaturas.map(a => `asignatura=${a}`).join('&')
    : '';

  // Ejecutar carga solo si cambia query
  $: if (query !== undefined) {
    loadEnsayos(query);
  }

  async function loadEnsayos(q: string) {
    loading = true;
    try {
      const res = await fetch(`http://localhost:8000/ensayos${q}`, {
        credentials: 'include'
      });
      ensayos = await res.json();
    } catch (err) {
      console.error('Error cargando ensayos:', err);
    } finally {
      loading = false;
    }
  }

  async function verPreguntas(id: number) {
    ensayoExpandido = ensayoExpandido === id ? null : id;
    if (ensayoExpandido !== null) {
      cargandoPreguntas = true;
      try {
        const res = await fetch(`http://localhost:8000/ensayos/${id}/preguntas`, {
          credentials: 'include'
        });
        preguntas = await res.json();
      } catch (err) {
        console.error('Error cargando preguntas:', err);
      } finally {
        cargandoPreguntas = false;
      }
    }
  }
  	function rendirEnsayo(id: number) {
	}
</script>

<PageMargin>
  {#if Usuario.value?.rol === RolUsuario.Profesor}
    <Card size="sm" class="flex w-full flex-row items-center justify-between gap-2">
      <div class="flex flex-row items-center gap-2">
        <Button size="sm" goto="/editor-ensayos">Crear ensayo</Button>
        <Button size="sm" goto="/editor-preguntas">Crear pregunta</Button>
      </div>
      <div class="flex flex-row items-center gap-2">
        <p class="text-xs italic opacity-50">{selectedAsignaturas.length} elementos seleccionados</p>
        <Button size="icon" variant="secondary"><MaterialSymbolsSelectAll /></Button>
        <Button disabled size="icon" variant="destructive"><MaterialSymbolsDelete /></Button>
      </div>
    </Card>
  {/if}

  <Card class="w-full">
    <Form.Root class="w-fit">
      <Form.Item label="Filtrar por Asignaturas">
        <FilterAsignatura bind:selected={selectedAsignaturas} />
      </Form.Item>
    </Form.Root>
  </Card>

  <Card variant="outlined" size="lg" class="flex h-full w-full items-center justify-center">
    {#if loading}
      <LoadingIndicator size="lg" />
    {:else if ensayos.length === 0}
      <div class="flex select-none flex-col gap-1 opacity-50">
        <IconoirEmojiSad class="h-10! w-auto! aspect-square" />
        <p class="italic">No hay ensayos para esta asignatura.</p>
      </div>
    {:else}
      <div class="h-full w-full">
        {#each ensayos as ensayo}
          <Card class="mb-2 p-4">
            <div class="flex justify-between items-center">
              <div>
                <h2 class="text-lg font-bold">Ensayo #{ensayo.id}</h2>
                <p class="text-sm text-gray-500">
                  Asignatura: {ensayo.asignatura ?? ensayo.id_asignatura} ·
                  Dificultad: {ensayo.dificultad} ·
                  Fecha: {ensayo.fecha_creacion}
                </p>
              </div>
              {#if Usuario.value?.rol === RolUsuario.Profesor}
				<button
					on:click={() => verPreguntas(ensayo.id)}
					class="text-blue-600 underline text-sm"
				>
					{ensayoExpandido === ensayo.id ? 'Ocultar' : 'Ver preguntas'}
				</button>
				{:else if Usuario.value?.rol === RolUsuario.Alumno}
				<button
					on:click={() => rendirEnsayo(ensayo.id)}
					class="text-green-600 underline text-sm"
				>
					Rendir ensayo
				</button>
				{/if}

            </div>

            {#if ensayoExpandido === ensayo.id}
              {#if cargandoPreguntas}
                <p class="italic text-sm text-gray-500 mt-2">Cargando preguntas...</p>
              {:else}
                <ul class="mt-3 space-y-2">
                  {#each preguntas as p, i (p.pregunta + i)}
                    <li class="ml-2">
                      <p class="font-medium">Pregunta: {p.pregunta}</p>
                      <ul class="ml-4 list-disc">
                        <li class={p.correcta ? 'text-green-600 font-bold' : ''}>
                          {p.respuesta}
                        </li>
                      </ul>
                    </li>
                  {/each}
                </ul>
              {/if}
            {/if}
          </Card>
        {/each}
      </div>
    {/if}
  </Card>
</PageMargin>
