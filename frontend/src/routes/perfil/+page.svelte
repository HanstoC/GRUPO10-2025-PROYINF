<script>
	import { RolUsuario, Usuario } from '$lib/auth.svelte';
  import { onMount } from 'svelte';
  

    let alumnos = [];
    let docentes =[];

  onMount(async () => {
    try {
      const [resAlumnos, resDocentes] = await Promise.all([
        fetch('http://localhost:8000/alumnos'),
        fetch('http://localhost:8000/docentes')
      ]);

      if (resAlumnos.ok) {
        const data = await resAlumnos.json();
        alumnos = data[0].alumnos;
      }

      if (resDocentes.ok) {
        const data = await resDocentes.json();
        docentes = data;
      }
    } catch (err) {
      console.error('Error de red:', err);
    }
  });
</script>

<h1>Mi perfil</h1>


<div class="flex h-full w-full flex-col items-center justify-center gap-1">
	{#if Usuario.value?.rol === RolUsuario.Alumno}
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

	{:else if Usuario.value?.rol === RolUsuario.Profesor}
    {#if docentes.length > 0}
    <ul>
      {#each docentes as docente}
        <li>
          <strong>{docente.nombres}</strong><br />
          RUT: {docente.rut}<br />
          Cargo: {docente.cargo}<br />
          Estamento: {docente.estamento}<br />
          Cargo: {docente.cargo}<br />
          Email: {docente.correo}<br />
          <hr />
        </li>
      {/each}
    </ul>
  {:else}
    <p>Cargando profesor</p>
  {/if}

	{/if}
</div>

