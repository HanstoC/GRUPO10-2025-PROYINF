<script>
  import { writable } from 'svelte/store';
    let input;
  let container;
  let image;
  let placeholder;
	let showImage = false;

  function onChange() {
    const file = input.files[0];
		
    if (file) {
			showImage = true;

      const reader = new FileReader();
      reader.addEventListener("load", function () {
        image.setAttribute("src", reader.result);
      });
      reader.readAsDataURL(file);
			
			return;
    } 
		showImage = false; 
  }

  export const pregunta = writable({
    topico: '',
    pregunta: '',
    respuesta1: '',
    respuesta2: '',
    respuesta3: '',
    respuesta4: ''
  });
</script>

<style>
  .content {
    display: grid;
    grid-template-columns: 80%;
    grid-column-gap: 10px;
    background-color: #6b6969;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1); /* opcional para darle un efecto de profundidad */
  }
  	div {
    width: 300px;
    min-height: 100px;
    border: 2px solid #000000;
    margin-top: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: #ccc;
  }
  img {
    width: 100%;
  }
</style>

<h1>Agregar preguntas al banco de preguntas</h1>
<form class="content">
  <label>Ingrese el topico de la pregunta</label>
  <input type="text" bind:value={$pregunta.topico} />
  <label>Ingrese la pregunta</label>
  <input type="text" bind:value={$pregunta.pregunta} />
  <label>Ingrese la respuesta a</label>
  <input type="text" bind:value={$pregunta.respuesta1} />
  <label>Ingrese la respuesta b</label>
  <input type="text" bind:value={$pregunta.respuesta2} />
  <label>Ingrese la respuesta c</label>
  <input type="text" bind:value={$pregunta.respuesta3} />
  <label>Ingrese la respuesta d</label>
  <input type="text" bind:value={$pregunta.respuesta4} />
<label>Agregue una imagen si es que la pregunta lo requiere</label>
<input
	bind:this={input}
	on:change={onChange}
    type="file"
/>
<div bind:this={container}>
	{#if showImage}
		<img bind:this={image} src="" alt="Preview" />
	{:else}
		<span bind:this={placeholder}>Image Preview</span>
	{/if}
</div>
</form>
<p>
	{JSON.stringify($pregunta)}</p>


