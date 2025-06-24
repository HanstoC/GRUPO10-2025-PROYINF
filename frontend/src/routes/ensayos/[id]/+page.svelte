<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { get } from 'svelte/store';
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

  let preguntas = [];
  let respuestas: Record<number, number> = {}; // pregunta_id -> alternativa_id
  let tiempoRestante = 600; // 10 minutos (en segundos)
  let intervalo;
  let ensayoId: string;

  let cargando = true;
  let finalizado = false;

  $: minutos = Math.floor(tiempoRestante / 60);
  $: segundos = tiempoRestante % 60;

  onMount(async () => {
    const params = get(page).params;
    ensayoId = params.id;

    try {
      const res = await fetch(`http://localhost:8000/ensayos/${ensayoId}/preguntas`, {
        credentials: 'include'
      });
      preguntas = await res.json();
      cargando = false;
      iniciarTemporizador();
    } catch (e) {
      console.error('Error al cargar preguntas:', e);
    }
  });

  function seleccionar(pregunta_id: number, alternativa_id: number) {
    respuestas[pregunta_id] = alternativa_id;
  }

  function iniciarTemporizador() {
    intervalo = setInterval(() => {
      tiempoRestante -= 1;
      if (tiempoRestante <= 0) {
        clearInterval(intervalo);
        enviar();
      }
    }, 1000);
  }

  async function enviar() {
    clearInterval(intervalo);
    finalizado = true;
    try {
      const res = await fetch(`http://localhost:8000/ensayos/${ensayoId}/responder`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ respuestas })
      });

      if (res.ok) {
        alert('Ensayo enviado con éxito');
        goto('/'); // o ir a resultados
      } else {
        console.error('Error al enviar respuestas');
        alert('Hubo un problema al enviar tus respuestas.');
      }
    } catch (e) {
      console.error('Error en fetch:', e);
    }
  }
</script>

{#if cargando}
  <p class="text-center mt-10 text-gray-500">Cargando preguntas...</p>
{:else if finalizado}
  <p class="text-center text-green-600 font-semibold mt-10">Ensayo finalizado. Gracias por responder.</p>
{:else}
  <Card class="w-full max-w-3xl mx-auto p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold">Ensayo #{ensayoId}</h2>
      <p class="text-sm text-red-500 font-mono">
        Tiempo restante: {minutos}:{segundos < 10 ? `0${segundos}` : segundos}
      </p>
    </div>
    <form on:submit|preventDefault={enviar} class="space-y-6">
  {#each preguntas as p, i}
    <div class="border border-gray-300 rounded-lg p-4 shadow-sm">
      <p class="font-semibold mb-2">Pregunta {i + 1}: {p.pregunta}</p>
      
      <div class="space-y-2">
        {#each p.alternativas as alt}
          <label class="flex items-center gap-2">
            <input
              type="radio"
              name={`pregunta-${i}`}
              value={alt.id}
              bind:group={respuestas[i]}
              class="accent-blue-500"
            />
            <span>{alt.texto}</span>
          </label>
        {/each}
      </div>
    </div>
  {/each}

  <div class="flex justify-end pt-6">
    <Button type="submit" class="btn btn-primary">Enviar ensayo</Button>
  </div>
</form>
  </Card>
{/if}