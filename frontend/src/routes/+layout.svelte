<script lang="ts">
	import SideBar from '$lib/components/SideBar.svelte';

	import '../app.css';
	import 'iconify-icon';

	import { page } from '$app/state';
	import { LINKS } from '$lib/global/links';
	import { AuthService } from '$lib/api/auth';
	import { goto } from '$app/navigation';
	import { Usuario } from '$lib/auth.svelte';

	let { children } = $props();

	const currentPath = $derived(page.url.pathname);

	$effect.pre(() => {
		if (currentPath.match(/login|logout/g)) return;
		AuthService.checkLogged()
			.then((status) => {
				if (!status) goto(LINKS.LOGIN);
			})
			.catch((err) => {
				console.error(err);
				goto(LINKS.LOGIN);
			});
	});
</script>

<link rel="preload" href="/login-bg.png" as="image" />
<link rel="preload" href="/resultados-bg.jpg" as="image" />
<link rel="preload" href="/ensayos-bg.jpg" as="image" />

<div class="flex h-full max-h-screen w-full flex-row">
	<SideBar />
	<div
		class="bg-foreground/10 flex max-h-screen w-full flex-col items-center gap-2 overflow-y-hidden {Usuario
			.value?.rut && currentPath !== '/temarios'
			? 'p-8'
			: ''}"
	>
		{@render children()}
	</div>
</div>
