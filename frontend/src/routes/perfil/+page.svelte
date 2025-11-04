<script lang="ts">
	import { Usuario } from '$lib/auth.svelte';
	import Avatar from '$lib/components/common/Avatar.svelte';
	import Card from '$lib/components/common/Card.svelte';

	function formatRut(rut: string) {
		if (!rut) return '';
		rut = rut.replace(/\./g, '').replace(/-/g, '');
		rut = rut.slice(0, -1) + '-' + rut.slice(-1);
		rut = rut.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
		return rut;
	}

	function getRolDisplay(rol: string) {
		const roles = {
			alumno: 'Estudiante',
			profesor: 'Profesor',
			visualizador: 'Visualizador'
		};

		//@ts-ignore
		return roles[rol] || rol;
	}
</script>

<div class="w-lg mx-auto max-w-2xl py-8">
	<div class="overflow-hidden rounded-lg shadow">
		<Card class="flex flex-col gap-4 px-6 py-8">
			<div class="text-center">
				<div class="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-full">
					<Avatar icon={Usuario.value?.imagen ?? Usuario.value?.nombre} />
				</div>
				<h2 class="font-bold">
					{#if Usuario.value?.nombre}
						{Usuario.value.nombre}
						{Usuario.value.paterno}
						{Usuario.value.materno}
					{:else}
						Usuario
					{/if}
				</h2>
				<p class="text-base">
					{getRolDisplay(Usuario.value?.rol || '')}
				</p>
			</div>

			<div class="grid gap-2">
				{#snippet info(title: string, value: string)}
					<div class="flex flex-col rounded-lg border px-4 py-2 md:flex-row md:justify-between">
						<span class="text-sm font-bold">{title}</span>
						<span class="text-muted-foreground text-base">{value}</span>
					</div>
				{/snippet}

				{@render info('RUT', formatRut(Usuario.value?.rut || ''))}
				{@render info('Correo', Usuario.value?.email || '')}

				{#if Usuario.value?.rol === 'alumno'}
					{@render info('Curso', Usuario.value?.curso || '')}
					{@render info(
						'Asistencia',
						Usuario.value?.asistencia ? `${Usuario.value.asistencia}%` : '-'
					)}
					{@render info('Apoderado', Usuario.value?.apoderado || '-')}
					{@render info('Dirección', Usuario.value?.direccion || '-')}
					{@render info('Fecha de Nacimiento', Usuario.value?.fecha_nacimiento || '-')}
					{@render info('Género', Usuario.value?.genero || '-')}
					{@render info('Situación', Usuario.value?.situacion_alumno || '-')}
				{/if}
			</div>
		</Card>
	</div>
</div>
