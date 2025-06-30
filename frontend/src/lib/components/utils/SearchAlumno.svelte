<script lang="ts">
	import Card from '../common/Card.svelte';
	import SearchBar from '../common/SearchBar.svelte';
	import { API } from '$lib/global/api';
	import CheckboxGroup from '../common/CheckboxGroup.svelte';

	
	let combinedData = $state([]);
	let originalFacets = $state({});
	let filteredData = $state([]);
	let activeFilters = $state({});
	let searchTerm = $state('');
	
	let currentPage = $state(1); 
	let itemsPerPage = $state(9);
	let totalPages = $state(1);

	let cargando = $state(true);
	let error = $state('');


	loadCombinedData(); 


	$effect(() => {
		// Solo si los datos combinados ya se han cargado exitosamente.
		// Las dependencias implícitas son `activeFilters` y `searchTerm` debido a su uso en `applyFiltersAndSearch`.
		if (combinedData.length > 0) {
			console.log("$effect de filtros/búsqueda disparado (cambio en activeFilters/searchTerm).");
            // Aquí NO reseteamos currentPage. `applyFiltersAndSearch` ajustará si es necesario.
			applyFiltersAndSearch();
		}
	});

	
	async function loadCombinedData() {
		try {
			cargando = true;
			error = '';
			console.log("loadCombinedData: Iniciando carga desde API.COMBINED_DATA().");

			const response = await fetch(API.COMBINED_DATA());

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({ message: 'Error desconocido del servidor.' }));
				console.error("loadCombinedData: Error al cargar datos combinados:", response.status, errorData);
				throw new Error(`Error ${response.status}: ${errorData.message || 'No se pudieron cargar los datos combinados.'}`);
			}

			const data = await response.json();
			console.log("loadCombinedData: Datos recibidos exitosamente. combinedData.length:", data.combinedData.length);
			combinedData = data.combinedData; // Aquí se llena 'combinedData'
			originalFacets = data.unifiedFacets;

			// Después de cargar los datos, inicializar la vista.
			// La `currentPage` ya es 1 por defecto al cargar el componente.
			applyFiltersAndSearch(); 

		} catch (e) {
			console.error("loadCombinedData: Error general durante la carga:", e);
			error = e instanceof Error ? e.message : 'Ocurrió un error inesperado al cargar los datos combinados.';
		} finally {
			cargando = false;
		}
	}

	
	function applyFiltersAndSearch() {
		console.log("applyFiltersAndSearch: Ejecutando...");
		let tempFiltered = combinedData;

		// 1. Aplicar filtros facetados
		for (const facetKey in activeFilters) {
			const selectedValues = activeFilters[facetKey];
			if (selectedValues && selectedValues.length > 0) {
				tempFiltered = tempFiltered.filter(item => {
					if (facetKey === 'asignatura_ensayo') {
						return item.ensayos.some(ensayo => selectedValues.includes(ensayo.asignatura_ensayo));
					}
					return selectedValues.includes(item[facetKey]);
				});
			}
		}

		// 2. Aplicar búsqueda por texto
		if (searchTerm) {
			const lowerCaseSearchTerm = searchTerm.toLowerCase();
			tempFiltered = tempFiltered.filter(item =>
				item.nombre.toLowerCase().includes(lowerCaseSearchTerm) ||
				item.paterno.toLowerCase().includes(lowerCaseSearchTerm) ||
				item.materno.toLowerCase().includes(lowerCaseSearchTerm) ||
				item.rut.toLowerCase().includes(lowerCaseSearchTerm) ||
				(item.colegio && item.colegio.toLowerCase().includes(lowerCaseSearchTerm)) ||
				(item.curso && item.curso.toLowerCase().includes(lowerCaseSearchTerm))
			);
		}

		// 3. Lógica de Paginación
		totalPages = Math.ceil(tempFiltered.length / itemsPerPage);
		// Ajusta currentPage si la página actual excede el total después de filtros,
		// o si no hay resultados.
		if (currentPage > totalPages && totalPages > 0) {
			currentPage = totalPages;
		} else if (totalPages === 0) {
			currentPage = 1; // Si no hay resultados, la página es 1
		}

		const startIndex = (currentPage - 1) * itemsPerPage;
		const endIndex = startIndex + itemsPerPage;

		filteredData = tempFiltered.slice(startIndex, endIndex);

		// Logs de depuración
		console.log("applyFiltersAndSearch: Finalizado.");
		console.log(`  tempFiltered.length (después de filtros/búsqueda): ${tempFiltered.length}`);
		console.log(`  itemsPerPage: ${itemsPerPage}`);
		console.log(`  totalPages (calculadas): ${totalPages}`);
		console.log(`  currentPage (final en applyFiltersAndSearch): ${currentPage}`);
		console.log(`  startIndex: ${startIndex}, endIndex: ${endIndex}`);
		console.log(`  filteredData.length (mostrándose): ${filteredData.length}`);
		console.log("---------------------------------------");
	}

	
	function handleFilterChange(facetKey: string, selectedOptions: string[]) {
		activeFilters = {
			...activeFilters,
			[facetKey]: selectedOptions
		};
		// El $effect de filtros/búsqueda se encargará de llamar a applyFiltersAndSearch.
		// Al hacer esto, el $effect reacciona, y como `currentPage` ya no se resetea dentro del $effect,
		// la paginación se mantiene a menos que los filtros cambien el totalPages.
        // Si queremos forzar a la página 1 cuando se cambia un filtro:
        currentPage = 1; // ¡Añadimos el reset a 1 aquí para el usuario!
	}

	function handleSearchChange(newSearchTerm: string) {
		searchTerm = newSearchTerm;
		// El $effect de filtros/búsqueda se encargará de llamar a applyFiltersAndSearch.
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
			console.log(`Página ${page} NO es válida. totalPages: ${totalPages}, currentPage actual: ${currentPage}`);
		}
	}

	function nextPage() {
		goToPage(currentPage + 1);
	}

	function prevPage() {
		goToPage(currentPage - 1);
	}
</script>

<Card class="flex w-full flex-col gap-4 mt-16">
	<h2 class="text-xl font-semibold">Alumnos y Ensayos</h2>
	<SearchBar placeholder="Buscar alumnos..." bind:value={searchTerm} onSearch={handleSearchChange} />

	<div class="mt-4 flex gap-4">
        <div class="w-1/4 p-4 border rounded-lg shadow-sm bg-gray-50">
            <h3 class="font-semibold text-lg mb-4">Filtros</h3>
            {#each Object.entries(originalFacets) as [facetKey, facetOptions]}
                <div class="mb-4">
                    <h4 class="font-medium text-md capitalize">{facetKey.replace('_', ' ')}</h4>
                    <CheckboxGroup
                        options={facetOptions} 
                        selected={activeFilters[facetKey] || []}
                        on:change={(event) => handleFilterChange(facetKey, event.detail)}
                    />
                    </div>
            {/each}
            <button class="mt-4 p-2 bg-gray-200 rounded-md hover:bg-gray-300" onclick={() => { activeFilters = {}; searchTerm = ''; }}>Limpiar Filtros</button>
        </div>

		<div class="w-3/4">
			{#if cargando}
				<div class="flex justify-center py-4">
					<div class="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
					<p class="ml-2 text-gray-600">Cargando datos...</p>
				</div>
			{:else if error}
				<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
					<strong class="font-bold">¡Error!</strong>
					<span class="block sm:inline"> {error}</span>
					<p class="text-sm mt-1">Por favor, intenta recargar la página.</p>
				</div>
			{:else if filteredData.length === 0}
				<div class="p-4 text-center text-gray-500 bg-gray-50 rounded-md">
					<p>No hay alumnos que coincidan con los filtros aplicados.</p>
				</div>
			{:else}
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{#each filteredData as alumno (alumno.id)}
						<div class="border border-gray-200 p-4 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow duration-200">
							<h3 class="font-bold text-lg text-gray-800">
								{alumno.nombre} {alumno.paterno}
							</h3>
							<p class="text-sm text-gray-600">RUT: {alumno.rut}</p>
							<p class="text-sm text-gray-600">Email: {alumno.email || 'No disponible'}</p>
							<p class="text-sm text-gray-600 mt-2 font-medium">
								Curso: {alumno.curso} (Colegio: {alumno.colegio})
							</p>
							{#if alumno.ensayos && alumno.ensayos.length > 0}
								<div class="mt-3 pt-2 border-t border-gray-100">
									<p class="font-semibold text-xs text-gray-700">Ensayos:</p>
									{#each alumno.ensayos as ensayo}
										<p class="text-xs text-gray-500 ml-2">- {ensayo.asignatura_ensayo}: {ensayo.puntaje_obtenido} pts (Dificultad: {ensayo.dificultad_ensayo})</p>
									{/each}
									<p class="font-semibold text-xs text-gray-700 mt-2">
										{(() => {
											const totalScore = alumno.ensayos.reduce((sum, e) => sum + e.puntaje_obtenido, 0);
											const average = alumno.ensayos.length > 0 ? (totalScore / alumno.ensayos.length).toFixed(2) : 'N/A';
											return `Promedio ensayos: ${average} pts`;
										})()}
									</p>
								</div>
							{:else}
								<p class="text-xs text-gray-500 mt-2">Sin ensayos registrados.</p>
							{/if}
						</div>
					{/each}
				</div>

				{#if filteredData.length > 0 && totalPages > 1}
					<div class="flex justify-center items-center mt-6 space-x-2">
						<button
							onclick={prevPage}
							disabled={currentPage === 1}
							class="px-4 py-2 border rounded-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Anterior
						</button>

						{#each Array(totalPages).keys() as i}
							<button
								onclick={() => goToPage(i + 1)}
								class="px-4 py-2 border rounded-md {currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}"
							>
								{i + 1}
							</button>
						{/each}

						<button
							onclick={nextPage}
							disabled={currentPage === totalPages}
							class="px-4 py-2 border rounded-md bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							Siguiente
						</button>
					</div>
				{/if}
			{/if}
		</div>
	</div>
</Card>