<script lang="ts">
  import { onMount } from 'svelte';
  import Card from '$lib/components/common/Card.svelte';
  import PageMargin from '$lib/components/common/PageMargin.svelte';
  import LoadingIndicator from '$lib/components/common/utils/LoadingIndicator.svelte';
  import FiltroAsignaturas from '$lib/components/ensayos/FilterAsignatura.svelte';

  let resultados = [];
  let cargando = true;
  let selectedAsignaturas: number[] = [];

  $: resultadosFiltrados = selectedAsignaturas.length > 0
	? resultados.filter(r => selectedAsignaturas.includes(r.id_asignatura))
	: resultados;

  onMount(async () => {
    try {
      const res = await fetch('http://localhost:8000/resultados', {
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Error al obtener resultados');
      resultados = await res.json();
    } catch (e) {
      console.error('Error al cargar resultados:', e);
    } finally {
      cargando = false;
    }
  });
</script>

<PageMargin>
  <Card size="lg" class="w-full">
	{#if cargando}
		<LoadingIndicator />
	{:else if resultados.length === 0}
		<p class="text-center text-gray-500">No tienes resultados aún.</p>
	{:else}
		<h2 class="text-2xl font-semibold mb-4">Tus resultados</h2>

		<!-- Filtro -->
		<FiltroAsignaturas bind:selected={selectedAsignaturas} />

		<div class="space-y-4 mt-4">
		{#each resultadosFiltrados as r}
			<Card class="p-4">
			<p><strong>Ensayo:</strong> #{r.id_ensayo}</p>
			<p><strong>Asignatura:</strong> {r.asignatura}</p>
			<p><strong>Dificultad:</strong> {r.dificultad}</p>
			<p><strong>Puntaje:</strong> {r.puntaje_obtenido}</p>
			<p><strong>Correctas:</strong> {r.cantidad_correctas}</p>
			<p><strong>Erróneas:</strong> {r.cantidad_erroneas}</p>
			<p><strong>Omitidas:</strong> {r.cantidad_omitidas}</p>
			<p><strong>Tiempo empleado:</strong> {r.tiempo_empleado} segundos</p>
			</Card>
		{/each}
		</div>
	{/if}
	</Card>
</PageMargin>
