<script lang="ts">
	import Button from '$lib/components/common/Button.svelte';
	import Toggle from '$lib/components/common/Toggle.svelte';
	import Input from '$lib/components/common/Input.svelte';
	import FormRoot from './Form/FormRoot.svelte';

	// --- PROPS ---
	let { totalPages, currentPage = $bindable(1) }: { totalPages: number; currentPage: number } =
		$props();

	// --- ESTADO INTERNO ---
	let desiredPageInput = $state('');

	/**
	 * Navega a la página especificada en el input.
	 * Se activa al enviar el formulario.
	 */
	function goToPage() {
		const pageNum = Number.parseInt(desiredPageInput, 10);

		// Validar que sea un número y esté en el rango correcto
		if (!Number.isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
			currentPage = pageNum;
		}

		// Limpiar el input después de la acción
		desiredPageInput = '';
	}

	/**
	 * Genera la lista de páginas a mostrar, incluyendo elipsis '...'
	 * para listas largas, haciendo la navegación más limpia.
	 */
	const pages = $derived.by(() => {
		if (totalPages <= 7) {
			// Si hay 7 páginas o menos, muéstralas todas
			return Array.from({ length: totalPages }, (_, i) => i + 1);
		}

		// Si la página actual está cerca del inicio
		if (currentPage < 5) {
			return [1, 2, 3, 4, 5, '...', totalPages];
		}

		// Si la página actual está cerca del final
		if (currentPage > totalPages - 4) {
			return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
		}

		// Si está en el medio
		return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
	});
</script>

{#if totalPages > 1}
	<div class="flex flex-col items-center justify-center gap-1">
		<div class="flex w-full items-center justify-between gap-1">
			<Button
				variant="ghost"
				size="sm"
				onclick={() => (currentPage = Math.max(1, currentPage - 1))}
				disabled={currentPage === 1}
			>
				Anterior
			</Button>

			{#each pages as page}
				{#if typeof page === 'number'}
					<Toggle
						onclick={() => (currentPage = page)}
						pressed={currentPage === page}
						class="aspect-square!"
						size="sm"
					>
						{page}
					</Toggle>
				{:else}
					<span class="flex h-10 w-10 items-center justify-center text-gray-500">...</span>
				{/if}
			{/each}

			<Button
				variant="ghost"
				size="sm"
				onclick={() => (currentPage = Math.min(totalPages, currentPage + 1))}
				disabled={currentPage === totalPages}
			>
				Siguiente
			</Button>
		</div>

		<FormRoot
			onsubmit={(e: any) => {
				e.preventDefault();
				goToPage();
			}}
			class="flex w-full items-center justify-center"
		>
			<Input
				type="number"
				bind:value={desiredPageInput}
				min="1"
				max={totalPages}
				placeholder="Página"
				class="w-1/2! h-5 max-w-40 rounded-r-none"
			/>
			<Button class="h-5 rounded-l-none" onclick={goToPage} type="submit">Ir</Button>
		</FormRoot>
	</div>
{/if}
