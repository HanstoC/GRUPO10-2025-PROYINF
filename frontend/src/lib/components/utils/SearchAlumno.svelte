<script lang="ts">
	import Card from '../common/Card.svelte';
	import SearchBar from '../common/SearchBar.svelte';
	import CheckboxGroup from '../common/CheckboxGroup.svelte';
	import Paginator from '../common/Paginator.svelte';
	import { AlumnosService } from '$lib/api/alumnos';

	interface Ensayo {
		asignatura_ensayo: string;
		puntaje_obtenido: number;
		dificultad_ensayo: string;
	}

	interface Alumno {
		id: string;
		nombre: string;
		paterno: string;
		materno: string;
		rut: string;
		email?: string;
		colegio?: string;
		curso?: string;
		ensayos: Ensayo[];
	}

	let combinedData: Alumno[] = $state([]);
	let originalFacets: { [key: string]: string[] } = $state({});
	let filteredData: Alumno[] = $state([]);
	let activeFilters: { [key: string]: string[] } = $state({});
	let searchTerm: string = $state('');
	let currentPage: number = $state(1);
	let itemsPerPage: number = $state(9);
	let totalPages: number = $state(1);

	let cargando: boolean = $state(true);
	let error: string = $state('');

	$effect(() => {
		loadCombinedData();
	});

	$effect(() => {
		// Solo si los datos combinados ya se han cargado exitosamente.
		// Las dependencias implícitas son `activeFilters` y `searchTerm` debido a su uso en `applyFiltersAndSearch`.
		if (combinedData.length > 0) {
			console.log('$effect de filtros/búsqueda disparado (cambio en activeFilters/searchTerm).'); // Aquí NO reseteamos currentPage. `applyFiltersAndSearch` ajustará si es necesario.
			applyFiltersAndSearch();
		}
	});

	async function loadCombinedData() {
		try {
			cargando = true;
			error = '';
			console.log('loadCombinedData: Iniciando carga desde API.COMBINED_DATA().');

			const response = await AlumnosService.getCombinada();

			if (!response.ok) {
				const errorData = await response
					.json()
					.catch(() => ({ message: 'Error desconocido del servidor.' }));
				console.error(
					'loadCombinedData: Error al cargar datos combinados:',
					response.status,
					errorData
				);
				throw new Error(
					`Error ${response.status}: ${errorData.message || 'No se pudieron cargar los datos combinados.'}`
				);
			}

			const data: { combinedData: Alumno[]; unifiedFacets: { [key: string]: string[] } } =
				await response.json();
			console.log(
				'loadCombinedData: Datos recibidos exitosamente. combinedData.length:',
				data.combinedData.length
			);
			combinedData = data.combinedData; // Aquí se llena 'combinedData'
			originalFacets = data.unifiedFacets; // Después de cargar los datos, inicializar la vista.
			// La `currentPage` ya es 1 por defecto al cargar el componente.

			applyFiltersAndSearch();
		} catch (e) {
			console.error('loadCombinedData: Error general durante la carga:', e);
			error =
				e instanceof Error
					? e.message
					: 'Ocurrió un error inesperado al cargar los datos combinados.';
		} finally {
			cargando = false;
		}
	}

	function applyFiltersAndSearch() {
		console.log('applyFiltersAndSearch: Ejecutando...');
		let tempFiltered: Alumno[] = combinedData; // 1. Aplicar filtros facetados

		for (const facetKey in activeFilters) {
			const selectedValues = activeFilters[facetKey];
			if (selectedValues && selectedValues.length > 0) {
				tempFiltered = tempFiltered.filter((item) => {
					if (facetKey === 'asignatura_ensayo' && Array.isArray(item.ensayos)) {
						return item.ensayos.some((ensayo) => selectedValues.includes(ensayo.asignatura_ensayo));
					}
					return selectedValues.includes((item as any)[facetKey]);
				});
			}
		} // 2. Aplicar búsqueda por texto

		if (searchTerm) {
			const lowerCaseSearchTerm = searchTerm.toLowerCase();
			tempFiltered = tempFiltered.filter(
				(item) =>
					item.nombre.toLowerCase().includes(lowerCaseSearchTerm) ||
					item.paterno.toLowerCase().includes(lowerCaseSearchTerm) ||
					item.materno.toLowerCase().includes(lowerCaseSearchTerm) ||
					item.rut.toLowerCase().includes(lowerCaseSearchTerm) ||
					(item.colegio && item.colegio.toLowerCase().includes(lowerCaseSearchTerm)) ||
					(item.curso && item.curso.toLowerCase().includes(lowerCaseSearchTerm))
			);
		} // 3. Lógica de Paginación

		totalPages = Math.ceil(tempFiltered.length / itemsPerPage); // Ajusta currentPage si la página actual excede el total después de filtros,
		// o si no hay resultados.
		if (currentPage > totalPages && totalPages > 0) {
			currentPage = totalPages;
		} else if (totalPages === 0) {
			currentPage = 1; // Si no hay resultados, la página es 1
		}

		const startIndex = (currentPage - 1) * itemsPerPage;
		const endIndex = startIndex + itemsPerPage;

		filteredData = tempFiltered.slice(startIndex, endIndex); // Logs de depuración

		console.log('applyFiltersAndSearch: Finalizado.');
		console.log(`  tempFiltered.length (después de filtros/búsqueda): ${tempFiltered.length}`);
		console.log(`  itemsPerPage: ${itemsPerPage}`);
		console.log(`  totalPages (calculadas): ${totalPages}`);
		console.log(`  currentPage (final en applyFiltersAndSearch): ${currentPage}`);
		console.log(`  startIndex: ${startIndex}, endIndex: ${endIndex}`);
		console.log(`  filteredData.length (mostrándose): ${filteredData.length}`);
		console.log('---------------------------------------');
	}

	function handleFilterChange(facetKey: string, selectedOptions: string[]) {
		activeFilters = {
			...activeFilters,
			[facetKey]: selectedOptions
		}; // El $effect de filtros/búsqueda se encargará de llamar a applyFiltersAndSearch.
		// Al hacer esto, el $effect reacciona, y como `currentPage` ya no se resetea dentro del $effect,
		// la paginación se mantiene a menos que los filtros cambien el totalPages.
		// Si queremos forzar a la página 1 cuando se cambia un filtro:
		currentPage = 1; // ¡Añadimos el reset a 1 aquí para el usuario!
	}

	function handleSearchChange(newSearchTerm: string) {
		searchTerm = newSearchTerm; // El $effect de filtros/búsqueda se encargará de llamar a applyFiltersAndSearch.
		// Si queremos forzar a la página 1 cuando se cambia la búsqueda:
		currentPage = 1; // ¡Añadimos el reset a 1 aquí para el usuario!
	}

	function goToPage(page: number) {
		console.log(`goToPage llamado. Intentando ir a la página: ${page}`);
		if (page >= 1 && page <= totalPages) {
			console.log(`Página ${page} es válida. Actualizando currentPage a ${page}.`);
			currentPage = page;
			applyFiltersAndSearch(); // ¡Crucial! Re-aplica filtros/paginación para la nueva página.
			console.log(`goToPage finalizado. currentPage ahora es: ${currentPage}`);
		} else {
			console.log(
				`Página ${page} NO es válida. totalPages: ${totalPages}, currentPage actual: ${currentPage}`
			);
		}
	}

	function nextPage() {
		goToPage(currentPage + 1);
	}

	function prevPage() {
		goToPage(currentPage - 1);
	}
</script>

<Card class="flex h-full w-full flex-col gap-4">
	<h2 class="text-xl font-semibold">Alumnos y Ensayos</h2>
	<SearchBar
		placeholder="Buscar alumnos..."
		bind:value={searchTerm}
		onSearch={handleSearchChange}
	/>
	<div class="flex gap-4">
		<div class="w-1/4 rounded-lg border bg-gray-50 p-4 shadow-sm">
			<h3 class="mb-4 text-lg font-semibold">Filtros</h3>
			{#each Object.entries(originalFacets) as [facetKey, facetOptions]}
				<div class="mb-4">
					<h4 class="text-md font-medium capitalize">{facetKey.replace('_', ' ')}</h4>
					<CheckboxGroup
						options={facetOptions}
						selected={activeFilters[facetKey] || []}
						on:change={(event: CustomEvent<string[]>) => handleFilterChange(facetKey, event.detail)}
					/>
				</div>
			{/each}
			<button
				class="mt-4 rounded-md bg-gray-200 p-2 hover:bg-gray-300"
				onclick={() => {
					activeFilters = {};
					searchTerm = '';
				}}>Limpiar Filtros</button
			>
		</div>
		<div class="max-h-[70vh] w-3/4">
			{#if cargando}
				<div class="flex justify-center py-4">
					<div
						class="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"
					></div>
					<p class="ml-2 text-gray-600">Cargando datos...</p>
				</div>
			{:else if error}
				<div
					class="relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
					role="alert"
				>
					<strong class="font-bold">¡Error!</strong> <span class="block sm:inline"> {error}</span>
					<p class="mt-1 text-sm">Por favor, intenta recargar la página.</p>
				</div>
			{:else if filteredData.length === 0}
				<div class="rounded-md bg-gray-50 p-4 text-center text-gray-500">
					<p>No hay alumnos que coincidan con los filtros aplicados.</p>
				</div>
			{:else}
				<div class="flex h-full w-full flex-col">
					<div
						class="grid h-full flex-auto grid-cols-1 gap-4 overflow-y-scroll md:grid-cols-2 lg:grid-cols-3"
					>
						{#each filteredData as alumno (alumno.id)}
							<div
								class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md"
							>
								<h3 class="text-lg font-bold text-gray-800">
									{alumno.nombre}
									{alumno.paterno}
								</h3>
								<p class="text-sm text-gray-600">RUT: {alumno.rut}</p>
								<p class="text-sm text-gray-600">Email: {alumno.email || 'No disponible'}</p>
								<p class="mt-2 text-sm font-medium text-gray-600">
									Curso: {alumno.curso} (Colegio: {alumno.colegio})
								</p>
								{#if alumno.ensayos && alumno.ensayos.length > 0}
									<div class="mt-3 border-t border-gray-100 pt-2">
										<p class="text-xs font-semibold text-gray-700">Ensayos:</p>
										{#each alumno.ensayos as ensayo}
											<p class="ml-2 text-xs text-gray-500">
												- {ensayo.asignatura_ensayo}: {ensayo.puntaje_obtenido} pts (Dificultad: {ensayo.dificultad_ensayo})
											</p>
										{/each}
										<p class="mt-2 text-xs font-semibold text-gray-700">
											{(() => {
												const totalScore = alumno.ensayos.reduce(
													(sum, e) => sum + e.puntaje_obtenido,
													0
												);
												const average =
													alumno.ensayos.length > 0
														? (totalScore / alumno.ensayos.length).toFixed(2)
														: 'N/A';
												return `Promedio ensayos: ${average} pts`;
											})()}
										</p>
									</div>
								{:else}
									<p class="mt-2 text-xs text-gray-500">Sin ensayos registrados.</p>
								{/if}
							</div>
						{/each}
					</div>

					<div class="mt-2 w-full">
						{#if filteredData.length > 0 && totalPages > 1}
							<Paginator bind:currentPage {totalPages} />
						{/if}
					</div>
				</div>
			{/if}
		</div>
	</div>
</Card>
