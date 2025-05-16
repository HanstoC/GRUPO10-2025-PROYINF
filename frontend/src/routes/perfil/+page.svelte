<script>
  import { onMount } from 'svelte';
  

    let alumnos = [];

  onMount(async () => {
    try {
      const res = await fetch('http://localhost:8000/alumnos');
      console.log(res);
      if (res.ok) {
        const data = await res.json();
        alumnos = data[0].alumnos;
        console.log('Alumnos recibidos:', alumnos);
      } else {
        console.error('Error HTTP:', res.status);
      }
    } catch (err) {
      console.error('Error de red:', err);
    }
  });
</script>

<h1>Mi perfil</h1>

{#if alumnos.length > 0}
  <ul>
    {#each alumnos as alumno}
      <li>
        <strong>{alumno.nombre} {alumno.paterno} {alumno.materno}</strong><br />
        RUT: {alumno.rut}<br />
        Género: {alumno.genero}<br />
        Fecha de nacimiento: {alumno.fecha_nacimiento}<br />
        Curso: {alumno.curso}<br />
        Email: {alumno.email}<br />
        Apoderado: {alumno.apoderado}<br />
        Nota final: {alumno.nota_final}<br />
        Asistencia: {alumno.asistencia}%
        <hr />
      </li>
    {/each}
  </ul>
{:else}
  <p>Cargando alumnos...</p>
{/if}
