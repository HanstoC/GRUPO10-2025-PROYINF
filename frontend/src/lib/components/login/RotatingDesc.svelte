<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	const TEXTS = [
		//
		`Estadísticas detalladas para identificar puntos débiles.`,
		'Librería de ensayos para los conceptos de cada asignatura.',
		'Comunicación directa con diversos profesores.',
		'Ensayos actualizados según el temario oficial.',
		'Seguimiento personalizado de tu progreso.',
		'Simulacros con tiempo real y retroalimentación inmediata.',
		'Comparación de resultados con otros estudiantes.',
		'Una herramienta para estudiar con mayor claridad.',
		'Contenido pensado para acompañarte en cada etapa.',
		'Espacios diseñados para practicar con confianza.',
		'Una forma práctica de enfrentarse al desafío.',
		'Material organizado para facilitar tu preparación.',
		'Apoyo constante mientras avanzas a tu ritmo.',
		'Explora distintas formas de enfrentar cada pregunta.',
		'Un entorno para entrenar tu mente de forma gradual.'
	];

	let currentText = $state(Math.floor(Math.random() * TEXTS.length));
	let mounted = $state(false);

	$effect(() => {
		const interval = setInterval(() => {
			currentText = (currentText + 1) % TEXTS.length;
		}, 3000);

		return () => {
			clearInterval(interval);
		};
	});

	onMount(() => (mounted = true));
</script>

{#if mounted}
	<div class="relative h-8 w-full">
		{#key currentText}
			<h3
				in:fly={{ delay: 500, x: 20 }}
				out:fly={{ x: -20 }}
				class="absolute left-0 w-full italic text-white"
			>
				{TEXTS[currentText]}
			</h3>
		{/key}
	</div>
{/if}
