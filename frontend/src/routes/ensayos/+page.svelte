<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
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
  let selectedEnsayos: number[] = [];

  

  $: query = selectedAsignaturas.length > 0
    ? '?' + selectedAsignaturas.map(a => `asignatura=${a}`).join('&')
    : '';

  $: if (query !== undefined) {
    loadEnsayos(query);
  }

  onMount(async () => {
  try {
    const res = await fetch('http://localhost:8000/check-session', {
      credentials: 'include'
    });
    if (!res.ok) throw new Error('No autorizado');

    const data = await res.json();
    if (data.authenticated && data.user) {
      Usuario.set({
        id: data.user.id,
        rut: data.user.rut,
        rol: data.user.tipo 
      });
      console.log('Usuario seteado:', data.user.id);
    }
  } catch (e) {
    console.error('Error al verificar sesión:', e);
    Usuario.set(null); 
  }
});

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
    goto(`/ensayos/${id}`);
	}

  function toggleSelectEnsayo(id: number) {
    console.log('toggle', id);
    if (selectedEnsayos.includes(id)) {
      selectedEnsayos = selectedEnsayos.filter(e => e !== id);
    } else {
      selectedEnsayos = [...selectedEnsayos, id];
    }
    console.log('Ahora selectedEnsayos:', selectedEnsayos);
  }

    function selectAllEnsayos() {
    if (selectedEnsayos.length === ensayos.length) {
      selectedEnsayos = [];
    } else {
      selectedEnsayos = ensayos.map(e => e.id);
    }
  }

  function editarEnsayo(id: number) {
    goto(`/editor-ensayos/${id}`);
  }

  function editarPreguntas() {
    goto(`/mis-preguntas`);
  }


  async function eliminarEnsayos() {
  console.log('selectedEnsayos:', selectedEnsayos);
  console.log('Usuario:', Usuario.id);

  if (selectedEnsayos.length === 0) {
    alert('No hay ensayos seleccionados.');
    return;
  }

  if (!Usuario.value?.id) {
    alert('Error: Usuario no tiene ID de profesor.');
    return;
  }

  const confirmar = confirm(`¿Seguro que quieres eliminar ${selectedEnsayos.length} ensayo(s)?`);
  if (!confirmar) return;

  try {
    const res = await fetch('http://localhost:8000/ensayos', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        ids: selectedEnsayos,
        id_profesor: Usuario.value.id
      })
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error eliminando ensayos:', errorText);
      alert('No se pudieron eliminar los ensayos.');
      return;
    }

    const data = await res.json();
    console.log('Respuesta del backend:', data);

    ensayos = ensayos.filter(e => !selectedEnsayos.includes(e.id));
    selectedEnsayos = [];
    alert('Ensayos eliminados correctamente.');
  } catch (err) {
    console.error('Error eliminando ensayos:', err);
    alert('Error eliminando ensayos.');
  }
}


</script>



<PageMargin>
  {#if Usuario.value?.rol === RolUsuario.Profesor}
    <Card size="sm" class="flex w-full flex-row items-center justify-between gap-2">
      <div class="flex flex-row items-center gap-2">
        <Button size="sm" goto="/editor-ensayos">Crear ensayo</Button>
        <Button size="sm" goto="/preguntas">Editar mis preguntas</Button>
      </div>
      <div class="flex flex-row items-center gap-2">
        <p class="text-xs italic opacity-50">{selectedEnsayos.length} seleccionados</p>
        <button size="icon" variant="secondary" on:click={selectAllEnsayos}>
          <MaterialSymbolsSelectAll />
        </button>
        <button on:click={() => eliminarEnsayos()}>Eliminar</button>
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
              <div class="flex items-center gap-2">
                {#if Usuario.value?.rol === RolUsuario.Profesor}
                  <input
                    type="checkbox"
                    checked={selectedEnsayos.includes(ensayo.id)}
                    on:change={() => toggleSelectEnsayo(ensayo.id)}
                  />
                {/if}
                <div>
                  <h2 class="text-lg font-bold">Ensayo #{ensayo.id}</h2>
                  <p class="text-sm text-gray-500">
                    Asignatura: {ensayo.asignatura ?? ensayo.id_asignatura} ·
                    Dificultad: {ensayo.dificultad} ·
                    Fecha: {ensayo.fecha_creacion}
                  </p>
                </div>
              </div>

              <div class="flex gap-2">
                {#if Usuario.value?.rol === RolUsuario.Profesor}
                  <button
                   size="sm" on:click={() => editarEnsayo(ensayo.id)}
                   >Editar</button>

                {:else if Usuario.value?.rol === RolUsuario.Alumno}
                  <button
                    on:click={() => rendirEnsayo(ensayo.id)}
                    class="text-green-600 underline text-sm"
                  >
                    Rendir ensayo
                  </button>
                {/if}
              </div>
            </div>
          </Card>
        {/each}
      </div>
    {/if}
  </Card>
</PageMargin>