<script lang="ts">
	import { API } from '$lib/global/api';
	import { Usuario } from '$lib/auth.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import Card from '$lib/components/common/Card.svelte';
	import PageMargin from '$lib/components/common/PageMargin.svelte';

	let ensayos = $state([]);
	let cargando = $state(true);
	let error = $state('');
	let eliminando = $state(false);

	$effect(() => {
		cargarEnsayos();
	});

	async function cargarEnsayos() {
		try {
			const respuesta = await fetch(API.ENSAYOS_PROFESOR(Usuario.value?.id));
			if (!respuesta.ok) throw new Error('Error al cargar ensayos');
			ensayos = await respuesta.json();
		} catch (e) {
			error = e instanceof Error ? e.message : 'Error desconocido';
		} finally {
			cargando = false;
		}
	}

	async function manejarEliminacion(id: number) {
		if (!confirm('¿Está seguro que desea eliminar este ensayo?')) return;

		eliminando = true;
		try {
			const respuesta = await fetch(API.ELIMINAR_ENSAYO(id.toString()), {
				method: 'DELETE'
			});

			if (!respuesta.ok) throw new Error('Error al eliminar el ensayo');
			
			// Recargar lista de ensayos
			await cargarEnsayos();
		} catch (e) {
			error = e instanceof Error ? e.message : 'Error desconocido';
		} finally {
			eliminando = false;
		}
	}

	function formatearFecha(fechaStr: string) {
		return new Date(fechaStr).toLocaleDateString('es-CL', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<div class="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
	<div class="flex flex-col gap-6">
		<div class="flex flex-col items-center gap-4 sm:gap-6">
			<h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-center">Editor de Ensayos</h1>
			<div class="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
				<Button 
					href="/preguntas/crear"
					variant="outlined"
					class="w-full sm:w-auto"
				>
					Nueva Pregunta
				</Button>
				<Button 
					href="/editor-ensayos/crear"
					variant="default"
					class="w-full sm:w-auto"
				>
					Crear Ensayo
				</Button>
			</div>
		</div>

		{#if cargando}
			<Card>
				<div class="flex justify-center">
					<div class="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
				</div>
			</Card>
		{:else if error}
			<Card class="bg-destructive/20">
				<p class="text-destructive-foreground">{error}</p>
			</Card>
		{:else if ensayos.length === 0}
			<Card>
				<p class="text-center text-muted-foreground">No hay ensayos creados aún.</p>
			</Card>
		{:else}
			<div class="flex flex-col gap-4">
				{#each ensayos as ensayo (ensayo.id)}
					<Card class="w-full">
						<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
							<div class="flex items-center gap-4">
								<div>
									<h3 class="font-semibold">{ensayo.asignatura_nombre}</h3>
									<p class="text-sm text-muted-foreground">
										Creado el {formatearFecha(ensayo.fecha_creacion)}
									</p>
									<p class="text-sm text-muted-foreground mt-1">
										{ensayo.cantidad_preguntas} {ensayo.cantidad_preguntas === 1 ? 'pregunta' : 'preguntas'}
									</p>
								</div>
								<span class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">{ensayo.dificultad}</span>
							</div>
							<div class="flex gap-2 w-full sm:w-auto">
								<Button 
									variant="outlined" 
									size="sm"
									href={`/editor-ensayos/editar/${ensayo.id}`}
									class="flex-1 sm:flex-initial"
								>
									Editar
								</Button>
								<Button 
									variant="destructive" 
									size="sm"
									disabled={eliminando}
									onclick={() => manejarEliminacion(ensayo.id)}
									class="flex-1 sm:flex-initial"
								>
									{#if eliminando}
										<div class="animate-spin h-4 w-4 border-2 border-background border-t-transparent rounded-full"></div>
									{:else}
										Eliminar
									{/if}
								</Button>
							</div>
						</div>
					</Card>
				{/each}
			</div>
		{/if}
	</div>
</div>
