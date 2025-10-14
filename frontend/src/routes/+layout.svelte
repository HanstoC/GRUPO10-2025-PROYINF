<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import Loader from '$lib/components/Loader.svelte';

	import '../app.css';
	import 'iconify-icon';

	import { page } from '$app/state';
	import { LINKS } from '$lib/global/links';
	import { AuthService } from '$lib/api/auth';
	import { goto } from '$app/navigation';
	import { Usuario } from '$lib/auth.svelte';

	let { children } = $props();
	const hasHeader = $derived(page.url.pathname !== LINKS.LOGIN && Usuario.value?.nombre);

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

<Loader />
{#if hasHeader}
	<Header />
{/if}
<div
	class={`flex ${hasHeader ? 'h-[calc(100%-3.5rem)]' : 'h-full'} flex-col items-center gap-2 overflow-auto`}
>
	{@render children()}
</div>
