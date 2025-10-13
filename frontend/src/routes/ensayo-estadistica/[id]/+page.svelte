<script lang="ts">
	import { page } from '$app/state';
	import { AnalisisService } from '$lib/api/analisis';
	import Card from '$lib/components/common/Card.svelte';
	import InfoText from '$lib/components/common/InfoText.svelte';
	import PageMargin from '$lib/components/common/PageMargin.svelte';
	import LoadingIndicator from '$lib/components/common/utils/LoadingIndicator.svelte';
	import { slide } from 'svelte/transition';

	let graficoCanvas: HTMLCanvasElement | null = $state(null);
	let ctxGrafico: CanvasRenderingContext2D | null = $state(null);
	let chartInstance: any | null = $state(null);

	$effect(() => {
		if (graficoCanvas) {
			ctxGrafico = graficoCanvas.getContext('2d');
		}
	});

	const analisisPromise = $state(
		(async () => {
			const id = page.params.id;
			return Promise.all([
				AnalisisService.resumen(id).then((d) => d.data),
				AnalisisService.detalles(id).then((d) => d.data)
			]);
		})()
	);

	$effect(() => {
		if (ctxGrafico && analisisPromise) {
			analisisPromise.then((data) => {
				const [resumen, detalles] = data;
				if (!detalles.graph_data) return;

				const chartData = detalles.graph_data.map((item) => ({
					// Eje X: Número de Pregunta
					x: item.question_number,
					// Eje Y: Porcentaje de Acierto Promedio
					y: item.acierto_promedio * 100
				}));

				if (chartInstance) {
					chartInstance.destroy();
				}

				//@ts-ignore
				chartInstance = new Chart(ctxGrafico!, {
					type: 'scatter',
					data: {
						datasets: [
							{
								label: 'Rendimiento por Pregunta',
								data: chartData,
								backgroundColor: 'rgba(75, 192, 192, 0.6)',
								borderColor: 'rgba(75, 192, 192, 1)',
								showLine: true,
								pointRadius: 5
							}
						]
					},
					options: {
						animation: false,
						responsive: true,
						maintainAspectRatio: false,
						scales: {
							x: {
								type: 'linear',
								position: 'bottom',
								max: resumen.total_preguntas_ensayo,
								min: 1,
								title: {
									display: true,
									text: 'Número de Pregunta'
								}
							},
							y: {
								beginAtZero: true,
								max: 100,
								title: {
									display: true,
									text: 'Acierto Promedio (%)'
								},
								grid: {
									color: function (context: any) {
										if (context.tick.value > 50) return '#00FF0055';
										return '#FF000055';
									}
								}
							}
						}
					}
				});
			});
		}
	});
</script>

<PageMargin backButton text="Estadísticas">
	<Card class="w-full">
		{#await analisisPromise}
			<LoadingIndicator />
		{:then data}
			{@const [resumen, detalles] = data}
			{@const {
							total_alumnos,
							total_preguntas_ensayo,
							promedios_por_alumno,
							porcentaje_acierto_general
						}: {
							total_alumnos: number, 
							total_preguntas_ensayo: number,
							porcentaje_acierto_general: number,
							promedios_por_alumno: {
								aciertos: number,
								errores: number,
								omisiones: number
							}
						} = resumen}
			<div in:slide class="flex w-full flex-col items-center justify-between gap-2">
				{#snippet promedio(value: number, text: string, _class: string = '')}
					<div class="flex flex-col items-center justify-center {_class}">
						<h2>
							{value}%
						</h2>
						<p class="opacity-50">{text}</p>
					</div>
				{/snippet}

				<div class="w-full p-8">
					<div class="flex w-full flex-row items-center justify-around py-2">
						{@render promedio(promedios_por_alumno.aciertos, 'Promedio Aciertos', 'text-green-400')}
						{@render promedio(
							promedios_por_alumno.errores,
							'Promedio Errores',
							'text-destructive-foreground'
						)}
						{@render promedio(
							promedios_por_alumno.omisiones,
							'Promedio Omisiones',
							'text-warning-foreground'
						)}
						{@render promedio(
							porcentaje_acierto_general,
							'Acierto General',
							'text-muted-foreground'
						)}
					</div>

					<div class="w-full py-2 text-center">
						<p>{total_alumnos} alumnos en total rindieron el ensayo.</p>
						<p>{total_preguntas_ensayo} preguntas en total.</p>
					</div>
				</div>
				<div class="relative h-100 w-full">
					<canvas bind:this={graficoCanvas}></canvas>
				</div>
			</div>
		{:catch error}
			<InfoText variant="error">
				Ocurrió un error al cargar las estadísticas: {error.message}
			</InfoText>
		{/await}
	</Card>
</PageMargin>
