<script lang="ts">
	import { Usuario } from '$lib/auth.svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	onMount(() => {
		// Redirect to login if no user data
		if (!Usuario.value) {
			goto('/login');
		}
	});

	// Format RUT with dots and dash
	function formatRut(rut: string) {
		if (!rut) return '';
		// Remove existing format
		rut = rut.replace(/\./g, '').replace(/-/g, '');
		// Add dash before last digit
		rut = rut.slice(0, -1) + '-' + rut.slice(-1);
		// Add dots for thousands
		rut = rut.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
		return rut;
	}

	// Map role to display text
	function getRolDisplay(rol: string) {
		const roles = {
			alumno: 'Estudiante',
			profesor: 'Profesor',
			visualizador: 'Visualizador'
		};
		return roles[rol] || rol;
	}
</script>

<div class="container mx-auto px-4">
	<div class="mx-auto max-w-2xl py-8">
		<div class="overflow-hidden rounded-lg shadow">
			<div class="px-6 py-8">
				<!-- Header -->
				<div class="mb-8 text-center">
					<div class="bg-card mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-full">
						{#if Usuario.value?.imagen}
							<img
								src={Usuario.value.imagen}
								alt="Foto de perfil"
								class="h-32 w-32 rounded-full object-cover"
							/>
						{:else}
							<span class="text-5xl text-gray-400">
								{Usuario.value?.nombre?.[0]?.toUpperCase() || '?'}
							</span>
						{/if}
					</div>
					<h1 class="text-xl font-bold text-gray-100">
						{Usuario.value?.nombre || 'Usuario'}
					</h1>
					<p class="mt-1 text-sm text-gray-400">
						{getRolDisplay(Usuario.value?.rol || '')}
					</p>
				</div>

				<!-- Info Grid -->
				<div class="mb-8 grid gap-6">
					<div class="grid gap-4">
						<div class="bg-card flex flex-col rounded-lg p-4 md:flex-row md:justify-between">
							<span class="text-sm font-medium text-gray-400">RUT</span>
							<span class="text-base text-gray-200">{formatRut(Usuario.value?.rut || '')}</span>
						</div>
						<div class="bg-card flex flex-col rounded-lg p-4 md:flex-row md:justify-between">
							<span class="text-sm font-medium text-gray-400">Correo</span>
							<span class="text-base text-gray-200">{Usuario.value?.correo || ''}</span>
						</div>

						{#if Usuario.value?.rol === 'alumno'}
							<div class="bg-card flex flex-col rounded-lg p-4 md:flex-row md:justify-between">
								<span class="text-sm font-medium text-gray-400">Curso</span>
								<span class="text-base text-gray-200">{Usuario.value?.curso || ''}</span>
							</div>
							<div class="bg-card flex flex-col rounded-lg p-4 md:flex-row md:justify-between">
								<span class="text-sm font-medium text-gray-400">Asistencia</span>
								<span class="text-base text-gray-200"
									>{Usuario.value?.asistencia ? `${Usuario.value.asistencia}%` : '-'}</span
								>
							</div>
							<div class="bg-card flex flex-col rounded-lg p-4 md:flex-row md:justify-between">
								<span class="text-sm font-medium text-gray-400">Apoderado</span>
								<span class="text-base text-gray-200">{Usuario.value?.apoderado || '-'}</span>
							</div>
							<div class="bg-card flex flex-col rounded-lg p-4 md:flex-row md:justify-between">
								<span class="text-sm font-medium text-gray-400">Dirección</span>
								<span class="text-base text-gray-200">{Usuario.value?.direccion || '-'}</span>
							</div>
							<div class="bg-card flex flex-col rounded-lg p-4 md:flex-row md:justify-between">
								<span class="text-sm font-medium text-gray-400">Fecha de Nacimiento</span>
								<span class="text-base text-gray-200">{Usuario.value?.fecha_nacimiento || '-'}</span
								>
							</div>
							<div class="bg-card flex flex-col rounded-lg p-4 md:flex-row md:justify-between">
								<span class="text-sm font-medium text-gray-400">Género</span>
								<span class="text-base text-gray-200">{Usuario.value?.genero || '-'}</span>
							</div>
							<div class="bg-card flex flex-col rounded-lg p-4 md:flex-row md:justify-between">
								<span class="text-sm font-medium text-gray-400">Situación</span>
								<span class="text-base text-gray-200">{Usuario.value?.situacion_alumno || '-'}</span
								>
							</div>
							<div class="bg-card flex flex-col rounded-lg p-4 md:flex-row md:justify-between">
								<span class="text-sm font-medium text-gray-400">Tipo de Enseñanza</span>
								<span class="text-base text-gray-200">{Usuario.value?.tipo_ensenanza || '-'}</span>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
