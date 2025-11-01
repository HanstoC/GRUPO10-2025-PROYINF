<script lang="ts">
	import { untrack } from 'svelte';
	import { goto } from '$app/navigation';
	import Card from '$lib/components/common/Card.svelte';
	import FiltroAsignaturas from '$lib/components/ensayos/FilterAsignatura.svelte';
	import IconoirEmojiSad from '$lib/icons/IconoirEmojiSad.svelte';
	import LoadingIndicator from '$lib/components/common/utils/LoadingIndicator.svelte';
	import Form from '$lib/components/common/Form';
	import { RolUsuario, Usuario } from '$lib/auth.svelte';
	import Button from '$lib/components/common/Button.svelte';
	import MaterialSymbolsSelectAll from '$lib/icons/MaterialSymbolsSelectAll.svelte';
	import { page } from '$app/state';
	import debounce from 'lodash/debounce';

	let selectedAsignaturas: number[] = $state([]);
	let ensayos: any[] = $state([]);
	let loading = $state(false);

	let selectedEnsayos: number[] = $state([]);

	const query = $derived.by(() => {
		const params: Record<string, any> = {};
		if (selectedAsignaturas.length > 0) params['asignatura'] = selectedAsignaturas;

		return Object.entries(params)
			.map(([k, v]) => `${k}=${Array.isArray(v) ? v.join(',') : v}`)
			.filter(Boolean)
			.join('&');
	});

	$effect(() => {
		untrack(() => {
			if (query !== undefined) loadEnsayos(query);
		});
	});

	const debouncedQuery = debounce((q: string) => {
		goto(page.url.pathname + '?' + q, { replaceState: true, noScroll: true });
	}, 200);

	$effect(() => {
		debouncedQuery(query);
	});

	async function loadEnsayos(q: string) {
		loading = true;
		try {
			const res = await fetch(`http://localhost:8000/ensayos?${q}`, {
				credentials: 'include'
			});
			ensayos = await res.json();
		} catch (err) {
			console.error('Error cargando ensayos:', err);
		} finally {
			loading = false;
		}
	}

	function rendirEnsayo(id: number) {
		goto(`/ensayos/${id}`);
	}

	function toggleSelectEnsayo(id: number) {
		console.log('toggle', id);
		if (selectedEnsayos.includes(id)) {
			selectedEnsayos = selectedEnsayos.filter((e) => e !== id);
		} else {
			selectedEnsayos = [...selectedEnsayos, id];
		}
		console.log('Ahora selectedEnsayos:', selectedEnsayos);
	}

	function selectAllEnsayos() {
		if (selectedEnsayos.length === ensayos.length) {
			selectedEnsayos = [];
		} else {
			selectedEnsayos = ensayos.map((e) => e.id);
		}
	}

	function editarEnsayo(id: number) {
		goto(`/editor-ensayos/${id}`);
	}

	function verEnsayo(id: number) {
		goto(`/ensayo-ver/${id}`);
	}

	function estadísticasEnsayo(id: number) {
		goto(`/ensayo-estadistica/${id}`);
	}

	function editarPreguntas() {
		goto(`/mis-preguntas`);
	}

	async function eliminarEnsayos() {
		console.log('selectedEnsayos:', selectedEnsayos);
		console.log('Usuario:', Usuario.value?.id);

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

			ensayos = ensayos.filter((e) => !selectedEnsayos.includes(e.id));
			selectedEnsayos = [];
			alert('Ensayos eliminados correctamente.');
		} catch (err) {
			console.error('Error eliminando ensayos:', err);
			alert('Error eliminando ensayos.');
		}
	}
</script>

{#if Usuario.value?.rol === RolUsuario.Profesor}
	<Card size="sm" class="flex w-full flex-row items-center justify-between gap-2">
		<div class="flex flex-row items-center gap-2">
			<Button size="sm" goto="/editor-ensayos">Crear ensayo</Button>
			<Button size="sm" goto="/preguntas">Editar mis preguntas</Button>
		</div>
		<div class="flex flex-row items-center gap-2">
			<p class="text-xs italic opacity-50">{selectedEnsayos.length} seleccionados</p>
			<Button size="icon" variant="secondary" onclick={selectAllEnsayos}>
				<MaterialSymbolsSelectAll />
			</Button>
			<Button onclick={() => eliminarEnsayos()}>Eliminar</Button>
		</div>
	</Card>
{/if}

<Card class="w-full">
	<h2 class="mb-4 text-2xl font-semibold">Ensayos</h2>
	<Form.Root class="w-fit">
		<Form.Item label="Filtrar por Asignaturas">
			<FiltroAsignaturas bind:selected={selectedAsignaturas} />
		</Form.Item>
	</Form.Root>
</Card>

<Card class="flex max-h-full w-1/2 flex-col">
	{#if loading}
		<LoadingIndicator size="lg" />
	{:else if ensayos.length === 0}
		<div class="flex select-none flex-col gap-1 opacity-50">
			<IconoirEmojiSad class="h-10! w-auto! aspect-square" />
			<p class="italic">No hay ensayos para esta asignatura.</p>
		</div>
	{:else}
		<div class="flex h-full flex-col items-center gap-2 overflow-y-auto">
			{#each ensayos as ensayo (ensayo.id)}
				{@debug ensayo}
				<Card class="w-full">
					<div class="flex flex-col gap-4">
						<div class="flex items-center gap-2">
							{#if Usuario.value?.rol === RolUsuario.Profesor}
								<input
									type="checkbox"
									checked={selectedEnsayos.includes(ensayo.id)}
									onchange={() => toggleSelectEnsayo(ensayo.id)}
								/>
							{/if}
							<div>
								<h2 class="text-lg font-bold">Ensayo #{ensayo.id}</h2>
								<p class="text-sm text-gray-500">
									Asignatura: {ensayo.asignatura ?? ensayo.id_asignatura} · Dificultad: {ensayo.dificultad}
									· Fecha: {ensayo.fecha_creacion}
								</p>
							</div>
						</div>

						<div class="flex w-full flex-row gap-2">
							{#if Usuario.value?.rol === RolUsuario.Profesor}
								<Button size="sm" onclick={() => editarEnsayo(ensayo.id)}>Editar</Button>
								<Button size="sm" onclick={() => estadísticasEnsayo(ensayo.id)}>Estadísticas</Button
								>
								<Button size="sm" onclick={() => verEnsayo(ensayo.id)}>Visualizar</Button>
							{:else if Usuario.value?.rol === RolUsuario.Alumno}
								<Button onclick={() => rendirEnsayo(ensayo.id)}>Rendir ensayo</Button>
							{/if}
						</div>
					</div>
				</Card>
			{/each}
		</div>
	{/if}
</Card>
