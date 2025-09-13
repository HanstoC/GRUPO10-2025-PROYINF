<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { get } from 'svelte/store';
  import Card from '$lib/components/common/Card.svelte';


  let preguntas = [];
  let respuestas: Record<number, number> = {}; // pregunta_id -> alternativa_id
  let ensayoId: string;
  let cargando = true;
  let finalizado = false;

  onMount(async () => {
    const params = get(page).params;
    ensayoId = params.id;

    try {
      const res = await fetch(`http://localhost:8000/ensayos/${ensayoId}/preguntas`, {
        credentials: 'include'
      });
      preguntas = await res.json();
      cargando = false;
    } catch (e) {
      console.error('Error al cargar preguntas:', e);
    }
  });


  function seleccionar(pregunta_id: number, alternativa_id: number) {
    respuestas[pregunta_id] = alternativa_id;
  }

  function volver(){
	goto(`/ensayos`)
  }

  
</script>

{#if cargando}
  <p class="text-center mt-10 text-gray-500">Cargando preguntas...</p>
{:else}
  <Card class="w-full max-w-3xl mx-auto p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold">Ensayo #{ensayoId}</h2>
    </div>
  {#each preguntas as p, i}
    <div class="border border-gray-300 rounded-lg p-4 shadow-sm">
      <p class="font-semibold mb-2">Pregunta {i + 1}: {p.pregunta}</p>
      
      <div class="space-y-2">
        {#each p.alternativas as alt}
          <label class="flex items-center gap-2">
            <input
              type="radio"
              name={`pregunta-${p.pregunta_id}`}
              value={alt.id}
              checked={respuestas[p.pregunta_id] === alt.id}
              on:change={() => seleccionar(p.pregunta_id, alt.id)}
              class="accent-blue-500"
            />
            <span>{alt.texto}</span>
          </label>
        {/each}
      </div>
    </div>
  {/each}

  <div class="flex justify-end pt-6">
    <button
      type="button"
      class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow transition duration-150"
	  on:click={volver()}
    >
      Volver
    </button>
  </div>
  </Card>
{/if}