<script lang="ts">
	import { RolUsuario, Usuario } from '$lib/auth.svelte';
	import Avatar from '$lib/components/common/Avatar.svelte';
	import Card from '$lib/components/common/Card.svelte';
	import PageMargin from '$lib/components/common/PageMargin.svelte';
	import EnumHelper from '$lib/helpers/EnumHelper';

	let { rut, rol, nombre, correo, imagen } = Usuario.value ?? {};
</script>

<PageMargin>
	<Card size="lg" class="flex flex-col items-center justify-center gap-1">
		<div class="flex flex-row items-center justify-center gap-4">
			<Avatar class="h-10">
				{imagen}
			</Avatar>
			<h1>{nombre}</h1>
		</div>
		<p>{EnumHelper.rolUsuarioName(rol)}</p>
		<p>{correo}</p>
		<p>{rut}</p>
	</Card>
</PageMargin>
