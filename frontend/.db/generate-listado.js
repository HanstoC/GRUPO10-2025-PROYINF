import fetch from 'node-fetch';
import { load } from 'cheerio';
import { readFile, writeFile } from 'fs/promises';
import { GoogleGenAI, Type } from '@google/genai';

Array.range = (start, end) =>
	!end
		? Array.from({ length: start }, (value, key) => key)
		: Array.from({ length: end - start }, (v, k) => k + start);

async function tryExecute(tries, what, delay) {
	for (let i = 0; i < tries; i++) {
		try {
			await what();
			return true;
		} catch (err) {
			if (delay && delay > 0) await new Promise((r) => setTimeout(r, delay));
		}
	}
	return false;
}

const ai = new GoogleGenAI({
	apiKey: process.env.GEN_API_KEY
});
let results;

(async () => {
	const YEARS = Array.range(2010, new Date().getFullYear() + 1);
	const BASE_URL = 'https://demre.cl/publicaciones/';

	if (false) {
		results = await Promise.all(
			YEARS.map(async (year) => {
				try {
					const html = await fetch(`${BASE_URL}listado-${year}`, {
						insecureHTTPParser: true
					}).then((r) => r.text());
					const $ = load(html);

					const titles = $('.publicaciones h2')
						.toArray()
						.map((el) => $(el).text())
						.filter((s) => s.trim());
					const listado = $('.publicaciones ul')
						.toArray()
						.map((el) =>
							$(el)
								.find(`a[href*="${year}"]`)
								.toArray()
								.map((el) => [
									$(el).find('span').text().trim().replace(/\t/g, '').replace(/\n/g, ' '),
									BASE_URL + $(el).attr('href')
								])
						);

					for (const section in listado) {
						for (const i in listado[section]) {
							const what = listado[section][i];

							await tryExecute(3, async () => {
								const html = await fetch(what[1], {
									insecureHTTPParser: true
								}).then((r) => r.text());
								const $ = load(html);

								listado[section][i] = {
									[what[0]]: {
										pdf: $('a[href*=".pdf"]').attr('href').replace('../', BASE_URL),
										description: $('.descripcion-publicacion')
											.text()
											.trim()
											.replace(/\t/g, '')
											.replace(/\n/g, ' ')
									}
								};
							});
						}
					}

					return [year, Object.fromEntries(titles.map((t, i) => [t, listado[i]]))];
				} catch (error) {
					console.error(error);
					return null;
				}
			})
		)
			.then((d) => d.filter((d) => d))
			//@ts-ignore
			.then((d) => Object.fromEntries(d));
		await writeFile('./listado.json', JSON.stringify(results), { encoding: 'utf-8' });
	}

	results = await readFile('./listado.json', { encoding: 'utf-8' }).then((r) => JSON.parse(r));
	const chat = ai.chats.create({
		model: 'gemini-2.0-flash',
		history: [
			{
				role: 'user',
				parts: [
					{
						text: [
							//
							'Te voy a entregar documentos de temarios para pruebas de acceso a la universidad en formato PDF.',
							`Resume los documentos de una manera dirigida al público que va a rendir estas pruebas, y enlista los contenidos que se van a evaluar para la prueba PAES. La respuesta será puesta en una página para revisar específicamente el temario, así que no escribas dirigiéndote específicamente hacia el público. (Ej: ¡Hola!, ¡Atención, futuros estudiantes!, etc...).`
						].join(' ')
					}
				]
			},
			{
				role: 'model',
				parts: [{ text: 'Entendido. Envíame los documentos para comenzar.' }]
			}
		]
	});

	let temarios = {};
	let year = new Date().getFullYear();
	for (const section in results[year]) {
		for (const i in results[year][section]) {
			const [key, value] = Object.entries(results[year][section][i])[0];
			if (!key.toLowerCase().includes('temario')) continue;

			let pdfResp;
			await tryExecute(3, async () => {
				pdfResp = await fetch(value.pdf, {
					insecureHTTPParser: true
				}).then((response) => (response.ok ? response.arrayBuffer() : null));
			});

			let json;
			if (pdfResp);
			{
				await tryExecute(
					3,
					async () => {
						try {
							const response = await chat.sendMessage({
								message: {
									inlineData: {
										mimeType: 'application/pdf',
										data: Buffer.from(pdfResp).toString('base64')
									}
								},
								config: {
									responseMimeType: 'application/json',
									responseSchema: {
										type: Type.OBJECT,
										properties: {
											descripcion: {
												type: Type.STRING,
												description:
													'Resumen de todo del documento. No debes decirlo como: "Este documento presenta...", debes ir directo al grano. Debe ser concreto y corto. Recuerda que el objetivo es el mismo público que va a rendir la prueba.',
												nullable: false
											},
											duracion: {
												type: Type.NUMBER,
												nullable: true,
												description:
													'Duración en horas de la prueba, si es que se encuentra disponible la información.'
											},
											preguntas: {
												type: Type.NUMBER,
												nullable: true,
												description:
													'Cantidad de preguntas de selección múltiple, si es que se encuentra disponible la información.'
											},
											contenidos: {
												type: Type.ARRAY,
												description: 'Contenidos a evaluar.',
												nullable: false,
												items: {
													type: Type.OBJECT,
													properties: {
														area: {
															type: Type.STRING,
															description: 'Titulo del área de conocimiento'
														},
														temas: {
															type: Type.ARRAY,
															items: {
																type: Type.OBJECT,
																properties: {
																	titulo: {
																		type: Type.STRING,
																		description: 'Titulo del tema bajo el área de conocimiento'
																	},
																	subtemas: {
																		type: Type.ARRAY,
																		description: 'Subtemas',
																		items: {
																			type: Type.STRING,
																			description: 'Título del subtema'
																		}
																	}
																},
																required: ['titulo', 'subtemas']
															}
														}
													},
													required: ['area', 'temas']
												}
											}
										},
										required: ['descripcion', 'contenidos']
									}
								}
							});

							json = JSON.parse(response.text ?? '{}');
							if (Object.values(json).length === 0) throw 'No se obtuvo JSON.';
							console.log(json);
						} catch (err) {
							console.error(err);
							throw err;
						}
					},
					5000
				);
			}

			if (!(year in temarios)) temarios[year] = {};
			temarios[year][key] = json;
		}
	}

	await writeFile('./temario.json', JSON.stringify(temarios), { encoding: 'utf-8' });
})();
